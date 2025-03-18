import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import Video from "react-native-video";
import ScreenHeader from "../../../../components/patient/ScreenHeader";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/Root";
import { getExercisePrescriptions, ExercisePrescriptionItem } from "../../../../apis/exercisePrescription";
import { getVideoSource } from "../../../../components/patient/prescription/ExerciseMapping";

type ExerciseScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ExerciseScreen"
>;

const ExerciseScreen = () => {
  const navigation = useNavigation<ExerciseScreenNavigationProp>();
  const [exerciseGoals, setExerciseGoals] = useState<ExercisePrescriptionItem[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [repeatCount, setRepeatCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>({}); // ✅ 진행도 저장

  useEffect(() => {
    const fetchExerciseGoals = async () => {
      try {
        const goals = await getExercisePrescriptions();
        setExerciseGoals(goals.content);
        console.log("✅ 운동 목표 데이터:", goals.content);
      } catch (error) {
        console.error("🚨 운동 목표 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseGoals();
  }, []);

  const handleVideoEnd = () => {
    const currentExerciseName = exerciseGoals[currentVideoIndex]?.exerciseName;
    
    if (!currentExerciseName) return;
  
    setVideoProgress((prev) => {
      const updatedProgress = {
        ...prev,
        [currentExerciseName]: (prev[currentExerciseName] || 0) + 1,
      };
      console.log("📊 영상 진행도 업데이트:", updatedProgress);
      return updatedProgress;
    });
  
    if (repeatCount < 2) {
      setRepeatCount(repeatCount + 1);
    } else {
      if (currentVideoIndex < exerciseGoals.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1);
        setRepeatCount(0);
      }
    }
    const currentProgress = ((currentVideoIndex + 1) / exerciseGoals.length) * 100;
    setProgress(currentProgress);
  };
  
  const handleStopWatching = () => {
    setVideoProgress((prev) => {
      const updatedProgress = { ...prev }; // ✅ 최신 진행도를 복사
      console.log("✅ 최종 전달될 영상 진행도:", updatedProgress);
  
      // ✅ 바로 네비게이션 수행
      navigation.navigate("RecordScreen", { 
        progress, 
        videoProgress: updatedProgress, 
        exerciseGoals // ✅ 운동 목표 데이터도 함께 전달
      });
  
      return updatedProgress; // ✅ setState 업데이트 유지
    });
  };
  
  

  const currentExerciseName = exerciseGoals[currentVideoIndex]?.exerciseName;
  const videoSource = getVideoSource(currentExerciseName);

  return (
    <View style={styles.container}>
      <ScreenHeader />
      <View style={styles.videoContainer}>
        {videoSource ? (
          <Video
            key={currentVideoIndex}
            source={videoSource}
            style={styles.video}
            resizeMode="contain"
            controls
            onEnd={handleVideoEnd}
          />
        ) : (
          <Text style={styles.errorText}>🚨 해당 운동의 비디오가 없습니다.</Text>
        )}
      </View>
      <TouchableOpacity style={styles.stopButton} onPress={handleStopWatching}>
        <Text style={styles.stopButtonText}>그만 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExerciseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "90%",
    height: 220,
    backgroundColor: "#ddd",
  },
  stopButton: {
    backgroundColor: "#76DABF",
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  stopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noGoalText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 50,
    color: "#555",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
});

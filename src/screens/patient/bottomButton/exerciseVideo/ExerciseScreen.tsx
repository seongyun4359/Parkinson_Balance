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
import { getExercisePrescriptions, ExercisePrescriptionItem, saveExerciseHistory, getExerciseHistory } from "../../../../apis/exercisePrescription";
import { getVideoSource } from "../../../../components/patient/prescription/ExerciseMapping";

type ExerciseScreenNavigationProp = StackNavigationProp<RootStackParamList, "ExerciseScreen">;

const ExerciseScreen = () => {
  const navigation = useNavigation<ExerciseScreenNavigationProp>();
  const [exerciseGoals, setExerciseGoals] = useState<ExercisePrescriptionItem[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [repeatCount, setRepeatCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true);
        const goals = await getExercisePrescriptions();
        if (!goals.content || goals.content.length === 0) {
          console.warn("⚠️ 운동 목표 데이터를 불러올 수 없음.");
          setExerciseGoals([]);
          setLoading(false); // 🚀 무한 로딩 방지
          return;
        }
        setExerciseGoals(goals.content);
        console.log("✅ 운동 목표 데이터:", goals.content);

        // 서버에서 운동 기록 가져오기
        const historyData = await getExerciseHistory();
        const progressMap: Record<string, number> = {};
        historyData.content.forEach((history) => {
          progressMap[history.exerciseName] = history.completedSets;
        });

        setVideoProgress(progressMap);
        console.log("📥 서버에서 가져온 운동 진행도:", progressMap);

        // ✅ 첫 번째로 봐야 할 영상 자동 탐색
        findNextAvailableExercise(goals.content, progressMap);
      } catch (error) {
        console.error("🚨 운동 목표 또는 기록 가져오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, []);

  const findNextAvailableExercise = (exercises: ExercisePrescriptionItem[], progress: Record<string, number>) => {
    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      const watchedCount = progress[exercise.exerciseName] || 0;

      if (watchedCount < exercise.setCount) {
        setCurrentVideoIndex(i);
        setRepeatCount(exercise.setCount - watchedCount);
        return;
      }
    }

    navigation.navigate("RecordScreen", {
      progress: 100,
      videoProgress,
      exerciseGoals,
    });
  };

  const handleVideoEnd = async () => {
    const currentExercise = exerciseGoals[currentVideoIndex];
    if (!currentExercise) return;

    const currentExerciseName = currentExercise.exerciseName;
    const maxSetCount = currentExercise.setCount;

    setVideoProgress((prev) => {
      const watchedCount = (prev[currentExerciseName] || 0) + 1;
      const updatedProgress = {
        ...prev,
        [currentExerciseName]: watchedCount,
      };

      console.log("📊 영상 진행도 업데이트:", updatedProgress);

      // ✅ 서버에 운동 기록 저장 (phoneNumber 포함됨)
      saveExerciseHistory(currentExerciseName, watchedCount, maxSetCount)
        .then(() => console.log(`✅ ${currentExerciseName} 운동 기록 저장 완료!`))
        .catch((err) => console.error("🚨 운동 기록 저장 오류:", err));

      // ✅ 운동 목표를 다 채우면 다음 운동으로 이동
      if (watchedCount < maxSetCount) {
        setRepeatCount(maxSetCount - watchedCount);
      } else {
        findNextAvailableExercise(exerciseGoals, updatedProgress);
      }

      return updatedProgress;
    });
  };

  const handleStopWatching = () => {
    console.log("✅ 최종 전달될 영상 진행도:", videoProgress);
  
    // 🚀 정확한 완료율 계산 (전체 세트 대비 진행된 세트 비율)
    const totalSets = exerciseGoals.reduce((sum, goal) => sum + goal.setCount, 0);
    const completedSets = Object.entries(videoProgress).reduce((sum, [exercise, completed]) => {
      const goal = exerciseGoals.find((g) => g.exerciseName === exercise);
      return sum + (goal ? Math.min(completed, goal.setCount) : 0);
    }, 0);
  
    // ✅ `progress`를 `number` 타입으로 유지
    const finalProgress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  
    navigation.navigate("RecordScreen", {
      progress: parseFloat(finalProgress.toFixed(1)), // 🚀 `number` 타입으로 변환
      videoProgress,
      exerciseGoals,
    });
  };
  
  if (loading) {
    return <ActivityIndicator size="large" color="#76DABF" />;
  }

  if (exerciseGoals.length === 0) {
    return <Text style={styles.noGoalText}>운동 목표가 없습니다.</Text>;
  }

  const currentExercise = exerciseGoals[currentVideoIndex];
  const currentExerciseName = currentExercise?.exerciseName;
  const totalSets = currentExercise?.setCount || 0;
  const watchedSets = videoProgress[currentExerciseName] || 0;
  const videoSource = getVideoSource(currentExerciseName);

  return (
    <View style={styles.container}>
      <ScreenHeader />
      <View style={styles.videoContainer}>
        {videoSource ? (
          <Video source={videoSource} style={styles.video} resizeMode="contain" controls onEnd={handleVideoEnd} />
        ) : (
          <Text style={styles.errorText}>🚨 해당 운동의 비디오가 없습니다.</Text>
        )}
      </View>

      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseText}>{currentExerciseName}</Text>
        <Text style={styles.progressText}>
          진행 중: {watchedSets}/{totalSets} 세트
        </Text>
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
  exerciseInfo: {
    padding: 16,
    alignItems: "center",
  },
  exerciseText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  progressText: {
    fontSize: 16,
    color: "#555",
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

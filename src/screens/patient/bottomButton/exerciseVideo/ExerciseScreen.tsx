import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import Video from "react-native-video";
import type { VideoRef } from "react-native-video";
import ScreenHeader from "../../../../components/patient/ScreenHeader";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../navigation/Root";
import {
  getExercisePrescriptions,
  ExercisePrescriptionItem,
  getExerciseHistory,
  startExercise,
  completeExerciseSet,
} from "../../../../apis/exercisePrescription";
import { getVideoSource } from "../../../../components/patient/prescription/ExerciseMapping";

type ExerciseScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ExerciseScreen"
>;

const ExerciseScreen = () => {
  const navigation = useNavigation<ExerciseScreenNavigationProp>();
  const [exerciseGoals, setExerciseGoals] = useState<ExercisePrescriptionItem[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState<Record<number, number>>({});
  const [goalToHistoryMap, setGoalToHistoryMap] = useState<Record<number, number>>({});
  const [paused, setPaused] = useState(false);
  const playerRef = useRef<VideoRef>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const goals = await getExercisePrescriptions();
        setExerciseGoals(goals.content);

        const history = await getExerciseHistory();
        const progress: Record<number, number> = {};
        const goalHistoryMap: Record<number, number> = {};

        history.content.forEach((item) => {
          progress[item.historyId] = item.setCount || 0;
          const matchingGoal = goals.content.find((goal) => goal.exerciseName === item.exerciseName);
          if (matchingGoal) {
            goalHistoryMap[matchingGoal.goalId] = item.historyId;
          }
        });

        setVideoProgress(progress);
        setGoalToHistoryMap(goalHistoryMap);

        if (goals.content.length > 0 && !goalHistoryMap[goals.content[0].goalId]) {
          const newHistoryId = await startExercise(goals.content[0].goalId);
          if (newHistoryId) {
            setGoalToHistoryMap((prev) => ({ ...prev, [goals.content[0].goalId]: newHistoryId }));
          }
        }
      } catch (err) {
        console.error("🚨 데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVideoEnd = async () => {
    const currentExercise = exerciseGoals[currentVideoIndex];
    if (!currentExercise) return;

    const goalId = currentExercise.goalId;
    const historyId = goalToHistoryMap[goalId];

    if (!historyId) {
      console.warn("⚠️ 유효한 historyId 없음");
      return;
    }

    const watched = (videoProgress[historyId] || 0) + 1;

    try {
      const success = await completeExerciseSet(historyId);
      if (!success) return;

      setVideoProgress((prev) => ({ ...prev, [historyId]: watched }));

      if (watched >= currentExercise.setCount) {
        const nextIndex = currentVideoIndex + 1;
        if (nextIndex < exerciseGoals.length) {
          const nextGoalId = exerciseGoals[nextIndex].goalId;
          let nextHistoryId = goalToHistoryMap[nextGoalId];

          if (!nextHistoryId) {
            const newId = await startExercise(nextGoalId);
            if (newId) {
              setGoalToHistoryMap((prev) => ({ ...prev, [nextGoalId]: newId }));
            }
          }

          setCurrentVideoIndex(nextIndex);
        } else {
          navigateToRecord();
        }
      }
    } catch (err) {
      console.error("🚨 세트 완료 실패:", err);
    }
  };

  const navigateToRecord = () => {
    const totalSets = exerciseGoals.reduce((sum, g) => sum + g.setCount, 0);
    const done = Object.entries(goalToHistoryMap).reduce((sum, [goalId, historyId]) => {
      return sum + (videoProgress[historyId] || 0);
    }, 0);
    const progress = totalSets ? (done / totalSets) * 100 : 0;

    navigation.navigate("RecordScreen", {
      progress: parseFloat(progress.toFixed(1)),
      videoProgress,
      exerciseGoals,
    });
  };

  const handleStopWatching = () => {
    setPaused(true);
    navigateToRecord();
  };

  if (loading) return <ActivityIndicator size="large" color="#76DABF" />;
  if (exerciseGoals.length === 0)
    return <Text style={styles.noGoalText}>운동 목표가 없습니다.</Text>;

  const currentExercise = exerciseGoals[currentVideoIndex];
  const videoSource = getVideoSource(currentExercise.exerciseName);

  return (
    <View style={styles.container}>
      <ScreenHeader />
      <View style={styles.videoContainer}>
        {videoSource ? (
          <Video
            ref={playerRef}
            source={videoSource}
            style={styles.video}
            resizeMode="contain"
            controls
            paused={paused}
            onEnd={handleVideoEnd}
          />
        ) : (
          <Text style={styles.errorText}>🚨 해당 운동의 비디오가 없습니다.</Text>
        )}
      </View>
      <View style={styles.exerciseInfo}>
        <Text style={styles.exerciseText}>{currentExercise.exerciseName}</Text>
        <Text style={styles.progressText}>
          진행 중: {videoProgress[goalToHistoryMap[currentExercise.goalId]] || 0}/
          {currentExercise.setCount} 세트
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

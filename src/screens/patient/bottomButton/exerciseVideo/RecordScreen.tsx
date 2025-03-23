import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenHeader from "../../../../components/patient/ScreenHeader";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/Root";
import { getExerciseHistory, ExerciseHistoryItem, ExercisePrescriptionItem } from "../../../../apis/exercisePrescription";

type RecordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecordScreen"
>;
type RecordScreenRouteProp = RouteProp<RootStackParamList, "RecordScreen">;

const RecordScreen = () => {
  const navigation = useNavigation<RecordScreenNavigationProp>();
  const route = useRoute<RecordScreenRouteProp>();
  const { progress, exerciseGoals } = route.params || {
    progress: 0,
    exerciseGoals: [] as ExercisePrescriptionItem[],
  };

  const [exerciseHistory, setExerciseHistory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseHistory = async () => {
      try {
        setLoading(true);
        const historyData = await getExerciseHistory();
        console.log("📢 서버에서 가져온 운동 기록:", historyData.content);

        const historyMap: Record<string, number> = {};
        historyData.content.forEach((item) => {
          historyMap[item.exerciseName] = item.setCount || 0;
        });

        setExerciseHistory(historyMap);
      } catch (error) {
        console.error("🚨 운동 기록 불러오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseHistory();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#76DABF" />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader />

      <ScrollView style={styles.scrollContainer}>
        {exerciseGoals.map((exercise) => {
          const completedSets = exerciseHistory[exercise.exerciseName] || 0;
          const totalSets = exercise.setCount;
          const progressPercentage =
            totalSets > 0 ? ((completedSets / totalSets) * 100).toFixed(0) : "0";
          const isCompleted = completedSets >= totalSets;

          return (
            <View
              key={exercise.exerciseName}
              style={[
                styles.exerciseItem,
                isCompleted ? styles.completedExercise : styles.notStartedExercise,
              ]}
            >
              <Text style={styles.exerciseText}>{exercise.exerciseName}</Text>
              <Text style={styles.progressTextSmall}>
                {completedSets}/{totalSets} (세트) | {progressPercentage}%
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <Text style={styles.totalProgressText}>
        총 진행도: {parseFloat((progress ?? 0).toFixed(1))}%
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("PatientHome")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 10,
  },
  scrollContainer: {
    width: "100%",
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderColor: "#76DABF",
  },
  exerciseText: {
    fontSize: 16,
  },
  progressTextSmall: {
    fontSize: 14,
    color: "#666",
  },
  totalProgressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#76DABF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  completedExercise: {
    backgroundColor: "#76DABF",
    borderColor: "#76DABF",
  },
  notStartedExercise: {
    backgroundColor: "#FFF",
    borderColor: "#76DABF",
  },
});

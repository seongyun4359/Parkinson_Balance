import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ScreenHeader from "../../../../components/patient/ScreenHeader";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/Root";

type RecordScreenNavigationProp = StackNavigationProp<RootStackParamList, "RecordScreen">;
type RecordScreenRouteProp = RouteProp<RootStackParamList, "RecordScreen">;

const RecordScreen = () => {
  const navigation = useNavigation<RecordScreenNavigationProp>();
  const route = useRoute<RecordScreenRouteProp>();
  const { progress, videoProgress, exerciseGoals } = route.params || {
    progress: 0,
    videoProgress: {},
    exerciseGoals: [],
  };

  console.log("📢 RecordScreen.tsx - 받은 진행도:", videoProgress);

  return (
    <View style={styles.container}>
      <ScreenHeader />

      <ScrollView style={styles.scrollContainer}>
        {exerciseGoals.map((exercise) => {
          const count = videoProgress?.[exercise.exerciseName] ?? 0;
          const percentage = ((count / exercise.setCount) * 100).toFixed(0); // ✅ `setCount` 기준 진행도 계산
          const isCompleted = count >= exercise.setCount; // ✅ `setCount`만큼 완료했는지 확인

          return (
            <View
              key={exercise.exerciseName}
              style={[
                styles.exerciseItem,
                isCompleted ? styles.completedExercise : styles.notStartedExercise, // ✅ 완료 여부에 따라 스타일 적용
              ]}
            >
              <Text style={styles.exerciseText}>{exercise.exerciseName}</Text>
              <Text style={styles.progressTextSmall}>
                {count}/{exercise.setCount} (세트) | {percentage}%
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <Text style={styles.totalProgressText}>
        총 진행도: {progress.toFixed(1)}%
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
    borderColor: "#76DABF", // ✅ 테두리는 유지
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
    backgroundColor: "#76DABF", // ✅ 다 본 영상은 초록색
    borderColor: "#76DABF",
  },
  notStartedExercise: {
    backgroundColor: "#FFF", // ✅ 아직 보지 않은 영상은 흰색
    borderColor: "#76DABF",
  },
});

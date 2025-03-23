import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import CalendarComponent from "../../../components/patient/Calendar";
import ScreenHeader from "../../../components/patient/ScreenHeader";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../navigation/Root";
import { getExerciseHistory, getExercisePrescriptions } from "../../../apis/exercisePrescription"; 

type DayRecordScreenRouteProp = RouteProp<RootStackParamList, "DayRecord">;

const DayRecordScreen = () => {
  const route = useRoute<DayRecordScreenRouteProp>();

  // ✅ `date`가 `undefined`이면 오늘 날짜를 기본값으로 설정
  const today = new Date().toISOString().split("T")[0];
  const date = route.params?.date || today;

  const [exerciseGoals, setExerciseGoals] = useState<any[]>([]);
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        setLoading(true);

        // ✅ 1. 운동 목표(처방된 운동) 가져오기
        const goalsData = await getExercisePrescriptions();
        console.log("📢 운동 목표 데이터:", goalsData.content);

        // ✅ 2. 해당 날짜의 운동 기록 가져오기
        const historyData = date ? await getExerciseHistory(date) : await getExerciseHistory();
        console.log("📢 운동 기록 데이터:", historyData.content);

        // ✅ 서버 기록을 { 운동명: 완료된 세트 수 } 형태로 변환
        const historyMap = historyData.content.reduce((acc: Record<string, number>, item) => {
          const performedSets = typeof item.setCount === "number" ? item.setCount : 0;
          acc[item.exerciseName] = performedSets;
          return acc;
        }, {});
        
        

        setExerciseGoals(goalsData.content);
        setExerciseHistory(historyMap);
      } catch (error) {
        console.error("🚨 운동 기록 불러오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseData();
  }, [date]);

  if (loading) {
    return <ActivityIndicator size="large" color="#76DABF" />;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader />
      <CalendarComponent />

      <ScrollView style={styles.recordContainer}>
        <Text style={styles.dateText}>{date} 기록</Text>

        {exerciseGoals.length === 0 ? (
          <Text style={styles.noRecordText}>운동 목표가 없습니다.</Text>
        ) : (
          exerciseGoals.map((exercise) => {
            const completedSets = exerciseHistory[exercise.exerciseName] || 0;
            const totalSets = exercise.setCount || 0;
            const progress = totalSets > 0 ? parseFloat(((completedSets / totalSets) * 100).toFixed(0)) : 0;
            const isCompleted = completedSets >= totalSets;

            return (
              <View
                key={exercise.exerciseName}
                style={[
                  styles.recordBox,
                  isCompleted ? styles.completedExercise : styles.pendingExercise,
                ]}
              >
                <Text style={styles.recordLabel}>{exercise.exerciseName}</Text>
                <Text style={styles.recordResult}>
                  {completedSets}/{totalSets} 세트 | {progress}%
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default DayRecordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  recordContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#76DABF",
    marginBottom: 12,
  },
  noRecordText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  recordBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderColor: "#76DABF",
  },
  recordLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recordResult: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
  },
  completedExercise: {
    backgroundColor: "#76DABF",
    borderColor: "#76DABF",
  },
  pendingExercise: {
    backgroundColor: "#FFFFFF",
    borderColor: "#76DABF",
  },
});

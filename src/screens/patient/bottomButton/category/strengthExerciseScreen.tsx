import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ExerciseList from "../../../../components/patient/ExerciseList";

const exercises = [
  { id: "1", title: "엉덩이 들기", video: require("../../../../assets/video/2-1.mp4") },
  { id: "2", title: "엎드려 누운 상태에서 다리들기", video: require("../../../../assets/video/2-2.mp4") },
  { id: "3", title: "엉덩이 옆 근육 운동", video: require("../../../../assets/video/2-3.mp4") },
  { id: "4", title: "무릎 벌리기", video: require("../../../../assets/video/2-4.mp4") },
  { id: "5", title: "무릎 펴기", video: require("../../../../assets/video/2-5.mp4") },
  { id: "6", title: "런지", video: require("../../../../assets/video/2-6.mp4") },
  { id: "7", title: "좌우 런지", video: require("../../../../assets/video/2-7.mp4") },
  { id: "8", title: "발전된 런지", video: require("../../../../assets/video/2-8.mp4") },
  { id: "9", title: "손목 및 팔꿈치 주변 운동", video: require("../../../../assets/video/2-9.mp4") },
  { id: "10", title: "날개 뼈 모음 근육", video: require("../../../../assets/video/2-10.mp4") },
  { id: "11", title: "앉았다 일어서기", video: require("../../../../assets/video/2-11.mp4") },
  { id: "12", title: "발전된 앉았다 일어서기", video: require("../../../../assets/video/2-12.mp4") },
  { id: "13", title: "어깨 운동 1단계", video: require("../../../../assets/video/2-13.mp4") },
  { id: "14", title: "어깨 운동 2단계", video: require("../../../../assets/video/2-14.mp4") },
];

const StrengthExerciseScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>근력 운동</Text>
      <ExerciseList exercises={exercises} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#76DABF",
    marginBottom: 20,
  },
});

export default StrengthExerciseScreen;

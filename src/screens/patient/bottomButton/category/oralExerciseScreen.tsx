import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ExerciseList from "../../../../components/patient/ExerciseList";

const exercises = [
  { id: "1", title: "아에이오우", video: require("../../../../assets/video/4-1.mp4") },
  { id: "2", title: "파파파파파파", video: require("../../../../assets/video/4-2.mp4") },
  { id: "3", title: "쪽 소리내기", video: require("../../../../assets/video/4-3.mp4") },
  { id: "4", title: "혀로 볼 밀기", video: require("../../../../assets/video/4-4.mp4") },
  { id: "5", title: "혀로 입천장 밀기", video: require("../../../../assets/video/4-5.mp4") },
  { id: "6", title: "똑딱 소리내기", video: require("../../../../assets/video/4-6.mp4") },
  { id: "7", title: "혀 물고 침 삼키기", video: require("../../../../assets/video/4-7.mp4") },
  { id: "8", title: "아 짧게 소리내기", video: require("../../../../assets/video/4-8.mp4") },
  { id: "9", title: "아 길게 소리내기", video: require("../../../../assets/video/4-9.mp4") },
  { id: "10", title: "고음 가성으로 소리내기", video: require("../../../../assets/video/4-10.mp4") },
  { id: "11", title: "도레미파솔라시도", video: require("../../../../assets/video/4-11.mp4") },
  { id: "12", title: "큰 소리로 음절 읽기", video: require("../../../../assets/video/4-12.mp4") },
  { id: "13", title: "큰 소리로 글 읽기", video: require("../../../../assets/video/4-13.mp4") },
  { id: "14", title: "애국가 부르기", video: require("../../../../assets/video/4-14.mp4") },
];

const OralExerciseScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>구강/발성 운동</Text>
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

export default OralExerciseScreen;

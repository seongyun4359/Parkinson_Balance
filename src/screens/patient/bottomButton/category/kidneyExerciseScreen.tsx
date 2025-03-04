import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ExerciseList from "../../../../components/patient/ExerciseList";

const exercises = [
  { id: "1", title: "목 앞 근육 스트레칭", video: require("../../../../assets/video/1-1.mp4") },
  { id: "2", title: "목 좌우 근육 스트레칭", video: require("../../../../assets/video/1-2.mp4") },
  { id: "3", title: "몸통 앞쪽 근육 스트레칭", video: require("../../../../assets/video/1-3.mp4") },
  { id: "4", title: "몸통 옆쪽 근육 스트레칭", video: require("../../../../assets/video/1-4.mp4") },
  { id: "5", title: "몸통 회전 근육 스트레칭", video: require("../../../../assets/video/1-5.mp4") },
  { id: "6", title: "몸통 스트레칭 1단계", video: require("../../../../assets/video/1-6.mp4") },
  { id: "7", title: "몸통 스트레칭 2단계", video: require("../../../../assets/video/1-7.mp4") },
  { id: "8", title: "날개뼈 움직이기", video: require("../../../../assets/video/1-8.mp4") },
  { id: "9", title: "어깨 들어올리기", video: require("../../../../assets/video/1-9.mp4") },
  { id: "10", title: "날개뼈 모으기", video: require("../../../../assets/video/1-10.mp4") },
  { id: "11", title: "손목 및 팔꿈치 주변 근육 스트레칭", video: require("../../../../assets/video/1-11.mp4") },
  { id: "12", title: "허벅지 및 종아리 근육 스트레칭", video: require("../../../../assets/video/1-12.mp4") },
];

const KidneyExerciseScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>신장운동</Text>
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

export default KidneyExerciseScreen;

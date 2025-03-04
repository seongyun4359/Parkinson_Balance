import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ExerciseList from "../../../../components/patient/ExerciseList";

const exercises = [
  { id: "1", title: "한발 서기", video: require("../../../../assets/video/3-1.mp4") },
  { id: "2", title: "버드독 1단계", video: require("../../../../assets/video/3-2.mp4") },
  { id: "3", title: "버드독 2단계", video: require("../../../../assets/video/3-3.mp4") },
  { id: "4", title: "앉은 상태에서 제자리 걷기", video: require("../../../../assets/video/3-4.mp4") },
  { id: "5", title: "움직이는 런지", video: require("../../../../assets/video/3-5.mp4") },
];

const BalanceExerciseScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>균형/협응 운동</Text>
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

export default BalanceExerciseScreen;

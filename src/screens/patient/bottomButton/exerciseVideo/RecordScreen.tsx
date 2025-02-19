import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import ScreenHeader from "../../../../components/patient/ScreenHeader"
import { StackNavigationProp } from "@react-navigation/stack"
import { RouteProp } from "@react-navigation/native"
import { RootStackParamList } from "../../../../navigation/Root"

type RecordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RecordScreen"
>

type RecordScreenRouteProp = RouteProp<RootStackParamList, "RecordScreen">

const RecordScreen = () => {
  const navigation = useNavigation<RecordScreenNavigationProp>()
  const route = useRoute<RecordScreenRouteProp>()
  const { progress, videoProgress } = route.params || {
    progress: 0,
    videoProgress: [],
  }

  // 1-1 ~ 4-14 운동 이름 배열 만들기
  const exerciseList = Array.from({ length: 12 }, (_, i) => `1-${i + 1}`)
    .concat(Array.from({ length: 14 }, (_, i) => `2-${i + 1}`))
    .concat(Array.from({ length: 5 }, (_, i) => `3-${i + 1}`))
    .concat(Array.from({ length: 14 }, (_, i) => `4-${i + 1}`))

  return (
    <View style={styles.container}>
      <ScreenHeader />

      <ScrollView style={styles.scrollContainer}>
        {exerciseList.map((exercise, index) => {
          const count = videoProgress?.[index] ?? 0
          const percentage = ((count / 3) * 100).toFixed(0)

          return (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseText}>{exercise}</Text>
              <Text style={styles.progressTextSmall}>
                {count}/3 (회) | {percentage}%
              </Text>
            </View>
          )
        })}
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate("PatientHome")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </View>
  )
}

export default RecordScreen

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
    borderColor: "#76DABF",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  exerciseText: {
    fontSize: 16,
  },
  progressTextSmall: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#666",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#666",
    fontSize: 14,
  },
})

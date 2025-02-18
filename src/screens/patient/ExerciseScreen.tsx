import React, { useState } from "react"
import { View, StyleSheet, TouchableOpacity, Text } from "react-native"
import Video from "react-native-video"
import ScreenHeader from "../../components/patient/ScreenHeader"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../../navigation/Root"

type ExerciseScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ExerciseScreen"
>

const ExerciseScreen = () => {
  const navigation = useNavigation<ExerciseScreenNavigationProp>()

  const videoSources = [
    // 1세트 (1-1 ~ 1-12)
    require("../../assets/video/1-1.mp4"),
    require("../../assets/video/1-2.mp4"),
    require("../../assets/video/1-3.mp4"),
    require("../../assets/video/1-4.mp4"),
    require("../../assets/video/1-5.mp4"),
    require("../../assets/video/1-6.mp4"),
    require("../../assets/video/1-7.mp4"),
    require("../../assets/video/1-8.mp4"),
    require("../../assets/video/1-9.mp4"),
    require("../../assets/video/1-10.mp4"),
    require("../../assets/video/1-11.mp4"),
    require("../../assets/video/1-12.mp4"),
  
    // 2세트 (2-1 ~ 2-14)
    require("../../assets/video/2-1.mp4"),
    require("../../assets/video/2-2.mp4"),
    require("../../assets/video/2-3.mp4"),
    require("../../assets/video/2-4.mp4"),
    require("../../assets/video/2-5.mp4"),
    require("../../assets/video/2-6.mp4"),
    require("../../assets/video/2-7.mp4"),
    require("../../assets/video/2-8.mp4"),
    require("../../assets/video/2-9.mp4"),
    require("../../assets/video/2-10.mp4"),
    require("../../assets/video/2-11.mp4"),
    require("../../assets/video/2-12.mp4"),
    require("../../assets/video/2-13.mp4"),
    require("../../assets/video/2-14.mp4"),
  
    // 3세트 (3-1 ~ 3-5)
    require("../../assets/video/3-1.mp4"),
    require("../../assets/video/3-2.mp4"),
    require("../../assets/video/3-3.mp4"),
    require("../../assets/video/3-4.mp4"),
    require("../../assets/video/3-5.mp4"),
  
    // 4세트 (4-1 ~ 4-14)
    require("../../assets/video/4-1.mp4"),
    require("../../assets/video/4-2.mp4"),
    require("../../assets/video/4-3.mp4"),
    require("../../assets/video/4-4.mp4"),
    require("../../assets/video/4-5.mp4"),
    require("../../assets/video/4-6.mp4"),
    require("../../assets/video/4-7.mp4"),
    require("../../assets/video/4-8.mp4"),
    require("../../assets/video/4-9.mp4"),
    require("../../assets/video/4-10.mp4"),
    require("../../assets/video/4-11.mp4"),
    require("../../assets/video/4-12.mp4"),
    require("../../assets/video/4-13.mp4"),
    require("../../assets/video/4-14.mp4"),
  ]  

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [repeatCount, setRepeatCount] = useState(0)
  const [progress, setProgress] = useState(0)


  const handleVideoEnd = () => {
    if (repeatCount < 2) {
      setRepeatCount(repeatCount + 1)
    } else {
      if (currentVideoIndex < videoSources.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1)
        setRepeatCount(0)
      }
    }
    const currentProgress = ((currentVideoIndex + 1) / videoSources.length) * 100
    setProgress(currentProgress)
  }
  

  const handleStopWatching = () => {
    navigation.navigate("RecordScreen", { progress, videoProgress: [] })
  }
  
  return (
    <View style={styles.container}>
      <ScreenHeader />
      <View style={styles.videoContainer}>
        <Video
          key={currentVideoIndex}
          source={videoSources[currentVideoIndex]}
          style={styles.video}
          resizeMode="contain"
          controls
          onEnd={handleVideoEnd}
        />
      </View>
      <TouchableOpacity style={styles.stopButton} onPress={handleStopWatching}>
        <Text style={styles.stopButtonText}>그만 보기</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ExerciseScreen

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
})

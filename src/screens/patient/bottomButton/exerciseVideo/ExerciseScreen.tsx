// 기존 import 구문 그대로 유지
import React, { useState, useEffect, useRef } from "react"
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native"
import Video from "react-native-video"
import type { VideoRef } from "react-native-video"
import ScreenHeader from "../../../../components/patient/ScreenHeader"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../../../../navigation/Root"
import {
  getExercisePrescriptionsByDate,
  ExercisePrescriptionItem,
  getExerciseHistory,
  completeExerciseSet,
  completeAerobicExercise,
} from "../../../../apis/exercisePrescription"
import { getVideoSource } from "../../../../components/patient/prescription/ExerciseMapping"
import AsyncStorage from "@react-native-async-storage/async-storage"

type ExerciseScreenNavigationProp = StackNavigationProp<RootStackParamList, "ExerciseScreen">

const ExerciseScreen = () => {
  const navigation = useNavigation<ExerciseScreenNavigationProp>()
  const [exerciseGoals, setExerciseGoals] = useState<ExercisePrescriptionItem[]>([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [videoProgress, setVideoProgress] = useState<Record<number, number>>({})
  const [goalToHistoryMap, setGoalToHistoryMap] = useState<Record<number, number>>({})
  const [paused, setPaused] = useState(false)
  const [isAerobicActive, setIsAerobicActive] = useState(false)
  const [aerobicSecondsLeft, setAerobicSecondsLeft] = useState(0)
  const playerRef = useRef<VideoRef>(null)

  const todayDate = new Date().toISOString().split("T")[0]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const response = await getExercisePrescriptionsByDate(todayDate)
        const goals = response.content || []

        const historyData = await getExerciseHistory(todayDate)
        const existingMap: Record<number, number> = {}
        const progress: Record<number, number> = {}
        const goalHistoryMap: Record<number, number> = {}

        historyData.content.forEach((item) => {
          const createdDate = item.createdAt?.split("T")[0]
          const matchGoal = goals.find(
            (g) => g.exerciseName === item.exerciseName && g.createdAt === createdDate
          )
          if (matchGoal) {
            existingMap[matchGoal.goalId] = item.historyId
            progress[item.historyId] = item.completedCount ?? 0
          }
        })

        for (const goal of goals) {
          let historyId = existingMap[goal.goalId]
          const isDone = historyId && (progress[historyId] ?? 0) >= goal.setCount

          if (!historyId) {
            const match = historyData.content.find(
              (h) => h.exerciseName === goal.exerciseName
            )
            if (match) {
              historyId = match.historyId
              progress[historyId] = match.completedCount ?? 0
            }
          }

          if (!historyId || isDone) continue

          goalHistoryMap[goal.goalId] = historyId
        }

        setExerciseGoals(goals)
        setVideoProgress(progress)
        setGoalToHistoryMap(goalHistoryMap)

        const firstIndex = findNextIncompleteIndex(goals, goalHistoryMap, progress)
        if (firstIndex !== -1 && goals[firstIndex]) {
          setCurrentVideoIndex(firstIndex)
        } else {
          navigateToRecord(goals, goalHistoryMap, progress)
        }
      } catch (err) {
        console.error("🚨 데이터 로딩 실패:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!isAerobicActive || aerobicSecondsLeft <= 0) return
    const timer = setInterval(() => {
      setAerobicSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAerobicComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isAerobicActive, aerobicSecondsLeft])

  useEffect(() => {
    const seekToSavedPosition = async () => {
      const current = exerciseGoals[currentVideoIndex]
      if (!current) return
      const key = `video-position-${current.goalId}`
      const saved = await AsyncStorage.getItem(key)
      const seconds = saved ? parseFloat(saved) : 0
      if (playerRef.current && seconds > 0) {
        playerRef.current.seek(seconds)
      }
    }

    seekToSavedPosition()
  }, [currentVideoIndex])

  const handleVideoProgress = async (data: { currentTime: number }) => {
    const current = exerciseGoals[currentVideoIndex]
    if (!current) return
    const key = `video-position-${current.goalId}`
    await AsyncStorage.setItem(key, String(data.currentTime))
  }

  const findNextIncompleteIndex = (
    goals: ExercisePrescriptionItem[],
    historyMap: Record<number, number>,
    progressMap: Record<number, number>
  ): number => {
    for (let i = 0; i < goals.length; i++) {
      const goal = goals[i]
      const historyId = historyMap[goal.goalId]
      const watched = progressMap[historyId] || 0
      if (watched < goal.setCount) return i
    }
    return -1
  }

  const isAerobicExercise = (name: string) =>
    name.includes("걷기") || name.includes("자전거 타기")

  const handleVideoEnd = async () => {
    const current = exerciseGoals[currentVideoIndex]
    if (!current) return
    const goalId = current.goalId
    const historyId = goalToHistoryMap[goalId]
    if (typeof historyId !== "number") return

    const watched = (videoProgress[historyId] || 0) + 1

    if (isAerobicExercise(current.exerciseName)) {
      setPaused(true)
      setIsAerobicActive(true)
      setAerobicSecondsLeft(current.duration * 60)
      return
    }

    const success = await completeExerciseSet(historyId)
    if (!success) return

    const updated = { ...videoProgress, [historyId]: watched }
    setVideoProgress(updated)

    if (watched >= current.setCount) {
      const next = findNextIncompleteIndex(exerciseGoals, goalToHistoryMap, updated)
      if (next !== -1) setCurrentVideoIndex(next)
      else navigateToRecord(exerciseGoals, goalToHistoryMap, updated)
    } else {
      setTimeout(() => setPaused(false), 100)
    }
  }

  const handleAerobicComplete = async () => {
    const current = exerciseGoals[currentVideoIndex]
    if (!current) return
    const goalId = current.goalId
    const historyId = goalToHistoryMap[goalId]
    if (typeof historyId !== "number") return

    const success = await completeAerobicExercise(historyId)
    if (!success) return

    const updated = { ...videoProgress, [historyId]: 1 }
    setVideoProgress(updated)
    setIsAerobicActive(false)

    const next = findNextIncompleteIndex(exerciseGoals, goalToHistoryMap, updated)
    if (next !== -1) setCurrentVideoIndex(next)
    else navigateToRecord(exerciseGoals, goalToHistoryMap, updated)
  }

  const navigateToRecord = (
    goals = exerciseGoals,
    map = goalToHistoryMap,
    progress = videoProgress
  ) => {
    const totalSets = goals.reduce((sum, g) => sum + g.setCount, 0)
    const done = Object.entries(map).reduce(
      (sum, [_, historyId]) => sum + (progress[historyId] || 0),
      0
    )
    const percent = totalSets ? (done / totalSets) * 100 : 0

    navigation.navigate("RecordScreen", {
      progress: parseFloat(percent.toFixed(1)),
      videoProgress: progress,
      exerciseGoals: goals,
    })
  }

  const handleStopWatching = () => {
    setPaused(true)
    navigateToRecord()
  }

  if (loading) return <ActivityIndicator size="large" color="#76DABF" />
  if (exerciseGoals.length === 0)
    return <Text style={styles.noGoalText}>운동 목표가 없습니다.</Text>

  const currentExercise = exerciseGoals[currentVideoIndex]
  const videoSource = getVideoSource(currentExercise.exerciseName)

  return (
    <View style={styles.container}>
      <ScreenHeader />
      <View style={styles.videoContainer}>
        {isAerobicActive ? (
          <Text style={styles.timerText}>
            유산소 운동 중... 남은 시간: {Math.floor(aerobicSecondsLeft / 60)}:
            {String(aerobicSecondsLeft % 60).padStart(2, "0")}
          </Text>
        ) : videoSource ? (
          <Video
            ref={playerRef}
            source={videoSource}
            style={styles.video}
            resizeMode="contain"
            controls
            paused={paused}
            onEnd={handleVideoEnd}
            onProgress={handleVideoProgress} // ✅ 추가
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
  timerText: {
    fontSize: 24,
    color: "#76DABF",
    fontWeight: "bold",
  },
})
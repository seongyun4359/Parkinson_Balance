import React, { useState, useEffect, useRef } from "react"
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, AppState } from "react-native"
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
	startExercise,
	ExerciseHistoryItem,
} from "../../../../apis/exercisePrescription"
import { getVideoSource } from "../../../../components/patient/prescription/ExerciseMapping"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getUserInfo } from "../../../../apis/auth"
import Ionicons from "react-native-vector-icons/Ionicons"

type ExerciseScreenNavigationProp = StackNavigationProp<RootStackParamList, "ExerciseScreen">

const isValidHistory = (item: ExerciseHistoryItem): boolean =>
	item.status === "PROGRESS" || item.status === "COMPLETE"

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
	const [appState, setAppState] = useState(AppState.currentState)

	const todayDate = new Date().toISOString().split("T")[0]
	const [storagePrefix, setStoragePrefix] = useState<string | null>(null)

	useEffect(() => {
		const prepare = async () => {
			const user = await getUserInfo()
			if (!user?.phoneNumber) return
			setStoragePrefix(user.phoneNumber)
		}
		prepare()
	}, [])

	useEffect(() => {
		if (!storagePrefix) return

		const fetchData = async () => {
			try {
				setLoading(true)
				const response = await getExercisePrescriptionsByDate(todayDate)
				const goals = response.content || []

				const priority = [
					"신장 운동",
					"근력 운동",
					"균형 및 협응 운동",
					"구강/발성 운동",
					"유산소 운동",
				]

				goals.sort((a, b) => {
					const aIndex = priority.indexOf(a.exerciseType)
					const bIndex = priority.indexOf(b.exerciseType)
					return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
				  })

				const historyData = await getExerciseHistory(todayDate)
				const existingMap: Record<number, number> = {}
				const progress: Record<number, number> = {}
				const goalHistoryMap: Record<number, number> = {}

				const storedProgress = await AsyncStorage.getItem(`${storagePrefix}-videoProgress`)
				const restoredProgress: Record<number, number> = storedProgress
					? JSON.parse(storedProgress)
					: {}

				historyData.content.forEach((item: ExerciseHistoryItem) => {
					const createdDate = item.createdAt?.split("T")[0]
					if (!isValidHistory(item)) return
					const matchGoal = goals.find(
						(g) => g.exerciseName === item.exerciseName && g.createdAt === createdDate
					)
					if (matchGoal) {
						existingMap[matchGoal.goalId] = item.historyId
						progress[item.historyId] = restoredProgress[item.historyId] ?? item.completedCount ?? 0
					}
				})

				for (const goal of goals) {
					let historyId = existingMap[goal.goalId]
					const isDone = historyId && (progress[historyId] ?? 0) >= goal.setCount

					if (isDone) {
						goalHistoryMap[goal.goalId] = historyId
						continue
					}

					// 먼저 기존 히스토리 중 진행 중인 게 있는지 찾기
					const progressHistory = historyData.content.find(
						(h) => h.exerciseName === goal.exerciseName && h.status === "PROGRESS"
					)
					if (progressHistory) {
						historyId = progressHistory.historyId
						progress[historyId] = restoredProgress[historyId] ?? progressHistory.completedCount ?? 0
					} else if (!historyId) {
						// 새 history 생성 시도
						const newHistory = await startExercise(goal.goalId)

						if (newHistory && typeof newHistory === "object" && "historyId" in newHistory) {
							const { historyId } = newHistory as { historyId: number }
							progress[historyId] = 0
						} else {
							console.warn("⚠️ historyId 없음, fallback 재시도 전 대기 중...")
							await new Promise((res) => setTimeout(res, 300)) // 잠깐 대기

							// fallback 재조회
							const refreshedHistory = await getExerciseHistory(todayDate)
							const retry = (refreshedHistory.content as ExerciseHistoryItem[]).find(
								(h: ExerciseHistoryItem) =>
									h.exerciseName === goal.exerciseName && h.status === "PROGRESS"
							)

							if (retry) {
								historyId = retry.historyId
								progress[historyId] = restoredProgress[retry.historyId] ?? retry.completedCount ?? 0
							} else {
								console.error("❌ 운동 시작 실패: historyId 없음 + 최종 fallback 실패", newHistory)
								continue
							}
						}
					}

					goalHistoryMap[goal.goalId] = historyId
				}

				setExerciseGoals(goals)
				setVideoProgress(progress)
				setGoalToHistoryMap(goalHistoryMap)

				// aerobicStartTime 복원
				// aerobicStartTime 복원
				const aerobicKey = `${storagePrefix}-aerobicStartTime`
				const storedStartTime = await AsyncStorage.getItem(aerobicKey)
				if (storedStartTime) {
					const elapsed = Math.floor((Date.now() - Number(storedStartTime)) / 1000)
					const goal = goals.find((g) => isAerobicExercise(g.exerciseName))

					if (goal && goal.duration) {
						const totalSeconds = goal.duration
						const remaining = totalSeconds - elapsed

						console.log(
							"⏱ elapsed:",
							elapsed,
							"remaining:",
							remaining,
							"goal.duration:",
							goal.duration
						)

						// ✅ 예외적으로 음수이거나 비정상적인 값이면 무시
						if (elapsed < 0 || elapsed > totalSeconds + 300) {
							console.warn("⚠️ elapsed 비정상, 유산소 운동 무시됨")
							return
						}

						// ⏳ 남은 시간 있다면 복원
						if (remaining > 0 && remaining <= totalSeconds) {
							setPaused(true)
							setIsAerobicActive(true)
							setAerobicSecondsLeft(remaining)
						}
						// ✅ 0초 이하라면 완료 처리
						else if (remaining <= 0) {
							const historyId = goalHistoryMap[goal.goalId]
							if (historyId && !isAerobicActive) {
								await completeAerobicExercise(historyId)
								await AsyncStorage.removeItem(aerobicKey)
							}
						}
					}
				}

				const savedIndex = await AsyncStorage.getItem(`${storagePrefix}-currentVideoIndex`)
				const firstIndex = findNextIncompleteIndex(goals, goalHistoryMap, progress)

				// ✅ 추가된 부분: 모든 운동 완료 시 자동 이동
				if (goals.length > 0 && firstIndex === -1) {
					navigateToRecord(goals, goalHistoryMap, progress)
					return
				}

				if (savedIndex !== null) {
					const restoredIndex = parseInt(savedIndex, 10)
					const restoredGoal = goals[restoredIndex]
					const restoredHistoryId = goalHistoryMap[restoredGoal?.goalId]
					const restoredProgressCount = progress[restoredHistoryId] || 0

					if (
						restoredIndex >= 0 &&
						restoredIndex < goals.length &&
						restoredProgressCount < restoredGoal.setCount
					) {
						setCurrentVideoIndex(restoredIndex)
					} else if (firstIndex !== -1) {
						setCurrentVideoIndex(firstIndex)
					} else {
						navigateToRecord(goals, goalHistoryMap, progress)
					}
				} else if (firstIndex !== -1) {
					setCurrentVideoIndex(firstIndex)
				}
			} catch (err) {
				console.error("🚨 데이터 로딩 실패:", err)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [storagePrefix])

	const appStateRef = useRef(appState)
	useEffect(() => {
		appStateRef.current = appState
	}, [appState])

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null
		if (appState === "active" && isAerobicActive && !paused && aerobicSecondsLeft > 0) {
			timer = setInterval(() => {
				setAerobicSecondsLeft((prev) => {
					if (prev <= 1) {
						clearInterval(timer!)
						handleAerobicComplete()
						return 0
					}
					return prev - 1
				})
			}, 1000)
		}
		return () => {
			if (timer) clearInterval(timer)
		}
	}, [appState, isAerobicActive, paused, aerobicSecondsLeft])

	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
			if (!isAerobicActive || !storagePrefix) return
			const key = `${storagePrefix}-aerobicRemainingTime`
			if (nextAppState === "background") {
				// 백그라운드로 갈 때 현재 남은 시간을 저장
				AsyncStorage.setItem(key, String(aerobicSecondsLeft))
			} else if (nextAppState === "active") {
				// active로 돌아오면 저장된 값을 지우고, 타이머는 useEffect에서 다시 시작됨
				AsyncStorage.removeItem(key)
			}
			setAppState(nextAppState)
		})
		return () => {
			subscription.remove()
		}
	}, [isAerobicActive, storagePrefix, aerobicSecondsLeft])

	const saveVideoProgress = async (progress: Record<number, number>) => {
		if (!storagePrefix) return
		await AsyncStorage.setItem(`${storagePrefix}-videoProgress`, JSON.stringify(progress))
	}

	const handleVideoProgress = async (data: { currentTime: number }) => {
		const current = exerciseGoals[currentVideoIndex]
		if (!current || !storagePrefix) return
		const key = `${storagePrefix}-video-position-${current.goalId}`
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

	const isAerobicExercise = (name: string) => {
		const aerobicNames = ["걷기", "자전거 타기"]
		return aerobicNames.includes(name)
	}

	const handleVideoEnd = async () => {
		const current = exerciseGoals[currentVideoIndex]
		if (!current) return
		const goalId = current.goalId
		const historyId = goalToHistoryMap[goalId]
		if (typeof historyId !== "number") return

		const currentCount = videoProgress[historyId] || 0

		if (currentCount >= current.setCount) {
			const next = findNextIncompleteIndex(exerciseGoals, goalToHistoryMap, videoProgress)
			if (next !== -1) {
				setCurrentVideoIndex(next)
				await AsyncStorage.setItem(`${storagePrefix}-currentVideoIndex`, String(next))
			} else {
				await AsyncStorage.multiRemove([
					`${storagePrefix}-videoProgress`,
					`${storagePrefix}-currentVideoIndex`,
				])
				navigateToRecord(exerciseGoals, goalToHistoryMap, videoProgress)
			}
			return
		}

		if (isAerobicExercise(current.exerciseName)) {
			setPaused(true)
			setIsAerobicActive(true)
			const seconds = currentExercise.duration
			const now = Math.floor(Date.now() / 1000)
			await AsyncStorage.setItem(`${storagePrefix}-aerobicStartTime`, String(now))
			setAerobicSecondsLeft(seconds)
			return
		}

		const success = await completeExerciseSet(historyId)
		if (!success) return

		const updated = { ...videoProgress, [historyId]: currentCount + 1 }
		setVideoProgress(updated)
		await saveVideoProgress(updated)

		if (updated[historyId] >= current.setCount) {
			const next = findNextIncompleteIndex(exerciseGoals, goalToHistoryMap, updated)
			if (next !== -1) {
				setCurrentVideoIndex(next)
				await AsyncStorage.setItem(`${storagePrefix}-currentVideoIndex`, String(next))
			} else {
				navigateToRecord(exerciseGoals, goalToHistoryMap, updated)
			}
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

		// 운동 완료 후 상태 저장
		const updated = { ...videoProgress, [historyId]: 1 }
		setVideoProgress(updated)
		await saveVideoProgress(updated)
		setIsAerobicActive(false)
		await AsyncStorage.removeItem(`${storagePrefix}-aerobicStartTime`)

		// 현재 상태 저장
		await AsyncStorage.setItem(`${storagePrefix}-currentVideoIndex`, String(currentVideoIndex))
		const next = findNextIncompleteIndex(exerciseGoals, goalToHistoryMap, updated)
		if (next !== -1) {
			setCurrentVideoIndex(next)
			await AsyncStorage.setItem(`${storagePrefix}-currentVideoIndex`, String(next))
		} else {
			navigateToRecord(exerciseGoals, goalToHistoryMap, updated)
		}
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

	const handleStopWatching = async () => {
		setPaused(true)
		await saveVideoProgress(videoProgress)
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
				{isAerobicExercise(currentExercise.exerciseName) ? (
					isAerobicActive ? (
						<View style={styles.videoContainer}>
							<Text style={styles.timerText}>
								남은 시간 {String(Math.floor(aerobicSecondsLeft / 60)).padStart(2, "0")}:
								{String(aerobicSecondsLeft % 60).padStart(2, "0")}
							</Text>
							<TouchableOpacity onPress={() => setPaused((prev) => !prev)}>
								<Ionicons
									name={paused ? "play-circle-outline" : "pause-circle-outline"}
									size={56}
									color="#76DABF"
								/>
							</TouchableOpacity>
						</View>
					) : (
						<TouchableOpacity
							onPress={async () => {
								setPaused(false)
								setIsAerobicActive(true)
								const seconds = currentExercise.duration
								const now = Date.now()
								await AsyncStorage.setItem(`${storagePrefix}-aerobicStartTime`, String(now))
								setAerobicSecondsLeft(seconds)
							}}
						>
							<Ionicons name="play-circle-outline" size={56} color="#76DABF" />
						</TouchableOpacity>
					)
				) : videoSource ? (
					<Video
						ref={playerRef}
						source={videoSource}
						style={styles.video}
						resizeMode="contain"
						controls
						paused={paused}
						onEnd={handleVideoEnd}
						onProgress={handleVideoProgress}
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

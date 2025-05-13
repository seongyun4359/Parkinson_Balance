import React, { useState, useEffect, useRef } from "react"
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	ActivityIndicator,
	AppState,
	TouchableWithoutFeedback,
} from "react-native"
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

	const [showControls, setShowControls] = useState(true)
	const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const showControlTemporarily = () => {
		setShowControls(true)
		if (controlTimeoutRef.current) clearTimeout(controlTimeoutRef.current)
		controlTimeoutRef.current = setTimeout(() => {
			setShowControls(false)
		}, 2000)
	}
	const [isFullscreen, setIsFullscreen] = useState(false)

	const toggleFullscreen = () => {
		setIsFullscreen((prev) => !prev)
	}

	useEffect(() => {
		const prepare = async () => {
			try {
				const user = await getUserInfo()
				if (!user?.phoneNumber) throw new Error("전화번호 없음")
				setStoragePrefix(user.phoneNumber)
			} catch (e) {
				console.error("🚨 사용자 정보 불러오기 실패:", e)
				setLoading(false)
			}
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

					const progressHistory = historyData.content.find(
						(h) => h.exerciseName === goal.exerciseName && h.status === "PROGRESS"
					)
					if (progressHistory) {
						historyId = progressHistory.historyId
						progress[historyId] = restoredProgress[historyId] ?? progressHistory.completedCount ?? 0
					} else if (!historyId) {
						const newHistory = await startExercise(goal.goalId)

						if (newHistory && typeof newHistory === "object" && "historyId" in newHistory) {
							const { historyId } = newHistory as { historyId: number }
							progress[historyId] = 0
						} else {
							console.warn("⚠️ historyId 없음, fallback 재시도 전 대기 중...")
							await new Promise((res) => setTimeout(res, 300))

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

				// ✅ aerobicStartTime 무조건 삭제 (복원 X)
				const aerobicKey = `${storagePrefix}-aerobicStartTime`
				await AsyncStorage.removeItem(aerobicKey)
				console.log("🧹 유산소 운동 초기화 - 저장된 시간 무시함")

				const firstIndex = findNextIncompleteIndex(goals, goalHistoryMap, progress)

				// ✅ savedIndex 무시하고 firstIndex만 본다
				if (goals.length > 0 && firstIndex !== -1) {
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
			setAppState(nextAppState)
		})
		return () => {
			subscription.remove()
		}
	}, [])

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
				// ❌ currentVideoIndex AsyncStorage 저장 X
			} else {
				await AsyncStorage.multiRemove([
					`${storagePrefix}-videoProgress`,
					`${storagePrefix}-currentVideoIndex`, // optional, 안써도 되지만 깔끔
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
			} else {
				navigateToRecord(exerciseGoals, goalToHistoryMap, updated)
			}
		} // ✅ 수정 버전
		else {
			setTimeout(() => {
				playerRef.current?.seek(0)
				setPaused(false)
			}, 200)
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
			{!isFullscreen && <ScreenHeader />}

			{isFullscreen ? (
				<View style={StyleSheet.absoluteFill}>
					<TouchableWithoutFeedback onPress={showControlTemporarily}>
						<View style={{ flex: 1, backgroundColor: "#000", position: "relative" }}>
							<Video
								ref={playerRef}
								source={videoSource}
								style={StyleSheet.absoluteFill}
								resizeMode="contain"
								paused={paused}
								onEnd={handleVideoEnd}
								onProgress={handleVideoProgress}
							/>

							{showControls && (
								<>
									<TouchableOpacity
										style={[
											styles.centerButton,
											isFullscreen && {
												top: "50%",
												left: "50%",
												transform: [{ translateX: -24 }, { translateY: -24 }],
											},
										]}
										onPress={() => {
											setPaused((prev) => !prev)
											showControlTemporarily()
										}}
									>
										<Ionicons
											name={paused ? "play-circle-outline" : "pause-circle-outline"}
											size={48}
											color="#ffffff"
										/>
									</TouchableOpacity>

									<TouchableOpacity
										style={[styles.centerButton, { bottom: 30, right: 30, position: "absolute" }]}
										onPress={toggleFullscreen}
									>
										<Ionicons
											name={isFullscreen ? "contract-outline" : "expand-outline"}
											size={32}
											color="#ffffff"
										/>
									</TouchableOpacity>
								</>
							)}
						</View>
					</TouchableWithoutFeedback>
				</View>
			) : (
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
						<TouchableWithoutFeedback onPress={showControlTemporarily}>
							<View style={styles.videoWrapper}>
								<Video
									ref={playerRef}
									source={videoSource}
									style={styles.video}
									resizeMode="contain"
									paused={paused}
									onEnd={handleVideoEnd}
									onProgress={handleVideoProgress}
								/>

								{showControls && (
									<>
										<TouchableOpacity
											style={styles.centerButton}
											onPress={() => {
												setPaused((prev) => !prev)
												showControlTemporarily()
											}}
										>
											<Ionicons
												name={paused ? "play-circle-outline" : "pause-circle-outline"}
												size={48}
												color="#ffffff"
											/>
										</TouchableOpacity>

										<TouchableOpacity
											style={[styles.centerButton, { bottom: 10, right: 30, position: "absolute" }]}
											onPress={toggleFullscreen}
										>
											<Ionicons
												name={isFullscreen ? "contract-outline" : "expand-outline"}
												size={32}
												color="#ffffff"
											/>
										</TouchableOpacity>
									</>
								)}
							</View>
						</TouchableWithoutFeedback>
					) : (
						<Text style={styles.errorText}>🚨 해당 운동의 비디오가 없습니다.</Text>
					)}
				</View>
			)}

			{!isFullscreen && (
				<>
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
				</>
			)}
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
		position: "relative",
		width: "100%",
		height: "100%",
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
	videoWrapper: {
		position: "relative",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	centerButton: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1,
	},
})

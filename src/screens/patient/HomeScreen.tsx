import React, { useEffect, useState } from "react"
import {
	View,
	StyleSheet,
	Image,
	TouchableOpacity,
	Text,
	ActivityIndicator,
	Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import ScreenHeader from "../../components/patient/ScreenHeader"
import Calendar from "../../components/patient/Calendar"
import { RootStackParamList } from "../../navigation/Root"
import { getExerciseHistory, getExercisePrescriptionsByDate } from "../../apis/exercisePrescription"
import type { ExerciseHistoryItem } from "../../apis/exercisePrescription"
import { getUserInfo } from "../../apis/auth"
import PushNotification from "react-native-push-notification"
import dayjs from "dayjs"
import AsyncStorage from "@react-native-async-storage/async-storage"

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>

const HomeScreen = () => {
	const navigation = useNavigation<HomeScreenNavigationProp>()

	const [completedDates, setCompletedDates] = useState<string[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchCompletedDates = async () => {
			try {
				setLoading(true)

				const completed: string[] = []

				// 최근 14일 기준으로 조회
				const recentDates = Array.from({ length: 14 }, (_, i) =>
					dayjs().subtract(i, "day").format("YYYY-MM-DD")
				)

				for (const date of recentDates) {
					try {
						const historyData = await getExerciseHistory(date)
						const goalsData = await getExercisePrescriptionsByDate(date)
						const goals = goalsData.content

						const recordMap = historyData.content.reduce((acc, item) => {
							acc[item.exerciseName] = item.setCount ?? 0
							return acc
						}, {} as Record<string, number>)

						const allDone = goals.every(
							(goal) => (recordMap[goal.exerciseName] ?? 0) >= goal.setCount
						)

						if (allDone) completed.push(date)
					} catch (e) {
						console.warn(`⚠️ ${date} 운동 데이터 불러오기 실패`, e)
					}
				}

				setCompletedDates(completed)
			} catch (error) {
				console.error("🚨 운동 기록 불러오기 오류:", error)
			} finally {
				setLoading(false)
			}
		}

		const scheduleAlarm = async () => {
			try {
				const userInfo = await getUserInfo()
				const rawTime = userInfo?.exerciseNotificationTime

				if (!rawTime || typeof rawTime !== "string") {
					console.log("⏭️ 운동 알람 시간이 없어 예약하지 않음")
					return
				}

				const today = dayjs().format("YYYY-MM-DD")
				const fullDateTime = `${today} ${rawTime}`
				const alarmTime = dayjs(fullDateTime, "YYYY-MM-DD HH:mm:ss", true)

				if (!alarmTime.isValid()) {
					console.warn("❌ 유효하지 않은 알람 시간:", rawTime)
					return
				}

				if (alarmTime.isBefore(dayjs())) {
					console.log("⏭️ 현재 시각보다 이전 알람은 예약하지 않음")
					return
				}

				console.log("🔔 운동 알람 예약 시작...")
				PushNotification.localNotificationSchedule({
					channelId: "exercise-alarm",
					title: "운동 알람",
					message: "운동할 시간입니다! 건강을 위해 몸을 움직여 보세요!",
					date: alarmTime.toDate(),
					allowWhileIdle: true,
					soundName: "default",
					vibrate: true,
					repeatType: "day",
				})

				console.log(`✅ 알람 예약 완료: ${alarmTime.format("YYYY-MM-DD HH:mm:ss")}`)
			} catch (error) {
				console.error("🚨 알람 예약 중 오류:", error)
			}
		}

		fetchCompletedDates()
		scheduleAlarm()
	}, [])

	const handleLogout = async () => {
		try {
			Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
				{
					text: "취소",
					style: "cancel",
				},
				{
					text: "로그아웃",
					onPress: async () => {
						try {
							await AsyncStorage.multiRemove([
								"accessToken",
								"refreshToken",
								"userInfo",
								"fcmToken",
							])

							navigation.reset({
								index: 0,
								routes: [{ name: "Login" }],
							})
						} catch (error) {
							console.error("로그아웃 처리 중 오류:", error)
							Alert.alert("오류", "로그아웃 처리 중 문제가 발생했습니다.")
						}
					},
				},
			])
		} catch (error) {
			console.error("로그아웃 처리 중 오류:", error)
			Alert.alert("오류", "로그아웃 처리 중 문제가 발생했습니다.")
		}
	}

	if (loading) {
		return <ActivityIndicator size="large" color="#76DABF" />
	}

	return (
		<View style={styles.container}>
			<View style={styles.screenHeader}>
				<ScreenHeader />
			</View>
			<Calendar completedDates={completedDates} />
			<View style={styles.menuContainer}>
				<MenuButton
					source={require("../../assets/menu/menu-exercise.png")}
					label="운동 종류"
					onPress={() => navigation.navigate("Category")}
				/>
				<MenuButton
					source={require("../../assets/menu/menu-alarm.png")}
					label="알람"
					onPress={() => navigation.navigate("Alarm")}
				/>
				<MenuButton
					source={require("../../assets/menu/menu-start.png")}
					label="운동 시작"
					onPress={() => navigation.navigate("ExerciseScreen")}
				/>
			</View>
			<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
				<Text style={styles.logoutText}>로그아웃</Text>
			</TouchableOpacity>
		</View>
	)
}

const MenuButton = ({
	source,
	label,
	onPress = () => console.log(`${label} 클릭됨`),
}: {
	source: any
	label: string
	onPress?: () => void
}) => (
	<TouchableOpacity style={styles.menuButton} onPress={onPress}>
		<Image source={source} style={styles.menuIcon} />
		<Text style={styles.menuText}>{label}</Text>
	</TouchableOpacity>
)

export default HomeScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "space-between",
	},
	screenHeader: {
		marginBottom: -20,
	},
	menuContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingVertical: 12,
		elevation: 3,
	},
	menuButton: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 12,
		backgroundColor: "#76DABF",
		width: 80,
		height: 80,
	},
	menuIcon: {
		width: 32,
		height: 32,
		marginBottom: 4,
	},
	menuText: {
		color: "#FAFAFA",
		fontSize: 12,
		fontWeight: "bold",
	},
	logoutButton: {
		alignSelf: "center",
		paddingVertical: 8,
		marginBottom: 8,
	},
	logoutText: {
		color: "#666",
		fontSize: 12,
	},
})

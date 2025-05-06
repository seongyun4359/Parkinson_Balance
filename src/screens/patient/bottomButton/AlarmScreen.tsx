import React, { useEffect, useState } from "react"
import { View, StyleSheet, Text, TouchableOpacity, Alert, Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import PushNotification from "react-native-push-notification"
import ScreenHeader from "../../../components/patient/ScreenHeader"
import { RootStackParamList } from "../../../navigation/Root"
import { getUserInfo } from "../../../apis/auth"
import {
	checkNotifications,
	requestNotifications,
	RESULTS,
	openSettings,
} from "react-native-permissions"

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Alarm">

const AlarmScreen = () => {
	const navigation = useNavigation<HomeScreenNavigationProp>()
	const [alarmTime, setAlarmTime] = useState<string | null>(null)

	const requestNotificationPermission = async () => {
		if (Platform.OS === "android") {
			const { status } = await checkNotifications()
			console.log("🔍 현재 알림 권한 상태:", status)

			if (status !== RESULTS.GRANTED) {
				const { status: newStatus } = await requestNotifications(["alert", "sound"])

				if (newStatus !== RESULTS.GRANTED) {
					console.warn("🚨 알림 권한이 거부됨")
					Alert.alert("알림 권한 필요", "운동 알람을 받으려면 알림 권한을 허용해주세요.", [
						{ text: "설정으로 이동", onPress: () => openSettings() },
					])
					return false
				}
			}
		}
		return true
	}

	const loadUserExerciseTime = async () => {
		try {
			const userInfo = await getUserInfo()
			console.log("🎯 유저 정보:", userInfo)

			if (!userInfo || typeof userInfo !== "object" || !("exerciseNotificationTime" in userInfo)) {
				console.error("❌ userInfo 반환값 오류 또는 필드 누락:", userInfo)
				Alert.alert("오류", "사용자 알람 정보를 불러올 수 없습니다.")
				return
			}

			const time = userInfo.exerciseNotificationTime
			if (!time || typeof time !== "string") {
				console.error("❌ 알람 시간 누락 또는 잘못된 형식:", time)
				Alert.alert("오류", "알림 시간이 올바르지 않습니다.")
				return
			}

			console.log("✅ 저장된 알람 시간:", time)
			setAlarmTime(time)
			scheduleAlarm(time)
		} catch (error) {
			console.error("❌ 운동 알람 시간 불러오기 실패:", error)
			Alert.alert("오류", "운동 알람 정보를 불러오는 중 문제가 발생했습니다.")
		}
	}

	const scheduleAlarm = async (time: string) => {
		try {
			if (!time || typeof time !== "string") {
				console.error("❌ 알람 설정 실패: 시간 값이 없음 또는 형식 오류 →", time)
				return
			}

			const parts = time.split(":").map(Number)
			if (parts.length < 2 || parts.length > 3 || parts.some(isNaN)) {
				console.error("❌ 잘못된 시간 포맷:", time)
				Alert.alert("오류", "알림 시간이 잘못된 형식입니다.")
				return
			}

			const [hour, minute, second = 0] = parts
			const now = new Date()
			const alarmDate = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
				hour,
				minute,
				second
			)

			if (isNaN(alarmDate.getTime())) {
				console.error("❌ Invalid Date 객체 발생:", alarmDate)
				return
			}

			if (alarmDate < now) {
				alarmDate.setDate(alarmDate.getDate() + 1)
			}

			console.log("✅ 알람 예약됨:", alarmDate.toISOString())

			PushNotification.localNotificationSchedule({
				channelId: "exercise-alarm",
				title: "운동 알람",
				message: "운동할 시간입니다! 건강을 위해 몸을 움직여 보세요!",
				date: alarmDate,
				allowWhileIdle: true,
				soundName: "default",
				vibrate: true,
				repeatType: "day",
			})
		} catch (e) {
			console.error("🚨 알람 등록 중 예외 발생:", e)
			Alert.alert("알람 오류", "알람을 등록하는 중 문제가 발생했습니다.")
		}
	}

	useEffect(() => {
		;(async () => {
			await requestNotificationPermission()
			await loadUserExerciseTime()
		})()
	}, [])

	return (
		<View style={styles.container}>
			<ScreenHeader />

			{alarmTime ? (
				<View style={styles.alarmItem}>
					<Text style={styles.alarmTime}>{alarmTime}</Text>
				</View>
			) : (
				<Text style={styles.noAlarmText}>설정된 운동 알람이 없습니다.</Text>
			)}

			<TouchableOpacity
				style={styles.completeButton}
				onPress={() => navigation.navigate("PatientHome")}
			>
				<Text style={styles.completeButtonText}>완료</Text>
			</TouchableOpacity>
		</View>
	)
}

export default AlarmScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		paddingTop: 40,
	},
	alarmItem: {
		width: "95%",
		padding: 15,
		borderWidth: 2,
		borderColor: "#76DABF",
		borderRadius: 10,
		marginBottom: 10,
		alignItems: "center",
	},
	alarmTime: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#000",
	},
	noAlarmText: {
		fontSize: 18,
		color: "#888",
		marginTop: 20,
	},
	completeButton: {
		backgroundColor: "#76DABF",
		paddingVertical: 12,
		paddingHorizontal: 40,
		borderRadius: 8,
		marginBottom: 30,
	},
	completeButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
})

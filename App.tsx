import React, { useEffect, useState, useRef } from "react"
import {
	requestFCMToken,
	setupNotificationListeners,
	firebaseMessaging,
} from "./src/utils/firebase"
import AppNavigator from "./src/navigation/AppNavigator"
import PushNotification from "react-native-push-notification"
import * as Clarity from "@microsoft/react-native-clarity"
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native"

// Clarity 초기화
Clarity.initialize("qzwbyrzpvk", {
	logLevel: Clarity.LogLevel.Info, // 기본 로그 레벨 설정
})

const App: React.FC = () => {
	const [isFirebaseReady, setIsFirebaseReady] = useState(false)
	const [unsubscribeNotificationListener, setUnsubscribeNotificationListener] = useState<
		(() => void) | null
	>(null)
	const navigationRef = useNavigationContainerRef()
	const routeNameRef = useRef<string>()

	useEffect(() => {
		const setupFirebase = async () => {
			try {
				console.log(" Firebase 앱 설정 시작...")

				// 🔹 알람 채널 생성 (최초 1회)
				PushNotification.createChannel(
					{
						channelId: "exercise-alarm",
						channelName: "운동 알람",
						channelDescription: "운동 알람을 위한 푸시 알림 채널",
						soundName: "default",
						importance: 4,
						vibrate: true,
					},
					(created) => console.log(`🔔 알람 채널 생성됨: ${created ? "성공" : "이미 존재함"}`)
				)

				// 🔹 기존 예약된 알람 및 기기 알림창의 모든 알림 삭제
				console.log("🔹 기존 예약된 알람 제거 시작...")
				
				console.log("✅ 모든 기존 알람이 취소되었습니다.")

				// 🔹 FCM 토큰 요청
				const token = await requestFCMToken()
				if (token) {
					console.log(" 받은 FCM 토큰:", token)
				} else {
					console.warn("⚠️ FCM 토큰을 가져오지 못했습니다.")
				}

				// 🔹 Firebase Messaging 리스너 설정
				const messaging = firebaseMessaging()
				if (messaging) {
					console.log("🔔 Firebase 메시지 리스너 설정 중...")
					const unsubscribe = await setupNotificationListeners()
					setUnsubscribeNotificationListener(() => unsubscribe)
					console.log("✅ Firebase 메시지 리스너가 정상적으로 설정되었습니다.")
				} else {
					console.warn("⚠️ Firebase Messaging이 설정되지 않아 리스너를 실행하지 않습니다.")
				}

				setIsFirebaseReady(true)
				console.log(" Firebase 앱 설정 완료")
			} catch (error) {
				console.error("🚨 Firebase 설정 중 오류 발생:", error)
			}
		}

		setupFirebase()

		return () => {
			if (unsubscribeNotificationListener) {
				unsubscribeNotificationListener()
				console.log("🔕 Firebase 메시지 리스너가 해제되었습니다.")
			}
		}
	}, [])

	if (!isFirebaseReady) {
		return null
	}

	return (
		<NavigationContainer
			ref={navigationRef}
			onReady={() => {
				routeNameRef.current = navigationRef.getCurrentRoute()?.name
				if (routeNameRef.current) {
					Clarity.setCurrentScreenName(routeNameRef.current)
				}
				Clarity.setOnSessionStartedCallback((sessionId) => {
					console.log("🔍 Clarity 세션 시작:", sessionId)
				})
			}}
			onStateChange={async () => {
				const previousRouteName = routeNameRef.current
				const currentRouteName = navigationRef.getCurrentRoute()?.name

				if (previousRouteName !== currentRouteName) {
					routeNameRef.current = currentRouteName
					if (currentRouteName) {
						Clarity.setCurrentScreenName(currentRouteName)
						Clarity.sendCustomEvent(`Screen_${currentRouteName}`)
					}
				}
			}}
		>
			<AppNavigator />
		</NavigationContainer>
	)
}

export default App

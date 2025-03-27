import React, { useEffect, useState } from "react"
import {
	requestFCMToken,
	setupNotificationListeners,
	firebaseMessaging,
} from "./src/utils/firebase"
import AppNavigator from "./src/navigation/AppNavigator"

const App: React.FC = () => {
	const [isFirebaseReady, setIsFirebaseReady] = useState(false)

	useEffect(() => {
		const setupFirebase = async () => {
			try {
				console.log(" Firebase 앱 설정 시작...")

				// 🔹 FCM 토큰 요청 (Firebase 초기화 후 실행)
				const token = await requestFCMToken()
				if (token) {
					console.log(" 받은 FCM 토큰:", token)
				} else {
					console.warn("⚠️ FCM 토큰을 가져오지 못했습니다.")
				}

				// 🔹 포그라운드 메시지 리스너 설정 (Firebase Messaging이 `null`이 아닐 때만 실행)
				if (firebaseMessaging()) {
					setupNotificationListeners()
					console.log("🔔 Firebase 메시지 리스너가 설정되었습니다.")
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
	}, [])

	if (!isFirebaseReady) {
		return null // Firebase 설정이 완료될 때까지 UI 렌더링을 지연
	}

	return <AppNavigator />
}

export default App

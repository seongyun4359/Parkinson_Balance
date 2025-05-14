import messaging from "@react-native-firebase/messaging"
import { Platform, PermissionsAndroid, Alert } from "react-native"
import { initializeApp, getApps, getApp } from "@react-native-firebase/app"

// Firebase 설정 정보 (google-services.json 기반)
const firebaseConfig = {
	apiKey: "AIzaSyAH1b0xuM4e3T3poanxxAhbl7EDQzAh4UQ",
	authDomain: "pd-diary-47917.firebaseapp.com",
	projectId: "pd-diary-47917",
	storageBucket: "pd-diary-47917.firebasestorage.app",
	messagingSenderId: "842076007560",
	appId: "1:842076007560:android:c0ae5730d588ccd360c33d",
	// Android 패키지 이름
	androidClientId: "com.idealab.pddiary",
	databaseURL: "https://pd-diary-47917-default-rtdb.firebaseio.com",
}

// Firebase 설정 유효성 검사
const validateFirebaseConfig = () => {
	const requiredFields = [
		"apiKey",
		"authDomain",
		"databaseURL",
		"projectId",
		"storageBucket",
		"messagingSenderId",
		"appId",
	]

	const missingFields = requiredFields.filter((field) => !firebaseConfig[field])
	if (missingFields.length > 0) {
		throw new Error(`Firebase 설정 오류: 다음 필드가 누락되었습니다: ${missingFields.join(", ")}`)
	}
}

export const initializeFirebase = async () => {
	try {
		console.log("🔍 Firebase 초기화 시작...")

		// 설정 유효성 검사
		validateFirebaseConfig()

		// 이미 초기화된 앱이 있는지 확인
		let app
		if (getApps().length === 0) {
			console.log("🔧 Firebase 앱 초기화 시작")
			console.log("📋 Firebase 설정:", firebaseConfig)
			app = initializeApp(firebaseConfig)
			console.log(" Firebase 앱 초기화 완료")
		} else {
			app = getApp()
			console.log("ℹ️ 이미 초기화된 Firebase 앱 사용")
		}

		// Messaging 초기화 확인
		if (messaging().app) {
			console.log(" Firebase Messaging 초기화 완료")
		}

		return app
	} catch (error) {
		console.error("🚨 Firebase 초기화 오류:", error)
		if (error instanceof Error) {
			console.error("오류 메시지:", error.message)
			console.error("오류 스택:", error.stack)
		}
		return null
	}
}

//  Android 푸시 알림 권한 요청
const requestAndroidPermissions = async () => {
	try {
		if (Platform.OS === "android") {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
			)
			return granted === PermissionsAndroid.RESULTS.GRANTED
		}
		return true
	} catch (error) {
		console.error("🚨 알림 권한 요청 실패:", error)
		return false
	}
}

export const requestFCMToken = async () => {
	try {
		console.log("🚀 FCM 토큰 요청 시작...")

		// Firebase 앱 초기화 확인
		const app = getApps().length === 0 ? await initializeFirebase() : getApp()
		if (!app) throw new Error("Firebase 초기화 실패")

		if (Platform.OS === "android" || Platform.OS === "ios") {
			// Android 권한 요청
			if (Platform.OS === "android") {
				const hasPermission = await requestAndroidPermissions()
				if (!hasPermission) {
					console.warn("⚠️ 알림 권한이 거부되었습니다.")
					return null
				}
			}

			const authStatus = await messaging().requestPermission()
			const enabled =
				authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
				authStatus === messaging.AuthorizationStatus.PROVISIONAL

			if (enabled) {
				const fcmToken = await messaging().getToken()
				console.log(" FCM 토큰 발급 완료:", fcmToken)
				return fcmToken
			} else {
				console.warn("⚠️ FCM 권한이 거부되었습니다.")
				return null
			}
		} else {
			console.warn("⚠️ FCM은 모바일 플랫폼에서만 지원됩니다.")
			return null
		}
	} catch (error) {
		console.error("🚨 FCM 토큰 요청 오류:", error)
		return null
	}
}

export const setupNotificationListeners = async () => {
	try {
		// Firebase 앱 초기화 확인
		const app = getApps().length === 0 ? await initializeFirebase() : getApp()
		if (!app || !messaging().app) {
			throw new Error("Firebase Messaging이 초기화되지 않았습니다.")
		}

		if (Platform.OS === "android" || Platform.OS === "ios") {
			// 포그라운드 메시지 핸들러
			const unsubscribe = messaging().onMessage(async (remoteMessage) => {
				console.log("📬 포그라운드 메시지 수신:", remoteMessage)

				// 알림 표시
				if (Platform.OS === "android") {
					// Android에서도 Alert로 표시
					const { title, body } = remoteMessage.notification || {}
					if (title || body) {
						Alert.alert(title || "알림", body || "", [
							{ text: "확인", onPress: () => console.log("알림 확인됨") },
						])
					}
					return
				}

				// iOS에서는 수동으로 알림 표시
				if (Platform.OS === "ios") {
					const { title, body } = remoteMessage.notification || {}
					if (title || body) {
						Alert.alert(title || "알림", body || "", [
							{ text: "확인", onPress: () => console.log("알림 확인됨") },
						])
					}
				}
			})

			// 백그라운드 메시지 핸들러
			messaging().setBackgroundMessageHandler(async (remoteMessage) => {
				console.log("📬 백그라운드 메시지 수신:", remoteMessage)
			})

			console.log(" FCM 리스너 설정 완료")
			return unsubscribe
		} else {
			console.warn("⚠️ FCM 리스너는 모바일 플랫폼에서만 지원됩니다.")
			return null
		}
	} catch (error) {
		console.error("🚨 FCM 리스너 설정 오류:", error)
		return null
	}
}

export const firebaseMessaging = () => {
	if (getApps().length === 0) {
		initializeFirebase()
	}
	return messaging()
}

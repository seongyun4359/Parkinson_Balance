import messaging from "@react-native-firebase/messaging"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const getFCMToken = async (): Promise<string> => {
	try {
		// FCM 권한 요청
		const authStatus = await messaging().requestPermission()
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL

		if (!enabled) {
			throw new Error("FCM 권한이 거부되었습니다.")
		}

		// FCM 토큰 가져오기
		const fcmToken = await messaging().getToken()
		if (fcmToken) {
			console.log(" 가져온 FCM 토큰:", fcmToken)
			await AsyncStorage.setItem("fcmToken", fcmToken)
			return fcmToken
		} else {
			throw new Error("FCM 토큰을 가져올 수 없습니다.")
		}
	} catch (error) {
		console.error("FCM 토큰 에러:", error)
		throw error
	}
}

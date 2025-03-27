import AsyncStorage from "@react-native-async-storage/async-storage"
import { getApiEndpoint } from "../config/api"

const TOKEN_KEYS = {
	ACCESS_TOKEN: "accessToken",
	REFRESH_TOKEN: "refreshToken",
	FCM_TOKEN: "fcmToken", //  FCM 토큰 추가
}

//  1️⃣ FCM 토큰 저장
export const saveFCMToken = async (fcmToken) => {
	try {
		await AsyncStorage.setItem(TOKEN_KEYS.FCM_TOKEN, fcmToken)
		console.log(" FCM 토큰 저장 완료:", fcmToken)
	} catch (error) {
		console.error("❌ FCM 토큰 저장 실패:", error)
		throw error
	}
}

//  2️⃣ 저장된 FCM 토큰 가져오기
export const getFCMToken = async () => {
	try {
		const fcmToken = await AsyncStorage.getItem(TOKEN_KEYS.FCM_TOKEN)
		if (fcmToken) {
			console.log(" 저장된 FCM 토큰:", fcmToken)
			return fcmToken
		} else {
			console.warn("⚠️ 저장된 FCM 토큰이 없습니다.")
			return null
		}
	} catch (error) {
		console.error("❌ FCM 토큰 조회 실패:", error)
		throw error
	}
}

//  3️⃣ FCM 토큰 삭제 (로그아웃 시 사용)
export const clearFCMToken = async () => {
	try {
		await AsyncStorage.removeItem(TOKEN_KEYS.FCM_TOKEN)
		console.log(" FCM 토큰 삭제 완료")
	} catch (error) {
		console.error("❌ FCM 토큰 삭제 실패:", error)
		throw error
	}
}

// 기존 토큰 저장 함수 (액세스 토큰 & 리프레시 토큰)
export const saveTokens = async (accessToken, refreshToken) => {
	try {
		await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken)
		await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken)
		console.log(" 액세스 토큰 및 리프레시 토큰 저장 완료")
	} catch (error) {
		console.error("❌ 토큰 저장 실패:", error)
		throw error
	}
}

// 기존 토큰 가져오기 함수
export const getTokens = async () => {
	try {
		const accessToken = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
		const refreshToken = await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
		return { accessToken, refreshToken }
	} catch (error) {
		console.error("❌ 토큰 조회 실패:", error)
		throw error
	}
}

// 토큰 갱신 (리프레시 토큰 사용)
export const refreshAccessToken = async () => {
	try {
		const { refreshToken } = await getTokens()
		const API_ENDPOINT = getApiEndpoint()

		const response = await fetch(`${API_ENDPOINT}/api/refresh`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${refreshToken}`,
			},
		})

		if (!response.ok) {
			throw new Error("토큰 갱신 실패")
		}

		const data = await response.json()
		if (data.status === "SUCCESS" && data.data[0]?.tokenDTO) {
			const { accessToken, refreshToken: newRefreshToken } = data.data[0].tokenDTO
			await saveTokens(accessToken, newRefreshToken)
			console.log(" 새로운 액세스 토큰 저장 완료")
			return accessToken
		}

		throw new Error("토큰 갱신 응답 형식 오류")
	} catch (error) {
		console.error("❌ 토큰 갱신 실패:", error)
		throw error
	}
}

// 로그아웃 시 모든 토큰 삭제
export const clearTokens = async () => {
	try {
		await AsyncStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
		await AsyncStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
		await clearFCMToken() //  FCM 토큰도 함께 삭제
		console.log(" 모든 토큰 삭제 완료")
	} catch (error) {
		console.error("❌ 토큰 삭제 실패:", error)
		throw error
	}
}

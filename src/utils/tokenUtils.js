import AsyncStorage from "@react-native-async-storage/async-storage"
import { getApiEndpoint } from "../config/api"

const TOKEN_KEYS = {
	ACCESS_TOKEN: "accessToken",
	REFRESH_TOKEN: "refreshToken",
}

export const saveTokens = async (accessToken, refreshToken) => {
	try {
		await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken)
		await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken)
	} catch (error) {
		console.error("토큰 저장 실패:", error)
		throw error
	}
}

export const getTokens = async () => {
	try {
		const accessToken = await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
		const refreshToken = await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
		return { accessToken, refreshToken }
	} catch (error) {
		console.error("토큰 조회 실패:", error)
		throw error
	}
}

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
			return accessToken
		}

		throw new Error("토큰 갱신 응답 형식 오류")
	} catch (error) {
		console.error("토큰 갱신 실패:", error)
		throw error
	}
}

export const clearTokens = async () => {
	try {
		await AsyncStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
		await AsyncStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
	} catch (error) {
		console.error("토큰 삭제 실패:", error)
		throw error
	}
}

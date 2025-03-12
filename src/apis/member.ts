import AsyncStorage from "@react-native-async-storage/async-storage"

const API_BASE_URL = "https://kwhcclab.com:20955/api"

const refreshTokenAndRetry = async () => {
	try {
		const refreshToken = await AsyncStorage.getItem("refreshToken")

		if (!refreshToken) {
			await AsyncStorage.multiRemove(["accessToken", "refreshToken"])
			throw new Error("리프레시 토큰이 없습니다.")
		}

		const response = await fetch(`${API_BASE_URL}/refresh`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${refreshToken}`,
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			throw new Error(`토큰 갱신 실패: ${response.status}`)
		}

		const data = await response.json()

		if (data.status === "SUCCESS" && data.data && data.data[0] && data.data[0].accessToken) {
			await AsyncStorage.setItem("accessToken", data.data[0].accessToken)
			if (data.data[0].refreshToken && data.data[0].refreshToken !== "cookie") {
				await AsyncStorage.setItem("refreshToken", data.data[0].refreshToken)
			}
			return data.data[0].accessToken
		} else {
			throw new Error("토큰 갱신 응답이 올바르지 않습니다.")
		}
	} catch (error: any) {
		console.error("리프레시 토큰 오류:", error.message || error)
		await AsyncStorage.multiRemove(["accessToken", "refreshToken"])
		throw new Error(error.message || "리프레시 토큰 요청 실패")
	}
}

export const searchMemberByPhone = async (phoneNumber: string) => {
	try {
		let accessToken = await AsyncStorage.getItem("accessToken")

		if (!accessToken) {
			throw new Error("액세스 토큰이 없습니다.")
		}

		const makeRequest = async (token: string) => {
			try {
				const formattedPhoneNumber = phoneNumber.includes("-") ? phoneNumber : phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")

				const response = await fetch(`${API_BASE_URL}/members/${formattedPhoneNumber}`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				})

				if (!response.ok) {
					if (response.status === 401) {
						throw new Error("토큰이 만료되었습니다.")
					}
					if (response.status === 404) {
						throw new Error("사용자를 찾을 수 없습니다.")
					}
					const errorData = await response.json().catch(() => null)
					throw new Error(errorData?.error || `API 요청 실패: ${response.status}`)
				}

				const data = await response.json()
				if (!data || !data.status) {
					throw new Error("잘못된 응답 형식입니다.")
				}
				return data
			} catch (error: any) {
				throw new Error(error.message || "API 요청 중 오류가 발생했습니다.")
			}
		}

		try {
			return await makeRequest(accessToken)
		} catch (error: any) {
			if (error.message === "토큰이 만료되었습니다.") {
				const newToken = await refreshTokenAndRetry()
				return await makeRequest(newToken)
			}
			throw error
		}
	} catch (error: any) {
		console.error("API 호출 오류:", error.message || error)
		if (error.message.includes("토큰")) {
			await AsyncStorage.multiRemove(["accessToken", "refreshToken"])
		}
		throw error
	}
}

export interface UpdateMemberData {
	phoneNumber?: string
	name?: string
	password?: string
}

export const updateMember = async (originalPhoneNumber: string, updateData: UpdateMemberData) => {
	try {
		const accessToken = await AsyncStorage.getItem("accessToken")
		if (!accessToken) {
			throw new Error("액세스 토큰이 없습니다.")
		}

		const response = await fetch(`${API_BASE_URL}/members/${originalPhoneNumber}`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updateData),
		})

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error("토큰이 만료되었습니다.")
			}
			const errorData = await response.json().catch(() => null)
			throw new Error(errorData?.error || `정보 수정 실패: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error: any) {
		console.error("회원 정보 수정 오류:", error)
		throw error
	}
}

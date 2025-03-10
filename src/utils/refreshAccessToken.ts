import { API_BASE_URL } from "../config/constants"
import { getAuthToken, setAuthToken } from "../utils/auth"

export const refreshAccessToken = async (): Promise<string | null> => {
	try {
		const token = await getAuthToken()

		if (!token) {
			throw new Error("현재 유효한 토큰이 없습니다.")
		}

		// 리프레시 토큰을 사용해 새 액세스 토큰을 요청하는 POST 요청
		const response = await fetch(`${API_BASE_URL}/api/refresh`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			throw new Error("리프레시 토큰 요청 실패")
		}

		const data = await response.json()

		if (data.status === "SUCCESS" && data.data.length > 0) {
			const newAccessToken = data.data[0].accessToken
			await setAuthToken(newAccessToken) // 새로운 액세스 토큰을 로컬에 저장
			return newAccessToken
		} else {
			throw new Error("새로운 액세스 토큰을 받지 못했습니다.")
		}
	} catch (error) {
		console.error("리프레시 토큰 오류:", error)
		throw error
	}
}

export const searchMemberByPhone = async (phoneNumber: string): Promise<MemberResponse> => {
	try {
		let token = await getAuthToken()

		if (!token) {
			throw new Error("인증 토큰이 없습니다.")
		}

		const response = await fetch(`${API_BASE_URL}/api/members/${phoneNumber}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		})

		if (response.status === 401) {
			console.log("토큰 만료, 리프레시 토큰으로 갱신 시도")

			// 리프레시 토큰을 사용하여 새 액세스 토큰 발급
			token = await refreshAccessToken()
			if (!token) {
				throw new Error("새 토큰을 받을 수 없습니다.")
			}

			// 갱신된 토큰으로 다시 요청
			const retryResponse = await fetch(`${API_BASE_URL}/api/members/${phoneNumber}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			})

			if (!retryResponse.ok) {
				throw new Error("API 요청 실패: " + retryResponse.status)
			}

			return await retryResponse.json()
		}

		if (!response.ok) {
			throw new Error("API 요청 실패")
		}

		return await response.json()
	} catch (error) {
		console.error("API 호출 오류:", error)
		throw error
	}
}

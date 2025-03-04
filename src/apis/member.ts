import { API_BASE_URL } from "../config/constants"
import { getAuthToken } from "../utils/auth"

export interface MemberResponse {
	status: string
	error: string | null
	data: {
		memberId: string
		phoneNumber: string
		name: string
		gender: "MALE" | "FEMALE"
		lastLoginAt: string
	}[]
}

export const searchMemberByPhone = async (phoneNumber: string): Promise<MemberResponse> => {
	try {
		const token = await getAuthToken()
		const response = await fetch(`${API_BASE_URL}/api/members/${phoneNumber}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			throw new Error("API 요청 실패")
		}

		return await response.json()
	} catch (error) {
		throw error
	}
}

export const searchMemberByName = async (name: string): Promise<MemberResponse> => {
	try {
		const token = await getAuthToken()
		if (!token) {
			throw new Error("인증 토큰이 없습니다.")
		}

		const response = await fetch(`${API_BASE_URL}/api/members/search?name=${encodeURIComponent(name)}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			throw new Error(`API 요청 실패: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error("API 호출 오류:", error)
		throw error
	}
}

import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../constants/urls"

export interface ExerciseGoalItem {
	memberId: string
	phoneNumber: string
	memberName: string
	goalId: number
	exerciseName: string
	repeatCount: number
	setCount: number
	duration: number
}

export interface ExerciseGoalResponse {
	content: ExerciseGoalItem[]
	totalPages: number
	totalElements: number
	size: number
	number: number
}

export const getExerciseGoals = async (phoneNumber: string): Promise<ExerciseGoalResponse> => {
	try {
		const accessToken = await AsyncStorage.getItem("accessToken")
		if (!accessToken) {
			throw new Error("액세스 토큰이 없습니다.")
		}

		const cleanToken = accessToken.replace(/^Bearer\s+/i, "")

		const response = await fetch(`${API_URL}/exercises/${phoneNumber}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${cleanToken}`,
				"Content-Type": "application/json",
			},
		})

		const data = await response.json()

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error("토큰이 만료되었습니다.")
			}
			if (response.status === 404) {
				throw new Error("운동 목표 정보를 찾을 수 없습니다.")
			}
			throw new Error(data.error || "운동 목표 조회 중 오류가 발생했습니다.")
		}

		if (data.status !== "SUCCESS") {
			throw new Error(data.error || "운동 목표 조회에 실패했습니다.")
		}

		return data.data
	} catch (error: any) {
		console.error("운동 목표 조회 오류:", error)
		throw error
	}
}

export interface UpdateExerciseGoalRequest {
	goalId: number
	repeatCount: number
	setCount: number
}

export const updateExerciseGoal = async (phoneNumber: string, goalId: number, repeatCount: number, setCount: number) => {
	try {
		const accessToken = await AsyncStorage.getItem("accessToken")
		if (!accessToken) {
			throw new Error("액세스 토큰이 없습니다.")
		}

		const cleanToken = accessToken.replace(/^Bearer\s+/i, "")
		const requestBody = {
			goalId,
			repeatCount,
			setCount,
		}

		console.log("운동 목표 수정 요청:", {
			url: `${API_URL}/exercises/${phoneNumber}`,
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cleanToken}`,
			},
			body: requestBody,
		})

		const response = await fetch(`${API_URL}/exercises/${phoneNumber}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cleanToken}`,
			},
			body: JSON.stringify(requestBody),
		})

		const responseData = await response.text()
		console.log("서버 응답:", {
			status: response.status,
			statusText: response.statusText,
			data: responseData,
			requestBody: JSON.stringify(requestBody),
			url: `${API_URL}/exercises/${phoneNumber}`,
		})

		let result
		try {
			result = JSON.parse(responseData)
		} catch (e) {
			console.error("JSON 파싱 오류:", e)
			throw new Error(`서버 응답을 파싱할 수 없습니다: ${responseData}`)
		}

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.")
			}
			if (response.status === 404) {
				throw new Error("해당 운동 목표를 찾을 수 없습니다.")
			}
			if (response.status === 400) {
				throw new Error(result.message || "잘못된 요청입니다.")
			}
			if (response.status === 500) {
				console.error("서버 오류 상세:", {
					status: response.status,
					body: requestBody,
					response: result,
					url: `${API_URL}/exercises/${phoneNumber}`,
				})
				throw new Error("서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
			}
			throw new Error(result.error || `서버 오류 (${response.status}): ${result.message || "알 수 없는 오류가 발생했습니다."}`)
		}

		if (result.status !== "SUCCESS") {
			throw new Error(result.error || "운동 목표 수정에 실패했습니다.")
		}

		return result.data
	} catch (error: any) {
		console.error("운동 목표 수정 API 오류:", error)
		throw error
	}
}

export interface ExerciseHistoryItem {
	memberId: string
	phoneNumber: string
	memberName: string
	historyId: number
	exerciseName: string
	repeatCount: number
	setCount: number
	startTime: string | null
	duration: number | null
	status: "PROGRESS" | "COMPLETE" | "INCOMPLETE"
}

export interface ExerciseHistoryResponse {
	content: ExerciseHistoryItem[]
	totalPages: number
	totalElements: number
	size: number
	number: number
}

export const getExerciseHistory = async (phoneNumber: string): Promise<ExerciseHistoryResponse> => {
	try {
		const accessToken = await AsyncStorage.getItem("accessToken")
		if (!accessToken) {
			throw new Error("액세스 토큰이 없습니다.")
		}

		const cleanToken = accessToken.replace(/^Bearer\s+/i, "")
		console.log("운동 기록 조회 요청:", {
			url: `${API_URL}/exercises/histories/${phoneNumber}`,
		})

		const response = await fetch(`${API_URL}/exercises/histories/${phoneNumber}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${cleanToken}`,
				"Content-Type": "application/json",
			},
		})

		const responseData = await response.text()
		console.log("서버 응답:", {
			status: response.status,
			statusText: response.statusText,
			data: responseData,
		})

		let result
		try {
			result = JSON.parse(responseData)
		} catch (e) {
			console.error("JSON 파싱 오류:", e)
			throw new Error(`서버 응답을 파싱할 수 없습니다: ${responseData}`)
		}

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.")
			}
			if (response.status === 404) {
				throw new Error("해당 환자의 운동 기록을 찾을 수 없습니다.")
			}
			throw new Error(result.error || `서버 오류 (${response.status}): ${result.message || "알 수 없는 오류가 발생했습니다."}`)
		}

		if (result.status !== "SUCCESS") {
			throw new Error(result.error || "운동 기록 조회에 실패했습니다.")
		}

		return result.data
	} catch (error: any) {
		console.error("운동 기록 조회 API 오류:", error)
		throw error
	}
}

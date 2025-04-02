import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../constants/urls"
import { fetchWithToken } from "../utils/fetchWithToken"

export interface ExerciseGoalItem {
	memberId: string
	phoneNumber: string
	memberName: string
	goalId: number
	exerciseName: string
	exerciseType: string
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

export const getExerciseGoals = async (date: string): Promise<ExerciseGoalResponse> => {
	try {
		const response = await fetchWithToken(`${API_URL}/exercises/goals/${date}?page=0&size=50`, {
			method: "GET",
		})

		const responseText = await response.text()
		console.log("운동 목표 조회 응답:", responseText)

		let result
		try {
			result = JSON.parse(responseText)
		} catch (e) {
			console.error("JSON 파싱 오류:", e)
			throw new Error("서버 응답을 파싱할 수 없습니다.")
		}

		if (result.status !== "SUCCESS") {
			throw new Error(result.error || "운동 목표 조회에 실패했습니다.")
		}

		return result.data
	} catch (error) {
		console.error("운동 목표 조회 중 오류:", error)
		throw error
	}
}

export interface UpdateExerciseGoalRequest {
	goalId: number
	repeatCount: number
	setCount: number
}

export const updateExerciseGoal = async (
	phoneNumber: string,
	goalId: number,
	setCount: number
): Promise<void> => {
	try {
		const response = await fetchWithToken(`${API_URL}/exercises/${phoneNumber}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				goalId,
				setCount,
			}),
		})

		const responseText = await response.text()
		console.log("운동 목표 수정 응답:", responseText)

		if (!response.ok) {
			throw new Error("운동 목표 수정에 실패했습니다.")
		}

		// 응답이 JSON인 경우에만 파싱
		if (responseText) {
			const result = JSON.parse(responseText)
			if (result.status === "ERROR") {
				throw new Error(result.error || "운동 목표 수정에 실패했습니다.")
			}
		}
	} catch (error) {
		console.error("운동 목표 수정 중 오류:", error)
		throw error
	}
}

export interface ExerciseHistoryItem {
	memberId: string
	phoneNumber: string
	memberName: string
	historyId: number
	exerciseName: string
	setCount: number
	startTime: string | null
	duration: number | null
	status: "PROGRESS" | "COMPLETE" | "INCOMPLETE"
	createdAt?: string // 생성 날짜 필드 추가
}

export interface ExerciseHistoryResponse {
	content: ExerciseHistoryItem[]
	totalPages: number
	totalElements: number
	size: number
	number: number
}

export const getExerciseHistory = async (date: string): Promise<ExerciseHistoryResponse> => {
	try {
		const response = await fetchWithToken(`${API_URL}/exercises/histories/${date}?page=0&size=50`, {
			method: "GET",
		})

		const responseText = await response.text()
		console.log("운동 기록 조회 응답:", responseText)

		let result
		try {
			result = JSON.parse(responseText)
		} catch (e) {
			console.error("JSON 파싱 오류:", e)
			throw new Error("서버 응답을 파싱할 수 없습니다.")
		}

		if (result.status !== "SUCCESS") {
			throw new Error(result.error || "운동 기록 조회에 실패했습니다.")
		}

		return result.data
	} catch (error) {
		console.error("운동 기록 조회 중 오류:", error)
		throw error
	}
}

// 어드민용 특정 사용자의 운동 기록 조회 함수
export const getPatientExerciseHistory = async (
	phoneNumber: string,
	date: string
): Promise<ExerciseHistoryResponse> => {
	try {
		const response = await fetchWithToken(`${API_URL}/exercises/histories/${phoneNumber}/${date}`, {
			method: "GET",
		})

		const responseText = await response.text()
		console.log("특정 사용자 운동 기록 조회 응답:", responseText)

		let result
		try {
			result = JSON.parse(responseText)
		} catch (e) {
			console.error("JSON 파싱 오류:", e)
			throw new Error("서버 응답을 파싱할 수 없습니다.")
		}

		if (result.status !== "SUCCESS") {
			throw new Error(result.error || "운동 기록 조회에 실패했습니다.")
		}

		return result.data
	} catch (error) {
		console.error("특정 사용자 운동 기록 조회 중 오류:", error)
		throw error
	}
}

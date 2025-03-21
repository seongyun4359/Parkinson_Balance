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

export const getExerciseGoals = async (
	phoneNumber: string
): Promise<{ content: ExerciseGoalItem[] }> => {
	try {
		const response = await fetchWithToken(`${API_URL}/exercises/${phoneNumber}`, {
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

		if (result.status === "ERROR") {
			throw new Error(result.error || "운동 목표 조회에 실패했습니다.")
		}

		if (result.status !== "SUCCESS" || !result.data) {
			throw new Error("운동 목표 조회에 실패했습니다.")
		}

		const content = result.data.content || []

		const filteredContent = content.filter((goal) => goal.setCount > 0)

		return { content: filteredContent }
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

export const getExerciseHistory = async (phoneNumber: string): Promise<ExerciseHistoryResponse> => {
	try {
		const response = await fetchWithToken(`${API_URL}/exercises/histories/${phoneNumber}`, {
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

		if (!response.ok || result.status !== "SUCCESS") {
			throw new Error(result.error || "운동 기록 조회에 실패했습니다.")
		}

		// startTime을 createdAt으로 사용
		const content = result.data.content.map((item: any) => ({
			...item,
			createdAt: item.startTime || new Date().toISOString(),
		}))

		return {
			...result.data,
			content,
		}
	} catch (error) {
		console.error("운동 기록 조회 중 오류:", error)
		throw error
	}
}

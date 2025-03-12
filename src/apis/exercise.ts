import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../constants/urls"

export interface ExerciseGoal {
	memberId: string
	phoneNumber: string
	goals?: {
		type: string
		target: string
		description: string
	}[]
}

export const getExerciseGoals = async (phoneNumber: string): Promise<ExerciseGoal> => {
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

		return data.data.content[0]
	} catch (error: any) {
		console.error("운동 목표 조회 오류:", error)
		throw error
	}
}

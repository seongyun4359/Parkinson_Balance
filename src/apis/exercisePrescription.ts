import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../constants/urls"
import { refreshAccessToken } from "../utils/refreshAccessToken"

export interface ExercisePrescriptionItem {
  goalId: number
  exerciseName: string
  setCount: number
  repeatCount: number
  duration: number
  createdAt: string
}

export interface ExercisePrescriptionResponse {
  content: ExercisePrescriptionItem[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export interface ExerciseHistoryItem {
  historyId: number
  exerciseName: string
  setCount: number
  date: string
  createdAt?: string
  goalId?: number
  completedCount?: number
}

export interface ExerciseHistoryResponse {
  content: ExerciseHistoryItem[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

// 운동 기록 조회 API
export const getExerciseHistory = async (date?: string): Promise<ExerciseHistoryResponse> => {
  try {
    let accessToken = await AsyncStorage.getItem("accessToken")
    if (!accessToken) throw new Error("🚨 액세스 토큰이 없습니다.")

    const cleanToken = accessToken.replace(/^Bearer\s+/i, "")
    const url = date
      ? `${API_URL}/exercises/histories/${date}?page=0&size=50`
      : `${API_URL}/exercises/histories?page=0&size=50`

    console.log("📢 운동 기록 API 요청:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    console.log("📥 운동 기록 API 응답:", JSON.stringify(data, null, 2))

    if (!response.ok || !data.data) {
      throw new Error(`❌ 운동 기록 조회 오류: ${response.status} - ${JSON.stringify(data)}`)
    }

    return data.data
  } catch (error: any) {
    console.error("🚨 운동 기록 조회 오류:", error.message)
    throw error
  }
}

// 운동 시작 API
export const startExercise = async (goalId: number): Promise<number | null> => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken")
    if (!accessToken) throw new Error("🚨 액세스 토큰 없음")

    const cleanToken = accessToken.replace(/^Bearer\s+/i, "")
    const response = await fetch(`${API_URL}/exercises/${goalId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()
    console.log("🚀 운동 시작 응답:", result)

    if (response.ok && result.status === "SUCCESS" && result.data?.historyId) {
      return result.data.historyId
    }

    console.warn("❌ 운동 시작 실패:", result.error || "알 수 없는 오류")
    return null
  } catch (err: any) {
    console.error("🚨 운동 시작 오류:", err.message)
    return null
  }
}

// 세트 완료 API
export const completeExerciseSet = async (historyId: number): Promise<boolean> => {
  try {
    let accessToken = await AsyncStorage.getItem("accessToken")
    if (!accessToken) throw new Error("🚨 액세스 토큰이 없습니다.")

    const cleanToken = accessToken.replace(/^Bearer\s+/i, "")
    const url = `${API_URL}/exercises/${historyId}/complete-set`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()
    console.log("✅ 세트 완료 응답:", result)

    return response.ok && result.status === "SUCCESS"
  } catch (error: any) {
    console.error("🚨 세트 완료 오류:", error.message)
    return false
  }
}

// 유산소 완료 API
export const completeAerobicExercise = async (historyId: number): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("accessToken")
    if (!token) throw new Error("토큰 없음")

    const response = await fetch(`${API_URL}/exercises/${historyId}/complete-aerobic`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.replace(/^Bearer\s+/i, "")}`,
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()
    console.log("🚴 유산소 완료 응답:", result)

    return response.ok && result.status === "SUCCESS"
  } catch (err: any) {
    console.error("🚨 유산소 완료 실패:", err.message)
    return false
  }
}

// 날짜 기반 운동 처방 조회 API
export const getExercisePrescriptionsByDate = async (
  date: string,
  page = 0,
  size = 50
): Promise<ExercisePrescriptionResponse> => {
  try {
    let accessToken = await AsyncStorage.getItem("accessToken")
    if (!accessToken) throw new Error("🚨 액세스 토큰이 없습니다.")

    const cleanToken = accessToken.replace(/^Bearer\s+/i, "")
    const url = `${API_URL}/exercises/goals/${date}?page=${page}&size=${size}`

    console.log("📢 날짜별 운동 처방 API 요청:", url)

    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    })

    if (response.status === 401) {
      console.log("🔄 토큰 만료. 새 토큰 갱신 시도...")
      accessToken = await refreshAccessToken()
      if (!accessToken) throw new Error("🚨 새 토큰을 받을 수 없습니다.")

      response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.replace(/^Bearer\s+/i, "")}`,
          "Content-Type": "application/json",
        },
      })
    }

    const data = await response.json()
    console.log("📥 날짜별 운동 처방 응답:", JSON.stringify(data, null, 2))

    if (!response.ok || !data.data) {
      throw new Error(`❌ 운동 목표 조회 오류: ${response.status} - ${JSON.stringify(data)}`)
    }

    return data.data
  } catch (error: any) {
    console.error("🚨 날짜별 운동 목표 조회 오류:", error.message)
    throw error
  }
} 

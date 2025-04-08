import { fetchWithAuth } from "../utils/patientFetchWithAuth"
import { API_URL } from "../constants/patientUrls"

export interface ExercisePrescriptionItem {
  goalId: number
  exerciseName: string
  setCount: number
  repeatCount: number
  duration: number
  createdAt: string
  exerciseType: string 
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
  status: "PROGRESS" | "COMPLETE" 
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
  const url = date
    ? `${API_URL}/exercises/histories/${date}?page=0&size=50`
    : `${API_URL}/exercises/histories?page=0&size=50`

  const response = await fetchWithAuth(url, { method: "GET" })
  const data = await response.json()

  if (!response.ok || !data.data) {
    throw new Error(`❌ 운동 기록 조회 오류: ${response.status} - ${JSON.stringify(data)}`)
  }

  return data.data
}

// 운동 시작 API
export const startExercise = async (goalId: number): Promise<number | null> => {
  const url = `${API_URL}/exercises/${goalId}`

  const response = await fetchWithAuth(url, { method: "POST" })
  const result = await response.json()

  console.log("🚀 운동 시작 응답:", result)

  if (response.ok && result.status === "SUCCESS" && result.data?.historyId) {
    return result.data.historyId
  }

  console.warn("❌ 운동 시작 실패:", result.error || "알 수 없는 오류")
  return null
}

// 세트 완료 API
export const completeExerciseSet = async (historyId: number): Promise<boolean> => {
  const url = `${API_URL}/exercises/${historyId}/complete-set`

  const response = await fetchWithAuth(url, { method: "POST" })
  const result = await response.json()

  console.log("✅ 세트 완료 응답:", result)

  return response.ok && result.status === "SUCCESS"
}

// 유산소 완료 API
export const completeAerobicExercise = async (historyId: number): Promise<boolean> => {
  const url = `${API_URL}/exercises/${historyId}/complete-aerobic`

  const response = await fetchWithAuth(url, { method: "POST" })
  const result = await response.json()

  console.log("🚴 유산소 완료 응답:", result)

  return response.ok && result.status === "SUCCESS"
}

// 날짜 기반 운동 처방 조회 API
export const getExercisePrescriptionsByDate = async (
  date: string,
  page = 0,
  size = 50
): Promise<ExercisePrescriptionResponse> => {
  const url = `${API_URL}/exercises/goals/${date}?page=${page}&size=${size}`

  const response = await fetchWithAuth(url, { method: "GET" })
  const data = await response.json()

  console.log("📥 날짜별 운동 처방 응답:", JSON.stringify(data, null, 2))

  if (!response.ok || !data.data) {
    throw new Error(`❌ 운동 목표 조회 오류: ${response.status} - ${JSON.stringify(data)}`)
  }

  return data.data
}

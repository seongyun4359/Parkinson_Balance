import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/urls";
import { refreshAccessToken } from "../utils/refreshAccessToken";

export interface ExercisePrescriptionItem {
  goalId: number;
  exerciseName: string;
  setCount: number;
  repeatCount: number;
  duration: number;
}

export interface ExercisePrescriptionResponse {
  content: ExercisePrescriptionItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ExerciseHistoryItem {
  historyId: number;
  exerciseName: string;
  setCount: number;
  date: string;
  createdAt?: string;
}

export interface ExerciseHistoryResponse {
  content: ExerciseHistoryItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// ✅ 운동 처방 조회 API
export const getExercisePrescriptions = async (): Promise<ExercisePrescriptionResponse> => {
  try {
    let accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) throw new Error("🚨 액세스 토큰이 없습니다.");

    const cleanToken = accessToken.replace(/^Bearer\s+/i, "");
    const url = `${API_URL}/exercises?page=0&size=10`;

    console.log("📢 운동 처방 API 요청:", url);

    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      console.log("🔄 토큰 만료. 새 토큰 갱신 시도...");
      accessToken = await refreshAccessToken();
      if (!accessToken) throw new Error("🚨 새 토큰을 받을 수 없습니다.");

      response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.replace(/^Bearer\s+/i, "")}`,
          "Content-Type": "application/json",
        },
      });
    }

    const data = await response.json();
    console.log("📥 운동 처방 API 응답:", JSON.stringify(data, null, 2));

    if (!response.ok || !data.data) {
      throw new Error(`❌ 운동 목표 조회 오류: ${response.status} - ${JSON.stringify(data)}`);
    }

    return data.data;
  } catch (error: any) {
    console.error("🚨 운동 목표 조회 오류:", error.message);
    throw error;
  }
};

// ✅ 운동 기록 조회 API
export const getExerciseHistory = async (date?: string): Promise<ExerciseHistoryResponse> => {
  try {
    let accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) throw new Error("🚨 액세스 토큰이 없습니다.");

    const cleanToken = accessToken.replace(/^Bearer\s+/i, "");
    const url = date
      ? `${API_URL}/exercises/histories?date=${date}`
      : `${API_URL}/exercises/histories`;

    console.log("📢 운동 기록 API 요청:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("📥 운동 기록 API 응답:", JSON.stringify(data, null, 2));

    if (!response.ok || !data.data) {
      throw new Error(`❌ 운동 기록 조회 오류: ${response.status} - ${JSON.stringify(data)}`);
    }

    return data.data;
  } catch (error: any) {
    console.error("🚨 운동 기록 조회 오류:", error.message);
    throw error;
  }
};

// ✅ 운동 시작 API (goalId 기준)
// startExercise 함수 수정
export const startExercise = async (goalId: number): Promise<number | null> => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) throw new Error("🚨 액세스 토큰 없음");

    const cleanToken = accessToken.replace(/^Bearer\s+/i, "");
    const response = await fetch(`${API_URL}/exercises/${goalId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("🚀 운동 시작 응답:", result);

    if (response.ok && result.status === "SUCCESS" && result.data?.historyId) {
      return result.data.historyId; // ✅ historyId 반환
    }

    return null;
  } catch (err) {
    console.error("🚨 운동 시작 오류:", err);
    return null;
  }
};


// ✅ 세트 완료 API (historyId 기준)
export const completeExerciseSet = async (historyId: number): Promise<boolean> => {
  try {
    let accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) throw new Error("🚨 액세스 토큰이 없습니다.");

    const cleanToken = accessToken.replace(/^Bearer\s+/i, "");
    const url = `${API_URL}/exercises/${historyId}/complete-set`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("✅ 세트 완료 응답:", result);

    return response.ok && result.status === "SUCCESS";
  } catch (error) {
    console.error("🚨 세트 완료 오류:", error);
    return false;
  }
};
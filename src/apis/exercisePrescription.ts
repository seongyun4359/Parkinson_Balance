import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/urls";
import { refreshAccessToken } from "../utils/refreshAccessToken"; 
import { getUserPhoneNumber } from "../utils/getUserPhoneNumber";

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

/**
 * ✅ 환자가 처방받은 운동 목표 조회 API
 */
export const getExercisePrescriptions = async (): Promise<ExercisePrescriptionResponse> => {
  try {
    const phoneNumber = await getUserPhoneNumber();
    if (!phoneNumber) {
      throw new Error("🚨 사용자 전화번호를 찾을 수 없습니다.");
    }

    let accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("🚨 액세스 토큰이 없습니다.");
    }

    const cleanToken = accessToken.replace(/^Bearer\s+/i, "");
    const url = `${API_URL}/exercises?page=0&size=10`;

    console.log("📢 API 요청 정보:", { url, method: "GET", headers: { Authorization: `Bearer ${cleanToken}` } });

    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      console.log("🔄 토큰 만료, 리프레시 토큰으로 갱신 시도...");
      accessToken = await refreshAccessToken();
      if (!accessToken) {
        throw new Error("🚨 새 토큰을 받을 수 없습니다.");
      }

      // 새 토큰으로 재요청
      response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    }

    const data = await response.json();
    console.log("📥 API 응답:", response.status, data);

    if (!response.ok) {
      throw new Error(data.error || "❌ 운동 목표 조회 중 오류가 발생했습니다.");
    }

    return data.data;
  } catch (error: any) {
    console.error("🚨 운동 목표 조회 오류:", error.message);
    throw error;
  }
};

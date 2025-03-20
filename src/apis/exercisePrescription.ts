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

export interface ExerciseHistoryItem {
  historyId: number;
  exerciseName: string;
  setCount: number;
  completedSets: number;
  date: string;
}

export interface ExerciseHistoryResponse {
  content: ExerciseHistoryItem[];
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
      console.log("🔄 토큰 만료, 리프레시 토큰으로 갱신 시도...");
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
      throw new Error(`❌ 운동 목표 조회 오류 발생: ${response.status} - ${JSON.stringify(data)}`);
    }

    return data.data;
  } catch (error: any) {
    console.error("🚨 운동 목표 조회 오류:", error.message);
    throw error;
  }
};

/**
 * ✅ 특정 사용자의 운동 기록 조회 API (GET)
 */
export const getExerciseHistory = async (date?: string): Promise<ExerciseHistoryResponse> => {
  try {
    const phoneNumber = await getUserPhoneNumber();
    if (!phoneNumber) throw new Error("🚨 사용자 전화번호를 찾을 수 없습니다.");

    let accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) throw new Error("🚨 액세스 토큰이 없습니다.");

    const cleanToken = accessToken.replace(/^Bearer\s+/i, "");
    const encodedPhoneNumber = encodeURIComponent(phoneNumber); // ✅ URL 인코딩

    const url = date
      ? `${API_URL}/exercises/histories/${encodedPhoneNumber}?date=${date}`
      : `${API_URL}/exercises/histories/${encodedPhoneNumber}`;

    console.log("📢 운동 기록 API 요청:", url);

    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 403) {
      throw new Error("🚨 서버에서 접근이 거부되었습니다. 권한을 확인하세요.");
    }

    if (response.status === 204) {
      console.warn("⚠️ 운동 기록이 없음 (204 No Content)");
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        number: 0,
      };
    }

    if (!response.ok) {
      throw new Error(`❌ 운동 기록 조회 오류 발생: ${response.status}`);
    }

    const data = await response.json();
    console.log("📥 운동 기록 API 응답:", JSON.stringify(data, null, 2));

    return data.data;
  } catch (error: any) {
    console.error("🚨 운동 기록 조회 오류:", error.message);
    throw error;
  }
};

/**
 * ✅ 환자의 운동 기록 저장 API (POST)
 */
export const saveExerciseHistory = async (exerciseName: string, repeatCount: number, setCount: number) => {
  try {
    const phoneNumber = await getUserPhoneNumber();
    if (!phoneNumber) throw new Error("🚨 사용자 전화번호를 찾을 수 없습니다.");

    let accessToken = await AsyncStorage.getItem("accessToken");
    if (!accessToken) throw new Error("🚨 액세스 토큰이 없습니다.");

    const cleanToken = accessToken.replace(/^Bearer\s+/i, "");

    const response = await fetch(`${API_URL}/exercises/histories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phoneNumber, // ✅ 서버에서 요구하는 값 추가
        exerciseName,
        repeatCount,
        setCount,
      }),
    });

    const result = await response.json();
    console.log("📥 운동 기록 저장 응답:", JSON.stringify(result, null, 2));

    if (!response.ok) {
      throw new Error(`🚨 운동 기록 저장 실패: ${response.status} - ${JSON.stringify(result)}`);
    }

    console.log(`✅ ${exerciseName} 운동 기록 저장 완료!`);
    return true;
  } catch (error) {
    console.error("🚨 운동 기록 저장 오류:", error);
    return false;
  }
};

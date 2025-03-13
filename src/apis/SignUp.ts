import { getApiEndpoint } from "../config/api";
import { saveUserInfo } from "../apis/auth"; // ✅ 사용자 정보 저장 함수 추가

export const signupUser = async (userData: any) => {
  const API_ENDPOINT = getApiEndpoint();

  console.log("📤 회원가입 요청 데이터:", JSON.stringify(userData, null, 2));

  try {
    const response = await fetch(`${API_ENDPOINT}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log(`ℹ️ 회원가입 API 응답 상태 코드: ${response.status}`);

    // ✅ 응답이 비어 있는지 체크
    const text = await response.text();
    if (!text) {
      console.warn("⚠️ 서버에서 응답이 비어 있음 (Unexpected end of input 오류 방지)");
      throw new Error("서버 응답이 없습니다.");
    }

    // ✅ 정상적인 JSON 데이터 변환
    const data = JSON.parse(text);
    console.log("✅ 회원가입 성공:", data);

    // ✅ 회원가입 성공 시 사용자 정보 저장 (운동 알람 시간 포함)
    await saveUserInfo({
      phoneNumber: userData.phoneNumber,
      name: userData.name,
      gender: userData.gender,
      exerciseNotificationTime: userData.exerciseNotificationTime, // ✅ 운동 알람 시간도 저장!
    });
    console.log("🔒 사용자 정보 저장 완료:", userData.phoneNumber);

    return data;
  } catch (error) {
    console.error("🚨 회원가입 요청 실패:", error);
    throw error;
  }
};

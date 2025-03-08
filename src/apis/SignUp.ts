import { getApiEndpoint } from "../config/api";

export const signupUser = async (userData: any) => {
  const API_ENDPOINT = getApiEndpoint();

  console.log("📤 회원가입 요청 데이터:", JSON.stringify(userData, null, 2)); // 로그 추가

  try {
    const response = await fetch(`${API_ENDPOINT}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("🚨 회원가입 API 응답 에러:", errorData); // API 응답 에러 로그 추가
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ 회원가입 성공:", data);
    return data;
  } catch (error) {
    console.error("🚨 회원가입 요청 실패:", error);
    throw error;
  }
};

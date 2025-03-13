import { getApiEndpoint } from "../config/api"; // 🔥 API 엔드포인트 가져오기
import { getTokens } from "../utils/tokenUtils"; // ✅ 저장된 액세스 토큰 가져오기

export const getExerciseNotificationTime = async (phoneNumber: string) => {
	try {
		const API_ENDPOINT = getApiEndpoint(); // 🔥 API URL 가져오기

		if (!phoneNumber) {
			console.warn("⚠️ 운동 알람 요청 실패: 전화번호가 제공되지 않음.");
			return null;
		}

		// ✅ 저장된 액세스 토큰 가져오기
		const { accessToken } = await getTokens();
		if (!accessToken) {
			console.warn("⚠️ 운동 알람 요청 실패: 액세스 토큰이 없음.");
			return null;
		}

		console.log(`📞 운동 알람 시간 요청: 전화번호 = ${phoneNumber}`);

		// ✅ API 요청 (Authorization 헤더 추가)
		const response = await fetch(`${API_ENDPOINT}/api/user/exercise-time?phoneNumber=${phoneNumber}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`, // ✅ 토큰 추가
			},
		});

		console.log(`ℹ️ 서버 응답 상태 코드: ${response.status}`);

		// ✅ 401 또는 403이면 인증 오류 (토큰 문제 가능성)
		if (response.status === 401 || response.status === 403) {
			console.warn("❌ 운동 알람 시간 요청 실패: 인증 오류 (401 또는 403). 토큰 만료 가능성 있음.");
			return null;
		}

		// ✅ 응답 상태가 204이면 운동 알람 시간이 없는 것임
		if (response.status === 204) {
			console.warn("⚠️ 서버에서 운동 알람 시간이 제공되지 않음 (204 No Content).");
			return null;
		}

		// ✅ 서버 응답이 비어있지 않은지 확인하고 JSON 변환
		const text = await response.text();
		if (!text) {
			console.warn("⚠️ 서버 응답이 비어 있음.");
			return null;
		}

		// ✅ JSON 파싱 시 예외 처리
		let data;
		try {
			data = JSON.parse(text);
		} catch (error) {
			console.error("❌ JSON 파싱 실패:", error);
			return null;
		}

		console.log("✅ 운동 알람 시간 가져오기 성공:", data);

		// ✅ 응답이 객체인지 확인 후 안전하게 접근
		if (typeof data === "object" && data !== null && "exerciseNotificationTime" in data) {
			return data.exerciseNotificationTime;
		} else {
			console.warn("⚠️ 서버 응답에 운동 알람 시간이 포함되지 않음.");
			return null;
		}
	} catch (error) {
		console.error("❌ 운동 알람 시간 요청 실패:", error);
		return null;
	}
};

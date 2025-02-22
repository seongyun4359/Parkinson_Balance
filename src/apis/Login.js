import { getApiEndpoint } from "../config/api"
import { saveTokens } from "../utils/tokenUtils"

export const loginUser = async (loginData) => {
	const API_ENDPOINT = getApiEndpoint()
	console.log("🌐 API 엔드포인트:", API_ENDPOINT)

	try {
		console.log("📤 API 요청 데이터:", loginData)

		const response = await fetch(`${API_ENDPOINT}/api/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(loginData),
		})

		console.log("📥 API 응답 상태:", response.status)

		// 응답 본문을 텍스트로 먼저 받아서 로깅
		const responseText = await response.text()
		console.log("📥 API 응답 본문:", responseText)

		if (!response.ok) {
			// 응답이 JSON 형식인 경우에만 파싱
			let errorMessage = `HTTP error! Status: ${response.status}`
			try {
				if (responseText) {
					const errorData = JSON.parse(responseText)
					errorMessage = errorData.message || errorMessage
				}
			} catch (e) {
				console.error("❌ 에러 응답 파싱 실패:", e)
			}
			throw new Error(errorMessage)
		}

		// 응답이 JSON 형식인지 확인
		let data
		try {
			data = JSON.parse(responseText)
		} catch (e) {
			console.error("❌ 응답 데이터 파싱 실패:", e)
			throw new Error("서버 응답을 파싱할 수 없습니다.")
		}

		console.log("✅ API 응답 데이터:", data)

		// 로그인 성공 시 토큰 저장
		if (data.status === "SUCCESS" && data.data[0]?.tokenDTO) {
			const { accessToken, refreshToken } = data.data[0].tokenDTO
			console.log("🔑 토큰 저장 시도")
			await saveTokens(accessToken, refreshToken)
			console.log("✅ 토큰 저장 완료")
		}

		return data
	} catch (error) {
		console.error("🚨 로그인 요청 실패:", error)
		console.error("🚨 에러 상세:", {
			message: error.message,
			stack: error.stack,
			response: error.response,
		})
		throw error
	}
}

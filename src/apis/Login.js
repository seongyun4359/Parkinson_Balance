import { apiRequest } from "../utils/apiUtils"
import { saveTokens } from "../utils/tokenUtils"

export const loginUser = async (loginData) => {
	try {
		const response = await apiRequest("/api/login", {
			method: "POST",
			body: {
				phoneNumber: loginData.phoneNumber,
				password: loginData.password,
			},
		})

		if (response.status === "SUCCESS" && response.data?.[0]?.tokenDTO) {
			const { accessToken, refreshToken } = response.data[0].tokenDTO
			console.log("🔑 토큰 저장 시도")
			await saveTokens(accessToken, refreshToken)
			console.log("✅ 토큰 저장 완료")
		}

		return response
	} catch (error) {
		console.error("🚨 로그인 요청 실패:", error)
		throw error
	}
}

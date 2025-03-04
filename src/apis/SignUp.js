import { getApiEndpoint } from "../config/api"

export const signupUser = async (userData) => {
	const API_ENDPOINT = getApiEndpoint()

	try {
		const response = await fetch(`${API_ENDPOINT}/api/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || `HTTP error! Status: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error("🚨 회원가입 요청 실패:", error)
		throw error
	}
}

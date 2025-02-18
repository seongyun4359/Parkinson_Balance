import { REACT_NATIVE_APP_API_ENDPOINT } from "@env"

export const signupUser = async (userData) => {
	try {
		const response = await fetch(`${REACT_NATIVE_APP_API_ENDPOINT}/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`)
		}

		const data = await response.json()
		return data
	} catch (error) {
		console.error("🚨 회원가입 요청 실패:", error)
		throw error
	}
}

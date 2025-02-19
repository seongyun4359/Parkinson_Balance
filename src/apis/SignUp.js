export const signupUser = async (userData) => {
	// API_ENDPOINT를 변수로 선언하고 사용
	const API_ENDPOINT = "https://kwhcclab.com:20955/api"

	try {
		const response = await fetch(`${API_ENDPOINT}/signup`, {
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

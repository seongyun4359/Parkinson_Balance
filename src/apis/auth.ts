interface SignUpRequest {
	phoneNumber: string
	password: string
	name: string
	gender: string
	fcmToken: string // FCM 토큰 추가
}

export const signUp = async (signUpData: SignUpRequest) => {
	try {
		const response = await fetch(`${API_BASE_URL}/api/members/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(signUpData),
		})
		return await response.json()
	} catch (error) {
		throw error
	}
}

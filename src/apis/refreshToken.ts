const API_URL = "https://pddiary.kwidea.com/api/members"
const REFRESH_URL = "https://pddiary.kwidea.com/api/auth/refresh" // 토큰 갱신 API
let AUTH_TOKEN =
	"eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU51bWJlciI6IjAxMC0xMjM0LTU2NzgiLCJyb2xlIjoiUEFUSUVOVCIsInN1YiI6IlkxOVN5RnRKZXQzZjNUdGVnMjJldSIsImV4cCI6MTczODgwMzg4M30._kDif0fZ25olnuQQG7nqeV3IGsuqzP9JVVSwu-NcqUU" // 여기에 최신 토큰 입력

//  API 요청 함수 (토큰 만료 시 자동 갱신 후 재요청)
const fetchWithToken = async (url: string, options: RequestInit = {}) => {
	try {
		let response = await fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${AUTH_TOKEN}`,
				"Content-Type": "application/json",
			},
		})

		// 401 Unauthorized → 토큰 만료 시 새 토큰 요청 후 재요청
		if (response.status === 401) {
			console.warn("토큰 만료됨. 새 토큰 요청 중...")
			const newToken = await refreshToken()

			if (newToken) {
				AUTH_TOKEN = newToken
				response = await fetch(url, {
					...options,
					headers: {
						...options.headers,
						Authorization: `Bearer ${AUTH_TOKEN}`,
						"Content-Type": "application/json",
					},
				})
			} else {
				throw new Error("토큰 갱신 실패")
			}
		}

		return response
	} catch (error) {
		console.error("API 요청 중 오류 발생:", error)
		throw error
	}
}

//  토큰 갱신 함수
const refreshToken = async () => {
	try {
		const response = await fetch(REFRESH_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${AUTH_TOKEN}`,
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			console.error("토큰 갱신 실패:", response.status)
			return null
		}

		const data = await response.json()
		const newToken = data?.token // 응답에서 새로운 토큰 가져옴

		if (newToken) {
			console.log("새로운 토큰 발급 완료:", newToken)
			return newToken
		} else {
			console.error("응답에 토큰 없음")
			return null
		}
	} catch (error) {
		console.error("토큰 갱신 요청 중 오류:", error)
		return null
	}
}

//  환자 데이터 가져오기 (토큰 자동 갱신 포함)
const fetchPatients = async (page = 0) => {
	try {
		const response = await fetchWithToken(`${API_URL}?page=${page}&size=10&sort=lastLoginAt,desc`)

		const result = await response.json()
		if (result.status === "SUCCESS") {
			const formattedPatients = result.data.content.map((item: any) => ({
				id: item.memberId,
				name: item.name,
				phoneNumber: item.phoneNumber,
				gender: item.gender,
				lastLogin: item.lastLoginAt,
				isFavorite: false, // 기본값 설정
				exerciseScore: 0, // 기본값 설정
			}))

			fetchPatients(formattedPatients)
			setTotalPages(result.data.totalPages)
		} else {
			console.error("Error fetching data:", result.error)
		}
	} catch (error) {
		console.error("API fetch error:", error)
	}
}
function setTotalPages(totalPages: any) {
	throw new Error("Function not implemented.")
}

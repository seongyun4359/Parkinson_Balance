import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../constants/urls"

const formatPhoneNumber = (phone: string): string => {
	// 숫자만 추출
	const numbers = phone.replace(/[^0-9]/g, "")

	// 11자리가 아니면 오류
	if (numbers.length !== 11) {
		throw new Error("올바른 전화번호 형식이 아닙니다.")
	}

	// 010으로 시작하는지 확인
	if (!numbers.startsWith("010")) {
		throw new Error("전화번호는 010으로 시작해야 합니다.")
	}

	// 하이픈 포함된 형식으로 변환 (010-XXXX-XXXX)
	return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
}

const logRequestDetails = (url: string, method: string, headers: any, body: any) => {
	console.group("=== 요청 상세 정보 ===")
	console.log("URL:", url)
	console.log("Method:", method)
	console.log("Headers:", {
		...headers,
		Authorization: headers.Authorization
			? headers.Authorization.substring(0, 20) + "..."
			: undefined,
	})
	console.log("Raw Body:", body)
	console.log("Stringified Body:", JSON.stringify(body))
	console.groupEnd()
}

const logResponseDetails = (response: Response, data: any) => {
	console.group("=== 응답 상세 정보 ===")
	console.log("Status:", response.status)
	console.log("StatusText:", response.statusText || "없음")
	console.log("Response URL:", response.url)
	console.log("Type:", response.type)
	console.log("Headers:", {
		...Object.fromEntries([...response.headers.entries()]),
	})
	console.log("Response Data:", {
		status: data.status,
		error: data.error,
		data: data.data,
		raw: data,
	})
	console.groupEnd()
}

// 토큰을 포함한 fetch 요청 함수
const fetchWithToken = async (url: string, options: RequestInit = {}) => {
	try {
		const token = await AsyncStorage.getItem("accessToken")
		if (!token) {
			throw new Error("토큰이 없습니다.")
		}

		const response = await fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error(`서버 응답 오류: ${response.status}`)
		}

		return response
	} catch (error) {
		console.error("API 요청 중 오류:", error)
		throw error
	}
}

export const sendExerciseCheerNotification = async (phoneNumbers: string[]) => {
	try {
		console.group("알림 전송 프로세스 시작")
		console.log("입력된 전화번호:", phoneNumbers)

		const accessToken = await AsyncStorage.getItem("accessToken")
		if (!accessToken) {
			throw new Error("액세스 토큰이 없습니다.")
		}

		// 토큰에서 'Bearer ' 접두사 제거 (이미 있는 경우)
		const cleanToken = accessToken.replace(/^Bearer\s+/i, "")
		console.log("액세스 토큰 확인 완료")

		// 전화번호 형식 검증 및 변환
		const formattedNumbers = phoneNumbers.map((phone) => {
			try {
				const formatted = formatPhoneNumber(phone)
				console.log("전화번호 형식 변환 성공:", { original: phone, formatted })
				return formatted
			} catch (error) {
				console.error("전화번호 형식 변환 실패:", { phone, error })
				throw new Error(`전화번호 형식 오류: ${error.message}`)
			}
		})

		const requestBody = {
			phoneNumbers: formattedNumbers,
		}

		const headers = {
			Authorization: `Bearer ${cleanToken}`,
			"Content-Type": "application/json",
		}

		const url = `${API_URL}/notifications/exercises/cheers`

		// 요청 정보 로깅
		logRequestDetails(url, "POST", headers, requestBody)

		console.log("API 요청 시작")
		const response = await fetch(url, {
			method: "POST",
			headers,
			body: JSON.stringify(requestBody),
		})
		console.log("API 응답 수신")

		const data = await response.json()

		// 응답 정보 로깅
		logResponseDetails(response, data)

		if (!response.ok) {
			console.group("서버 오류 응답 상세")
			console.log("Status Code:", response.status)
			console.log("Status Text:", response.statusText || "없음")
			console.log("Response Type:", response.type)
			console.log("Response URL:", response.url)
			console.log("Error Data:", data)
			console.groupEnd()

			if (response.status === 500) {
				console.group("서버 내부 오류 상세 분석")
				console.log("Headers:", Object.fromEntries([...response.headers.entries()]))
				console.log("Error Response:", {
					status: data.status,
					error: data.error,
					data: data.data,
					raw: data,
				})
				console.log("Request Body Used:", requestBody)
				console.groupEnd()

				throw new Error(`서버 내부 오류 (500): ${data.error || "알 수 없는 오류가 발생했습니다."}`)
			}

			// 기존 에러 처리 로직
			if (response.status === 401) {
				throw new Error("토큰이 만료되었습니다.")
			}
			if (response.status === 404) {
				throw new Error("대상 사용자를 찾을 수 없습니다. 회원 정보를 다시 확인해주세요.")
			}
			if (response.status === 400) {
				const errorMessage = data.error || "잘못된 요청입니다."
				if (errorMessage.includes("존재하지 않는 회원")) {
					throw new Error("대상 사용자를 찾을 수 없습니다. 회원 정보를 다시 확인해주세요.")
				}
				throw new Error(errorMessage)
			}

			throw new Error(
				data.error ||
					`알림 전송 실패 (${response.status}: ${response.statusText || "알 수 없는 오류"})`
			)
		}

		if (data.status !== "SUCCESS") {
			console.error("서버 응답 실패:", data)
			const errorMessage = data.error || "알림 전송에 실패했습니다."
			if (errorMessage.includes("존재하지 않는 회원")) {
				throw new Error("대상 사용자를 찾을 수 없습니다. 회원 정보를 다시 확인해주세요.")
			}
			throw new Error(errorMessage)
		}

		console.log("알림 전송 성공:", data)
		console.groupEnd()
		return data
	} catch (error: any) {
		console.group("알림 전송 오류 상세 분석")
		console.error("Error Name:", error.name)
		console.error("Error Message:", error.message)
		console.error("Error Stack:", error.stack)
		console.error("Error Cause:", error.cause)
		console.error("Is Network Error:", error.message.includes("Failed to fetch"))
		console.groupEnd()

		if (error.message.includes("Failed to fetch")) {
			throw new Error("서버 연결에 실패했습니다. 네트워크 상태를 확인해주세요.")
		}
		throw error
	}
}

export const updateFcmToken = async (fcmToken: string) => {
	try {
		const response = await fetchWithToken("https://kwhcclab.com:20955/api/fcm-token", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				fcmToken: fcmToken,
			}),
		})

		if (!response.ok) {
			throw new Error("FCM 토큰 업데이트 실패")
		}

		return true
	} catch (error) {
		console.error("FCM 토큰 업데이트 중 오류:", error)
		throw error
	}
}

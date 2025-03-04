import { getTokens, refreshAccessToken } from "./tokenUtils"
import { getApiEndpoint } from "../config/api"

const API_ENDPOINT = getApiEndpoint()

export const authenticatedFetch = async (url, options = {}) => {
	try {
		const { accessToken } = await getTokens()

		const response = await fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${accessToken}`,
			},
		})

		// 액세스 토큰이 만료된 경우
		if (response.status === 401) {
			const newAccessToken = await refreshAccessToken()

			// 새로운 액세스 토큰으로 재시도
			const retryResponse = await fetch(url, {
				...options,
				headers: {
					...options.headers,
					Authorization: `Bearer ${newAccessToken}`,
				},
			})

			return retryResponse
		}

		return response
	} catch (error) {
		console.error("인증 요청 실패:", error)
		throw error
	}
}

export const apiRequest = async (path, options = {}) => {
	const defaultHeaders = {
		"Content-Type": "application/json",
		Accept: "application/json",
		"Cache-Control": "no-cache",
		Pragma: "no-cache",
	}

	const config = {
		...options,
		headers: {
			...defaultHeaders,
			...options.headers,
		},
	}

	if (config.body && typeof config.body === "object") {
		config.body = JSON.stringify(config.body)
	}

	const url = `${API_ENDPOINT}${path}`
	console.log("📤 API 요청:", {
		url,
		method: config.method || "GET",
		headers: config.headers,
		body: config.body,
	})

	try {
		const response = await fetch(url, config)
		const responseText = await response.text()

		console.log("📥 API 응답:", {
			status: response.status,
			headers: {
				"Content-Type": response.headers.get("Content-Type"),
				"Cache-Control": response.headers.get("Cache-Control"),
				Connection: response.headers.get("Connection"),
			},
			body: responseText,
		})

		let data
		try {
			data = JSON.parse(responseText)
		} catch (e) {
			console.error("❌ 응답 데이터 파싱 실패:", e)
			throw new Error("서버 응답을 파싱할 수 없습니다.")
		}

		if (!response.ok) {
			throw new Error(data.error || data.message || `HTTP error! Status: ${response.status}`)
		}

		return data
	} catch (error) {
		console.error("🚨 API 요청 실패:", error)
		throw error
	}
}

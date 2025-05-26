import AsyncStorage from "@react-native-async-storage/async-storage"

const API_URL = "https://pddiary.kwidea.com/api"

export const addBookmark = async (memberId: string) => {
	try {
		const accessToken = await AsyncStorage.getItem("accessToken")
		if (!accessToken) {
			throw new Error("액세스 토큰이 없습니다.")
		}

		const cleanToken = accessToken.replace(/^Bearer\s+/i, "")

		console.log("즐겨찾기 등록 요청:", {
			url: `${API_URL}/bookmarks/${memberId}`,
			method: "POST",
			headers: {
				Authorization: `Bearer ${cleanToken}`,
				"Content-Type": "application/json",
			},
		})

		const response = await fetch(`${API_URL}/bookmarks/${memberId}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${cleanToken}`,
				"Content-Type": "application/json",
			},
		})

		const responseText = await response.text()
		console.log("즐겨찾기 등록 응답:", {
			status: response.status,
			statusText: response.statusText,
			data: responseText,
		})

		let data
		try {
			data = JSON.parse(responseText)
		} catch (e) {
			console.error("JSON 파싱 오류:", e)
			throw new Error("서버 응답을 파싱할 수 없습니다.")
		}

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.")
			}
			if (response.status === 404) {
				throw new Error("해당 사용자를 찾을 수 없습니다.")
			}
			if (response.status === 400) {
				throw new Error(data.error || "잘못된 요청입니다.")
			}
			throw new Error(`즐겨찾기 등록에 실패했습니다. (${response.status})`)
		}

		if (data.status !== "SUCCESS") {
			throw new Error(data.error || "즐겨찾기 등록에 실패했습니다.")
		}

		return data
	} catch (error: any) {
		console.error("즐겨찾기 등록 오류:", error)
		throw error
	}
}

export const removeBookmark = async (memberId: string) => {
	try {
		const accessToken = await AsyncStorage.getItem("accessToken")
		if (!accessToken) {
			throw new Error("액세스 토큰이 없습니다.")
		}

		const cleanToken = accessToken.replace(/^Bearer\s+/i, "")

		console.log("즐겨찾기 삭제 요청:", {
			url: `${API_URL}/bookmarks/${memberId}`,
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${cleanToken}`,
				"Content-Type": "application/json",
			},
		})

		const response = await fetch(`${API_URL}/bookmarks/${memberId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${cleanToken}`,
				"Content-Type": "application/json",
			},
		})

		const responseText = await response.text()
		console.log("즐겨찾기 삭제 응답:", {
			status: response.status,
			statusText: response.statusText,
			data: responseText,
		})

		let data
		try {
			data = JSON.parse(responseText)
		} catch (e) {
			console.error("JSON 파싱 오류:", e)
			throw new Error("서버 응답을 파싱할 수 없습니다.")
		}

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.")
			}
			if (response.status === 404) {
				throw new Error("해당 사용자를 찾을 수 없습니다.")
			}
			if (response.status === 400) {
				throw new Error(data.error || "잘못된 요청입니다.")
			}
			throw new Error(`즐겨찾기 삭제에 실패했습니다. (${response.status})`)
		}

		if (data.status !== "SUCCESS") {
			throw new Error(data.error || "즐겨찾기 삭제에 실패했습니다.")
		}

		return data
	} catch (error: any) {
		console.error("즐겨찾기 삭제 오류:", error)
		throw error
	}
}

export const getBookmarks = async () => {
	try {
		const accessToken = await AsyncStorage.getItem("accessToken")
		if (!accessToken) {
			throw new Error("액세스 토큰이 없습니다.")
		}

		const cleanToken = accessToken.replace(/^Bearer\s+/i, "")

		const response = await fetch(`${API_URL}/bookmarks`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${cleanToken}`,
				"Content-Type": "application/json",
			},
		})

		const responseText = await response.text()
		console.log("즐겨찾기 목록 응답:", {
			status: response.status,
			statusText: response.statusText,
			data: responseText,
		})

		if (!response.ok) {
			throw new Error("즐겨찾기 목록을 가져오는데 실패했습니다.")
		}

		const data = JSON.parse(responseText)
		if (data.status !== "SUCCESS") {
			throw new Error(data.error || "즐겨찾기 목록을 가져오는데 실패했습니다.")
		}

		return data.data?.content || []
	} catch (error: any) {
		console.error("즐겨찾기 목록 조회 오류:", error)
		throw error
	}
}

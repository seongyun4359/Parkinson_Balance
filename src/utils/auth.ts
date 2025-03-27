import AsyncStorage from "@react-native-async-storage/async-storage"

// 임시 토큰 값 (테스트용)
const TEMP_TOKEN =
	"eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU51bWJlciI6IjAxMC0xMTExLTExMTEiLCJyb2xlIjoiQURNSU4iLCJzdWIiOiJ0ZXN0IiwiZXhwIjoxNzM4ODA0MTUyfQ.NaGXRlQAwKvkCMb_LDIPvoWr7m9LIwNTDPgHg1VyFXU"

export const getAuthToken = async (): Promise<string> => {
	try {
		const token = await AsyncStorage.getItem("authToken")
		// 토큰이 없으면 임시 토큰 반환
		return token || TEMP_TOKEN
	} catch (error) {
		console.error("토큰 가져오기 실패:", error)
		// 에러 발생시에도 임시 토큰 반환
		return TEMP_TOKEN
	}
}

//  setAuthToken 추가
export const setAuthToken = async (token: string): Promise<void> => {
	try {
		await AsyncStorage.setItem("accessToken", token)
	} catch (error) {
		console.error("❌ 토큰 저장 오류:", error)
	}
}

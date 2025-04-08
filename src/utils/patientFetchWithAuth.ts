import AsyncStorage from "@react-native-async-storage/async-storage"
import { API_URL } from "../constants/patientUrls"

let ACCESS_TOKEN = ""

export const getTokens = async () => {
  const accessToken = await AsyncStorage.getItem("accessToken")
  const refreshToken = await AsyncStorage.getItem("refreshToken")
  return { accessToken, refreshToken }
}

export const saveTokens = async (accessToken: string, refreshToken: string) => {
  await AsyncStorage.setItem("accessToken", accessToken)
  await AsyncStorage.setItem("refreshToken", refreshToken)
  ACCESS_TOKEN = accessToken // 갱신
}

// 🔄 리프레시 토큰으로 accessToken 재발급
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken")
    console.log("📦 저장된 refreshToken:", refreshToken)
    
    if (!refreshToken) {
      console.warn("❗️ 저장된 refreshToken 없음")
      return null
    }

    const response = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    console.log("🔐 Authorization 헤더:", `Bearer ${refreshToken}`)

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error("⚠️ 응답 파싱 실패", e)
      return null
    }

    if (data.status !== "SUCCESS") {
      console.warn("❌ 리프레시 실패:", data)
      return null
    }

    const newAccessToken = data?.data?.[0]?.accessToken
    const newRefreshToken = data?.data?.[0]?.refreshToken

    if (newAccessToken && newRefreshToken) {
      await saveTokens(newAccessToken, newRefreshToken)
      console.log("✅ 토큰 갱신 완료")
      return newAccessToken
    }

    return null
  } catch (error) {
    console.error("❌ 토큰 갱신 중 에러:", error)
    return null
  }
}

// 🛠 fetch 래퍼 함수: 자동 accessToken 갱신 포함
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    if (!ACCESS_TOKEN) {
      ACCESS_TOKEN = (await AsyncStorage.getItem("accessToken")) || ""
    }

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })

    if (response.status === 401) {
      console.warn("🔒 accessToken 만료 → 리프레시 시도")
      const newToken = await refreshAccessToken()
      console.log("🎯 새 accessToken:", newToken)

      if (!newToken) {
        throw new Error("❌ 토큰 갱신 실패")
      }

      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
    }

    return response
  } catch (error) {
    console.error("🔥 fetchWithAuth 오류:", error)
    throw error
  }
}

import AsyncStorage from "@react-native-async-storage/async-storage"

export const fetchWithToken = async (url: string, options: RequestInit = {}) => {
	const accessToken = await AsyncStorage.getItem("accessToken")
	if (!accessToken) {
		throw new Error("액세스 토큰이 없습니다.")
	}

	const cleanToken = accessToken.replace(/^Bearer\s+/i, "")

	return fetch(url, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${cleanToken}`,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	})
}

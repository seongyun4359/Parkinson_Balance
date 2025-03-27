import { apiRequest } from "../utils/apiUtils"
import { saveTokens, saveFCMToken, getFCMToken } from "../utils/tokenUtils" //  FCM 토큰 관련 추가
import { saveUserInfo, getUserInfo } from "./auth"
import { getExerciseNotificationTime } from "./Alarm" //  운동 알람 시간 가져오기 추가

export const loginUser = async (loginData) => {
	try {
		const response = await apiRequest("/api/login", {
			method: "POST",
			body: {
				phoneNumber: loginData.phoneNumber,
				password: loginData.password,
			},
		})

		console.log("📥 로그인 응답 데이터:", JSON.stringify(response.data, null, 2))

		if (response.status === "SUCCESS" && response.data?.[0]?.tokenDTO) {
			const { accessToken, refreshToken } = response.data[0].tokenDTO
			console.log("🔑 토큰 저장 시도")
			await saveTokens(accessToken, refreshToken)
			console.log(" 토큰 저장 완료")

			//  기존에 저장된 사용자 정보 가져오기
			const existingUserInfo = await getUserInfo()

			// 🔥 로그인 응답에서 운동 알람 시간이 없음 -> 직접 가져오기
			let exerciseNotificationTime =
				response.data[0]?.memberInfoResponse?.exerciseNotificationTime ?? null

			if (!exerciseNotificationTime) {
				console.log("🔄 운동 알람 시간이 없으므로 서버에서 가져옵니다...")
				exerciseNotificationTime = await getExerciseNotificationTime(loginData.phoneNumber)
			}

			//  기존에 저장된 FCM 토큰 가져오기 (없으면 새로 요청)
			let fcmToken = await getFCMToken()
			if (!fcmToken) {
				console.log("🚀 새로운 FCM 토큰 가져오기...")
				fcmToken = await getFCMToken()
				if (fcmToken) {
					await saveFCMToken(fcmToken)
					console.log(" FCM 토큰 저장 완료:", fcmToken)
				} else {
					console.warn("⚠️ FCM 토큰을 가져오지 못했습니다.")
				}
			} else {
				console.log(" 기존 FCM 토큰 사용:", fcmToken)
			}

			//  최종 사용자 정보 저장
			const userInfo = {
				phoneNumber: loginData.phoneNumber,
				name: response.data[0]?.memberInfoResponse?.name || "Unknown",
				role: response.data[0]?.memberInfoResponse?.role || "USER",
				exerciseNotificationTime: exerciseNotificationTime ?? null,
				fcmToken: fcmToken, //  FCM 토큰 저장
			}

			await saveUserInfo(userInfo)
			console.log(" 사용자 정보 저장 완료:", userInfo)
		} else {
			console.warn("⚠️ 로그인 응답에 필요한 데이터가 없습니다.")
		}

		return response
	} catch (error) {
		console.error("🚨 로그인 요청 실패:", error)
		throw error
	}
}

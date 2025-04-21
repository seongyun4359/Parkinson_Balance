import { apiRequest } from "../utils/apiUtils"
import { saveTokens, saveFCMToken, getFCMToken } from "../utils/tokenUtils"
import { saveUserInfo, getUserInfo } from "./auth"
import { getExerciseNotificationTime } from "./Alarm"

export const loginUser = async (loginData) => {
	try {
		console.group("🔐 로그인 프로세스 시작")
		console.log("📱 로그인 시도:", { phoneNumber: loginData.phoneNumber, password: "***" })

		const response = await apiRequest("/api/login", {
			method: "POST",
			body: {
				phoneNumber: loginData.phoneNumber,
				password: loginData.password,
			},
		})

		console.log("📥 로그인 응답 데이터:", JSON.stringify(response, null, 2))

		if (response.status === "SUCCESS" && response.data?.[0]?.tokenDTO) {
			const { accessToken, refreshToken } = response.data[0].tokenDTO
			const memberInfo = response.data[0]?.memberInfoResponse

			if (!memberInfo) {
				throw new Error("사용자 정보가 없습니다.")
			}

			console.log("🔑 토큰 저장 시작")
			await saveTokens(accessToken, refreshToken)
			console.log("✅ 토큰 저장 완료")

			// 운동 알람 시간 처리
			let exerciseNotificationTime = memberInfo.exerciseNotificationTime
			if (!exerciseNotificationTime) {
				console.log("🔄 운동 알람 시간 조회 시도...")
				try {
					exerciseNotificationTime = await getExerciseNotificationTime(loginData.phoneNumber)
					console.log("✅ 운동 알람 시간 조회 성공:", exerciseNotificationTime)
				} catch (error) {
					console.warn("⚠️ 운동 알람 시간 조회 실패:", error)
				}
			}

			// FCM 토큰 처리
			let fcmToken = await getFCMToken()
			if (!fcmToken) {
				console.log("🔄 FCM 토큰 발급 시도...")
				try {
					fcmToken = await getFCMToken()
					if (fcmToken) {
						await saveFCMToken(fcmToken)
						console.log("✅ FCM 토큰 저장 완료:", fcmToken)
					}
				} catch (error) {
					console.warn("⚠️ FCM 토큰 처리 실패:", error)
				}
			} else {
				console.log("✅ 기존 FCM 토큰 사용:", fcmToken)
			}

			// 사용자 정보 저장
			const userInfo = {
				phoneNumber: loginData.phoneNumber,
				name: memberInfo.name || "Unknown",
				role: memberInfo.role || "PATIENT",
				exerciseNotificationTime: exerciseNotificationTime || null,
				fcmToken: fcmToken || null,
			}

			console.log("🔄 사용자 정보 저장 시도:", userInfo)
			await saveUserInfo(userInfo)
			console.log("✅ 사용자 정보 저장 완료")
			console.groupEnd()

			return response
		} else {
			console.warn("⚠️ 로그인 응답 데이터 형식 오류:", response)
			throw new Error("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.")
		}
	} catch (error) {
		console.error("🚨 로그인 프로세스 오류:", {
			message: error.message,
			stack: error.stack,
			name: error.name,
		})
		console.groupEnd()
		throw error
	}
}

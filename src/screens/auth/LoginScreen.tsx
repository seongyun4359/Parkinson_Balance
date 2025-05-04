import React, { useState, useRef, useEffect } from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert,
	ActivityIndicator,
} from "react-native"
import { loginUser } from "../../apis/Login"
import { getFCMToken } from "../../utils/tokenUtils" //  tokenUtils에서 FCM 토큰 가져오기
import { checkLoginStatus } from "../../apis/auth"
import { updateFcmToken } from "../../apis/notification"
import messaging from "@react-native-firebase/messaging"
import { requestExactAlarmPermission } from "../../utils/permissions"

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
	const [phoneNumber1, setPhoneNumber1] = useState("")
	const [phoneNumber2, setPhoneNumber2] = useState("")
	const [phoneNumber3, setPhoneNumber3] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [isEnabled, setIsEnabled] = useState(true)

	const phoneNumber2Ref = useRef<TextInput>(null)
	const phoneNumber3Ref = useRef<TextInput>(null)
	const passwordRef = useRef<TextInput>(null)

	// 전화번호 입력 처리
	const handlePhoneNumber1Change = (text: string) => {
		const cleaned = text.replace(/[^0-9]/g, "")
		setPhoneNumber1(cleaned)
		if (cleaned.length === 3) {
			phoneNumber2Ref.current?.focus()
		}
	}

	const handlePhoneNumber2Change = (text: string) => {
		const cleaned = text.replace(/[^0-9]/g, "")
		setPhoneNumber2(cleaned)
		if (cleaned.length === 4) {
			phoneNumber3Ref.current?.focus()
		}
	}

	const handlePhoneNumber3Change = (text: string) => {
		const cleaned = text.replace(/[^0-9]/g, "")
		setPhoneNumber3(cleaned)
		if (cleaned.length === 4) {
			passwordRef.current?.focus()
		}
	}

	const handleLogin = async () => {
		if (!isEnabled) return

		// 입력값 검증
		if (!phoneNumber1 || !phoneNumber2 || !phoneNumber3 || !password) {
			console.log("🚨 입력값 누락:", {
				phoneNumber1,
				phoneNumber2,
				phoneNumber3,
				password: "***",
			})
			Alert.alert("입력 오류", "모든 필드를 입력해주세요.")
			return
		}

		try {
			setIsLoading(true)
			setIsEnabled(false)

			const fullPhoneNumber = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`
			console.log("📱 전화번호 형식:", fullPhoneNumber)

			const loginData = { phoneNumber: fullPhoneNumber, password }
			console.log("📤 로그인 시도:", { phoneNumber: fullPhoneNumber, password: "***" })

			const response = await loginUser(loginData)
			console.log("📥 로그인 응답:", JSON.stringify(response, null, 2))

			if (response.status === "SUCCESS" && response.data?.[0]) {
				const { memberInfoResponse } = response.data[0]
				console.log("✅ 로그인 성공 - 사용자 정보:", JSON.stringify(memberInfoResponse, null, 2))

				try {
					// 환자인 경우에만 정확한 알람 권한 요청
					if (memberInfoResponse.role === "PATIENT") {
						const hasAlarmPermission = await requestExactAlarmPermission()
						if (!hasAlarmPermission) {
							console.warn("⚠️ 정확한 알람 권한이 거부됨")
							Alert.alert(
								"알람 권한 필요",
								"정확한 시간에 운동 알람을 받으려면 알람 권한이 필요합니다. 설정에서 권한을 허용해주세요."
							)
						}
					}

					// FCM 토큰 가져오기
					const fcmToken = await messaging().getToken()
					console.log("📱 FCM 토큰 발급 성공:", fcmToken)

					// FCM 토큰 서버에 업데이트 (환자/관리자 모두)
					try {
						await updateFcmToken(fcmToken)
						console.log("✅ FCM 토큰 업데이트 성공")
					} catch (error) {
						console.error("❌ FCM 토큰 업데이트 실패:", error)
						// FCM 토큰 업데이트 실패는 치명적이지 않으므로 계속 진행
					}

					// FCM 토큰 갱신 리스너 설정
					const unsubscribe = messaging().onTokenRefresh(async (newToken) => {
						console.log("🔄 FCM 토큰 갱신 감지:", newToken)
						try {
							await updateFcmToken(newToken)
							console.log("✅ FCM 토큰 갱신 업데이트 성공")
						} catch (error) {
							console.error("❌ FCM 토큰 갱신 업데이트 실패:", error)
						}
					})

					// 사용자 역할 확인 및 화면 이동
					const targetScreen = memberInfoResponse.role === "PATIENT" ? "PatientHome" : "InfoTable"
					console.log("🔄 화면 이동:", targetScreen)

					navigation.reset({
						index: 0,
						routes: [{ name: targetScreen }],
					})
				} catch (error) {
					console.error("❌ FCM 토큰 처리 중 오류:", error)
					Alert.alert(
						"로그인 오류",
						"로그인은 성공했지만 알림 설정에 문제가 발생했습니다. 다시 시도해주세요."
					)
				}
			} else {
				console.log("❌ 응답 데이터 형식 오류:", response)
				Alert.alert("로그인 실패", "아이디 또는 비밀번호가 올바르지 않습니다.")
			}
		} catch (error) {
			console.error("🚨 로그인 에러:", error)
			Alert.alert("로그인 실패", error.message || "로그인에 실패했습니다. 다시 시도해주세요.")
		} finally {
			setIsLoading(false)
			setIsEnabled(true)
		}
	}

	const handleSignup = () => {
		navigation.navigate("SignUp") // "Signup"에서 "SignUp"으로 수정
	}

	useEffect(() => {
		const checkAuth = async () => {
			const { isLoggedIn, userInfo } = await checkLoginStatus()
			if (isLoggedIn && userInfo) {
				navigation.reset({
					index: 0,
					routes: [
						{
							name: userInfo.role === "PATIENT" ? "PatientHome" : "InfoTable",
						},
					],
				})
			}
		}

		checkAuth()
	}, [navigation])

	// FCM 토큰 갱신 감지
	useEffect(() => {
		const unsubscribe = messaging().onTokenRefresh(async (token) => {
			console.log("FCM 토큰 갱신 감지:", token)
			try {
				await updateFcmToken(token)
				console.log("FCM 토큰 갱신 업데이트 성공")
			} catch (error) {
				console.error("FCM 토큰 갱신 업데이트 실패:", error)
			}
		})

		return () => unsubscribe()
	}, [])

	return (
		<View style={styles.container}>
			<Image source={require("../../assets/logo/app-logo.png")} style={styles.logo} />

			<Text style={styles.label}>전화번호</Text>
			<View style={styles.phoneNumberContainer}>
				<TextInput
					style={[styles.phoneInput, styles.phoneFirst]}
					placeholderTextColor="#fff"
					value={phoneNumber1}
					onChangeText={handlePhoneNumber1Change}
					keyboardType="number-pad"
					maxLength={3}
					editable={!isLoading}
				/>
				<Text style={styles.phoneSeparator}>-</Text>
				<TextInput
					ref={phoneNumber2Ref}
					style={styles.phoneInput}
					placeholderTextColor="#fff"
					value={phoneNumber2}
					onChangeText={handlePhoneNumber2Change}
					keyboardType="number-pad"
					maxLength={4}
					editable={!isLoading}
				/>
				<Text style={styles.phoneSeparator}>-</Text>
				<TextInput
					ref={phoneNumber3Ref}
					style={styles.phoneInput}
					placeholderTextColor="#fff"
					value={phoneNumber3}
					onChangeText={handlePhoneNumber3Change}
					keyboardType="number-pad"
					maxLength={4}
					editable={!isLoading}
				/>
			</View>

			<Text style={styles.label}>비밀번호</Text>
			<TextInput
				ref={passwordRef}
				style={styles.input}
				placeholder="비밀번호"
				placeholderTextColor="#fff"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
				editable={!isLoading}
			/>

			<TouchableOpacity
				style={[styles.button, !isEnabled && styles.buttonDisabled]}
				onPress={handleLogin}
				disabled={!isEnabled || isLoading}
			>
				{isLoading ? (
					<ActivityIndicator color="#76DABF" />
				) : (
					<Text style={styles.buttonText}>로그인</Text>
				)}
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.signupButton, !isEnabled && styles.buttonDisabled]}
				onPress={handleSignup}
				disabled={!isEnabled || isLoading}
			>
				<Text style={styles.signupButtonText}>회원가입</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#76DABF",
		padding: 16,
	},
	logo: {
		width: 100,
		height: 100,
		marginBottom: 40,
	},
	phoneNumberContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: "80%",
		marginBottom: 20,
	},
	phoneInput: {
		flex: 1,
		height: 50,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		color: "#fff",
		textAlign: "center",
	},
	phoneFirst: {
		flex: 0.8,
	},
	phoneSeparator: {
		color: "#fff",
		fontSize: 20,
		marginHorizontal: 5,
	},
	input: {
		width: "80%",
		height: 50,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		color: "#fff",
		marginBottom: 20,
	},
	label: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold",
		alignSelf: "flex-start",
		marginLeft: 30,
		marginBottom: 8,
	},
	button: {
		width: "80%",
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	buttonText: {
		color: "#76DABF",
		fontSize: 18,
		fontWeight: "bold",
	},
	signupButton: {
		width: "80%",
		height: 50,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
	},
	signupButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	buttonDisabled: {
		opacity: 0.5,
	},
})

export default LoginScreen

import React, { useState, useRef } from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert,
} from "react-native"
import { loginUser } from "../../apis/Login"
import { getFCMToken } from "../../utils/tokenUtils" // ✅ tokenUtils에서 FCM 토큰 가져오기

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
	const [phoneNumber1, setPhoneNumber1] = useState("")
	const [phoneNumber2, setPhoneNumber2] = useState("")
	const [phoneNumber3, setPhoneNumber3] = useState("")
	const [password, setPassword] = useState("")

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
		// 입력값 검증
		if (!phoneNumber1 || !phoneNumber2 || !phoneNumber3 || !password) {
			console.log("🚨 입력값 누락:", {
				phoneNumber1,
				phoneNumber2,
				phoneNumber3,
				password,
			})
			Alert.alert("입력 오류", "모든 필드를 입력해주세요.")
			return
		}

		const fullPhoneNumber = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`
		console.log("📱 전화번호 형식:", fullPhoneNumber)

		try {
			const loginData = { phoneNumber: fullPhoneNumber, password }
			console.log("📤 로그인 시도:", loginData)

			const response = await loginUser(loginData)
			console.log("📥 로그인 응답:", response)

			if (response.status === "SUCCESS" && response.data[0]) {
				const { memberInfoResponse } = response.data[0]
				console.log("✅ 로그인 성공:", memberInfoResponse)

				// 🔹 로그인 후 저장된 FCM 토큰 사용 (새로 요청하지 않음)
				const fcmToken = await getFCMToken()
				if (fcmToken) {
					console.log("✅ 로그인 후 FCM 토큰 사용:", fcmToken)
				} else {
					console.warn("⚠️ 로그인 후 저장된 FCM 토큰이 없습니다.")
				}

				// 🔹 사용자 역할에 따라 화면 이동
				navigation.navigate(
					memberInfoResponse.role === "PATIENT" ? "PatientHome" : "InfoTable"
				)
			} else {
				console.log("❌ 응답 데이터 형식 오류:", response)
				Alert.alert("로그인 실패", "응답 데이터가 올바르지 않습니다.")
			}
		} catch (error) {
			console.error("🚨 로그인 에러:", error)
			Alert.alert(
				"로그인 실패",
				error.message || "로그인에 실패했습니다. 다시 시도해주세요."
			)
		}
	}

	return (
		<View style={styles.container}>
			<Image
				source={require("../../assets/logo/app-logo.png")}
				style={styles.logo}
			/>

			<Text style={styles.label}>전화번호</Text>
			<View style={styles.phoneNumberContainer}>
				<TextInput
					style={[styles.phoneInput, styles.phoneFirst]}
					placeholderTextColor="#fff"
					value={phoneNumber1}
					onChangeText={handlePhoneNumber1Change}
					keyboardType="number-pad"
					maxLength={3}
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
			/>

			<TouchableOpacity style={styles.button} onPress={handleLogin}>
				<Text style={styles.buttonText}>로그인</Text>
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
		marginBottom: 20,
	},
	signupButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
})

export default LoginScreen

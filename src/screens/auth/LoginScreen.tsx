import React, { useState, useRef } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native"
import { loginUser } from "../../apis/Login"

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
	const [phoneNumber1, setPhoneNumber1] = useState("")
	const [phoneNumber2, setPhoneNumber2] = useState("")
	const [phoneNumber3, setPhoneNumber3] = useState("")
	const [password, setPassword] = useState("")

	// 전화번호 입력 처리
	const handlePhoneNumber1Change = (text: string) => {
		const cleaned = text.replace(/[^0-9]/g, "")
		setPhoneNumber1(cleaned)
		if (cleaned.length === 3) {
			// 다음 입력 필드로 포커스 이동
			phoneNumber2Ref.current?.focus()
		}
	}

	const handlePhoneNumber2Change = (text: string) => {
		const cleaned = text.replace(/[^0-9]/g, "")
		setPhoneNumber2(cleaned)
		if (cleaned.length === 4) {
			// 다음 입력 필드로 포커스 이동
			phoneNumber3Ref.current?.focus()
		}
	}

	const handlePhoneNumber3Change = (text: string) => {
		const cleaned = text.replace(/[^0-9]/g, "")
		setPhoneNumber3(cleaned)
		if (cleaned.length === 4) {
			// 비밀번호 입력 필드로 포커스 이동
			passwordRef.current?.focus()
		}
	}

	// 입력 필드 참조 생성
	const phoneNumber2Ref = useRef<TextInput>(null)
	const phoneNumber3Ref = useRef<TextInput>(null)
	const passwordRef = useRef<TextInput>(null)

	const handleLogin = async () => {
		// 입력값 검증
		if (!phoneNumber1 || !phoneNumber2 || !phoneNumber3 || !password) {
			console.log("🚨 입력값 누락:", { phoneNumber1, phoneNumber2, phoneNumber3, password })
			Alert.alert("입력 오류", "모든 필드를 입력해주세요.")
			return
		}

		// 전화번호 형식 검증
		if (phoneNumber1.length !== 3 || phoneNumber2.length !== 4 || phoneNumber3.length !== 4) {
			console.log("🚨 전화번호 형식 오류:", { phoneNumber1, phoneNumber2, phoneNumber3 })
			Alert.alert("전화번호 오류", "올바른 전화번호 형식이 아닙니다.")
			return
		}

		const fullPhoneNumber = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`
		console.log("📱 전화번호 형식:", fullPhoneNumber)

		try {
			const loginData = {
				phoneNumber: fullPhoneNumber,
				password: password,
			}

			console.log("📤 로그인 시도:", loginData)

			const response = await loginUser(loginData)
			console.log("📥 로그인 응답:", response)

			if (response.status === "SUCCESS" && response.data[0]) {
				const { memberInfoResponse } = response.data[0]
				console.log("✅ 로그인 성공:", memberInfoResponse)

				if (memberInfoResponse.role === "PATIENT") {
					console.log("🏥 환자 화면으로 이동")
					navigation.navigate("PatientHome")
				} else {
					console.log("👨‍⚕️ 의료진 화면으로 이동")
					navigation.navigate("MedicalStaffHome")
				}
			} else {
				console.log("❌ 응답 데이터 형식 오류:", response)
				Alert.alert("로그인 실패", "응답 데이터가 올바르지 않습니다.")
			}
		} catch (error) {
			console.error("🚨 로그인 에러:", error)
			console.error("🚨 에러 상세:", {
				message: error.message,
				stack: error.stack,
				response: error.response,
			})
			Alert.alert("로그인 실패", error.message || "로그인에 실패했습니다. 다시 시도해주세요.")
		}
	}

	// 임시 관리자 로그인 핸들러 추가
	const handleAdminLogin = async () => {
		try {
			const adminLoginData = {
				phoneNumber: "010-1234-5678",
				password: "test1234",
			}

			console.log("📤 관리자 로그인 시도:", adminLoginData)

			const response = await loginUser(adminLoginData)
			console.log("📥 관리자 로그인 응답:", response)

			if (response.status === "SUCCESS" && response.data[0]) {
				const { memberInfoResponse } = response.data[0]
				console.log("✅ 관리자 로그인 성공:", memberInfoResponse)
				navigation.navigate("MedicalStaffHome")
			}
		} catch (error) {
			console.error("🚨 관리자 로그인 에러:", error)
			Alert.alert("로그인 실패", "관리자 로그인에 실패했습니다.")
		}
	}

	return (
		<View style={styles.container}>
			<Image source={require("../../assets/logo/app-logo.png")} style={styles.logo} />

			<View style={styles.phoneNumberContainer}>
				<TextInput
					style={[styles.phoneInput, styles.phoneFirst]}
					placeholder="010"
					placeholderTextColor="#fff"
					value={phoneNumber1}
					onChangeText={handlePhoneNumber1Change}
					keyboardType="number-pad"
					maxLength={3}
					returnKeyType="next"
					onSubmitEditing={() => phoneNumber2Ref.current?.focus()}
				/>
				<Text style={styles.phoneSeparator}>-</Text>
				<TextInput
					ref={phoneNumber2Ref}
					style={styles.phoneInput}
					placeholder="0000"
					placeholderTextColor="#fff"
					value={phoneNumber2}
					onChangeText={handlePhoneNumber2Change}
					keyboardType="number-pad"
					maxLength={4}
					returnKeyType="next"
					onSubmitEditing={() => phoneNumber3Ref.current?.focus()}
				/>
				<Text style={styles.phoneSeparator}>-</Text>
				<TextInput
					ref={phoneNumber3Ref}
					style={styles.phoneInput}
					placeholder="0000"
					placeholderTextColor="#fff"
					value={phoneNumber3}
					onChangeText={handlePhoneNumber3Change}
					keyboardType="number-pad"
					maxLength={4}
					returnKeyType="next"
					onSubmitEditing={() => passwordRef.current?.focus()}
				/>
			</View>

			<TextInput
				ref={passwordRef}
				style={styles.input}
				placeholder="비밀번호"
				placeholderTextColor="#fff"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
				returnKeyType="done"
				onSubmitEditing={handleLogin}
			/>

			<TouchableOpacity style={styles.button} onPress={handleLogin}>
				<Text style={styles.buttonText}>로그인</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.signupButton} onPress={() => navigation.navigate("SignUp")}>
				<Text style={styles.signupButtonText}>회원가입</Text>
			</TouchableOpacity>

			{/* 임시 관리자 로그인 버튼 추가 */}
			<TouchableOpacity style={[styles.adminButton, { marginBottom: 20 }]} onPress={handleAdminLogin}>
				<Text style={styles.adminButtonText}>관리자 로그인</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={() => navigation.navigate("LostAccount")}>
				<Text style={styles.lostAccount}>계정을 잃어버리셨나요?</Text>
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
	lostAccount: {
		color: "#fff",
		fontSize: 14,
		textDecorationLine: "underline",
	},
	// 관리자 로그인 버튼 스타일 추가
	adminButton: {
		width: "80%",
		height: 50,
		backgroundColor: "#FF6B6B", // 구분을 위한 다른 색상
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	adminButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
})

export default LoginScreen

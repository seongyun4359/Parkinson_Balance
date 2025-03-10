import React, { useState } from "react"
import { ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import NameGenderInput from "../../components/auth/NameGenderInput"
import PhoneNumberInput from "../../components/auth/PhoneNumberInput"
import PasswordInput from "../../components/auth/PasswordInput"
import ExerciseTimeInput from "../../components/auth/ExerciseTimeInput"
import { signupUser } from "../../apis/SignUp"
import { getFCMToken } from "../../utils/fcmToken"

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
	const [name, setName] = useState("")
	const [gender, setGender] = useState("남성")
	const [phoneNumber1, setPhoneNumber1] = useState("")
	const [phoneNumber2, setPhoneNumber2] = useState("")
	const [phoneNumber3, setPhoneNumber3] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [hour, setHour] = useState("")
	const [minute, setMinute] = useState("")
	const [second, setSecond] = useState("")
	const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null)

	const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d_!@#$%^&*\-+=?]{4,20}$/

	const handleSignUp = async () => {
		if (password !== confirmPassword) {
			Alert.alert("비밀번호 오류", "비밀번호가 일치하지 않습니다.")
			return
		}

		if (!passwordPattern.test(password)) {
			Alert.alert("비밀번호 조건 미충족", "비밀번호는 4~20자, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.")
			return
		}

		if (!name || !phoneNumber1 || !phoneNumber2 || !phoneNumber3 || !password || !confirmPassword) {
			Alert.alert("필수 항목 확인", "모든 필드를 입력해주세요.")
			return
		}

		if (!hour || !minute || !second) {
			Alert.alert("운동 알림 시간 확인", "운동 알림 시간을 입력해주세요.")
			return
		}

		const fullPhoneNumber = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`
		let adjustedHour = parseInt(hour)

		const exerciseNotificationTime = `${String(adjustedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`

		try {
			// FCM 토큰 가져오기
			const fcmToken = await getFCMToken()

			const signUpData = {
				phoneNumber: fullPhoneNumber,
				password,
				name,
				gender: gender === "남성" ? "MALE" : "FEMALE",
				fcmToken,
				exerciseNotificationTime,
			}

			const response = await signupUser(signUpData)
			Alert.alert("회원가입 성공", "회원가입이 완료되었습니다!", [{ text: "확인", onPress: () => navigation.goBack() }])
		} catch (error) {
			console.error("회원가입 실패:", error)

			// 전화번호 중복 오류 처리
			if (error.response?.status === 409) {
				Alert.alert("회원가입 실패", "이미 가입된 전화번호입니다.")
			} else {
				Alert.alert("회원가입 실패", error.message || "알 수 없는 오류가 발생했습니다.")
			}
		}
	}

	const handleConfirmPasswordChange = (text: string) => {
		setConfirmPassword(text)
		setPasswordMatch(text === password)
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>회원가입</Text>
			<NameGenderInput name={name} setName={setName} gender={gender} setGender={setGender} />
			<PhoneNumberInput
				phoneNumber1={phoneNumber1}
				setPhoneNumber1={setPhoneNumber1}
				phoneNumber2={phoneNumber2}
				setPhoneNumber2={setPhoneNumber2}
				phoneNumber3={phoneNumber3}
				setPhoneNumber3={setPhoneNumber3}
			/>
			<Text style={styles.label}>비밀번호</Text>
			<PasswordInput value={password} onChangeText={setPassword} placeholder="비밀번호" />

			<Text style={styles.label}>비밀번호 확인</Text>
			<PasswordInput value={confirmPassword} onChangeText={handleConfirmPasswordChange} placeholder="비밀번호 확인" />

			<Text style={styles.label}>고정 운동 알림 시간</Text>
			<ExerciseTimeInput hour={hour} setHour={setHour} minute={minute} setMinute={setMinute} second={second} setSecond={setSecond} />
			<TouchableOpacity style={styles.button} onPress={handleSignUp}>
				<Text style={styles.buttonText}>회원가입</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.goBack()}>
				<Text style={styles.backText}>뒤로가기</Text>
			</TouchableOpacity>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#F5F5F5",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 20,
	},
	button: {
		width: "100%",
		height: 50,
		backgroundColor: "#76DABF",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		marginBottom: 20,
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	backText: {
		color: "#555",
		fontSize: 16,
		textDecorationLine: "underline",
	},
	label: {
		fontSize: 16,
		color: "#333",
		marginBottom: 5,
		alignSelf: "flex-start",
	},
})

export default SignUpScreen

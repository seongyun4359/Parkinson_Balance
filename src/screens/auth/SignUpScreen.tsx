import React, { useState, useEffect } from "react"
import { ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import NameGenderInput from "../../components/auth/NameGenderInput"
import PhoneNumberInput from "../../components/auth/PhoneNumberInput"
import PasswordInput from "../../components/auth/PasswordInput"
import ExerciseTimeInput from "../../components/auth/ExerciseTimeInput"
import { signupUser } from "../../apis/SignUp"

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
	const [amPm, setAmPm] = useState("AM")

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

		if (amPm === "PM" && adjustedHour !== 12) {
			adjustedHour += 12
		} else if (amPm === "AM" && adjustedHour === 12) {
			adjustedHour = 0
		}

		const exerciseNotificationTime = `${String(adjustedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`

		const userData = {
			phoneNumber: fullPhoneNumber,
			password,
			name,
			gender: gender === "남성" ? "MALE" : "FEMALE",
			fcmToken: "testFCMTOKEN",
			exerciseNotificationTime,
		}

		try {
			const response = await signupUser(userData)
			Alert.alert("회원가입 성공", "회원가입이 완료되었습니다!", [{ text: "확인", onPress: () => navigation.goBack() }])
		} catch (error) {
			Alert.alert("회원가입 실패", error.message || "회원가입에 실패했습니다. 다시 시도해주세요.")
		}
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
			<PasswordInput value={password} onChangeText={setPassword} placeholder="비밀번호" />
			<PasswordInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="비밀번호 확인" />
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
})

export default SignUpScreen

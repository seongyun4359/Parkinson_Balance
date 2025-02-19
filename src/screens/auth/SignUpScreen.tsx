import React, { useState } from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
} from "react-native"
import { Picker } from "@react-native-picker/picker"

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

	const handleSignUp = () => {
		const fullPhoneNumber = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`

		let adjustedHour = parseInt(hour) || 0

		if (amPm === "PM" && adjustedHour !== 12) {
			adjustedHour += 12
		} else if (amPm === "AM" && adjustedHour === 12) {
			adjustedHour = 0
		}

		const exerciseNotificationTime = `${adjustedHour}:${minute}:${second}`

		const userInfo = [
			`이름: ${name}`,
			`성별: ${gender}`,
			`휴대폰번호: ${fullPhoneNumber}`,
			`비밀번호: ${password}`,
			`비밀번호 확인: ${confirmPassword}`,
			`운동 알림 시간: ${exerciseNotificationTime}`,
		]
		console.log(userInfo)
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>회원가입</Text>
			<View style={styles.nameGenderContainer}>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>이름</Text>
					<TextInput
						style={styles.input}
						placeholder="이름"
						placeholderTextColor="#999"
						value={name}
						onChangeText={setName}
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>성별</Text>
					<View style={styles.pickerContainer}>
						<Picker
							selectedValue={gender}
							onValueChange={(itemValue) => setGender(itemValue)}
							style={styles.picker}
						>
							<Picker.Item label="남성" value="남성" />
							<Picker.Item label="여성" value="여성" />
						</Picker>
					</View>
				</View>
			</View>
			<Text style={styles.label}>휴대폰 번호</Text>
			<View style={styles.phoneNumberContainer}>
				<TextInput
					style={styles.phoneInput}
					placeholder="010"
					placeholderTextColor="#999"
					keyboardType="numeric"
					maxLength={3}
					value={phoneNumber1}
					onChangeText={(text) => setPhoneNumber1(text)}
				/>
				<Text>-</Text>
				<TextInput
					style={styles.phoneInput}
					placeholder="1234"
					placeholderTextColor="#999"
					keyboardType="numeric"
					maxLength={4}
					value={phoneNumber2}
					onChangeText={(text) => setPhoneNumber2(text)}
				/>
				<Text>-</Text>
				<TextInput
					style={styles.phoneInput}
					placeholder="5678"
					placeholderTextColor="#999"
					keyboardType="numeric"
					maxLength={4}
					value={phoneNumber3}
					onChangeText={(text) => setPhoneNumber3(text)}
				/>
			</View>
			<Text style={styles.label}>비밀번호</Text>
			<TextInput
				style={styles.input}
				placeholder="비밀번호"
				placeholderTextColor="#999"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<Text style={styles.label}>비밀번호 확인</Text>
			<TextInput
				style={styles.input}
				placeholder="비밀번호 확인"
				placeholderTextColor="#999"
				secureTextEntry
				value={confirmPassword}
				onChangeText={setConfirmPassword}
			/>
			<Text style={styles.label}>운동 알림 시간</Text>
			<View style={styles.timeInputContainer}>
				<TextInput
					style={styles.timeInput}
					placeholder="시"
					placeholderTextColor="#999"
					keyboardType="numeric"
					value={hour}
					onChangeText={setHour}
				/>
				<Text>:</Text>
				<TextInput
					style={styles.timeInput}
					placeholder="분"
					placeholderTextColor="#999"
					keyboardType="numeric"
					value={minute}
					onChangeText={setMinute}
				/>
				<Text>:</Text>
				<TextInput
					style={styles.timeInput}
					placeholder="초"
					placeholderTextColor="#999"
					keyboardType="numeric"
					value={second}
					onChangeText={setSecond}
				/>
			</View>
			<Text style={styles.label}>오전/오후</Text>
			<View style={styles.pickerContainer}>
				<Picker
					selectedValue={amPm}
					onValueChange={(itemValue) => setAmPm(itemValue)}
					style={styles.picker}
				>
					<Picker.Item label="AM" value="AM" />
					<Picker.Item label="PM" value="PM" />
				</Picker>
			</View>
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
	label: {
		width: "100%",
		fontSize: 16,
		color: "#333",
		marginBottom: 5,
		textAlign: "left",
	},
	input: {
		width: "100%",
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		marginBottom: 15,
		elevation: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		borderWidth: 1,
		borderColor: "#808080",
	},
	pickerContainer: {
		width: "100%",
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 10,
		justifyContent: "center",
		marginBottom: 15,
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		borderWidth: 1,
		borderColor: "#808080",
	},
	picker: {
		width: "100%",
		height: "100%",
	},
	phoneNumberContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	phoneInput: {
		width: "30%",
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		elevation: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		borderWidth: 1,
		borderColor: "#808080",
	},
	timeInputContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	timeInput: {
		width: "30%",
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		elevation: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		borderWidth: 1,
		borderColor: "#808080",
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
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
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
	nameGenderContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	inputContainer: {
		width: "48%",
	},
})

export default SignUpScreen

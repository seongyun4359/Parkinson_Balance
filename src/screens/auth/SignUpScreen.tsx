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
	const [phone, setPhone] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")

	const handleSignUp = () => {
		const userInfo = [
			`이름: ${name}`,
			`성별: ${gender}`,
			`휴대폰번호: ${phone}`,
			`비밀번호: ${password}`,
			`비밀번호 확인: ${confirmPassword}`,
		]
		console.log(userInfo)
	}

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>회원가입</Text>
			<TextInput
				style={styles.input}
				placeholder="이름"
				placeholderTextColor="#999"
				value={name}
				onChangeText={setName}
			/>
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
			<TextInput
				style={styles.input}
				placeholder="휴대폰번호"
				placeholderTextColor="#999"
				keyboardType="phone-pad"
				value={phone}
				onChangeText={setPhone}
			/>
			<TextInput
				style={styles.input}
				placeholder="비밀번호"
				placeholderTextColor="#999"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<TextInput
				style={styles.input}
				placeholder="비밀번호 확인"
				placeholderTextColor="#999"
				secureTextEntry
				value={confirmPassword}
				onChangeText={setConfirmPassword}
			/>
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
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 30,
	},
	input: {
		width: "100%",
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		marginBottom: 15,
		elevation: 3, // 안드로이드 그림자
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
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
	},
	picker: {
		width: "100%",
		height: "100%",
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
})

export default SignUpScreen

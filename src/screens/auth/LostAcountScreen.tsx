import React, { useState } from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
} from "react-native"

const LostAcountScreen: React.FC = () => {
	const [input, setInput] = useState("")

	const handleRecovery = () => {
		if (!input) {
			Alert.alert("오류", "이메일 또는 전화번호를 입력해주세요.")
			return
		}
		// 계정 복구 요청 처리 (추후 API 연동 가능)
		Alert.alert(
			"요청 완료",
			`${input}로 계정 복구 이메일/문자가 전송되었습니다.`
		)
		setInput("")
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>계정 복구</Text>
			<Text style={styles.description}>
				등록된 이메일 또는 전화번호를 입력하면 계정을 복구하는 방법을
				보내드립니다.
			</Text>
			<TextInput
				style={styles.input}
				placeholder="이메일 또는 전화번호"
				placeholderTextColor="#aaa"
				value={input}
				onChangeText={setInput}
				keyboardType="email-address"
			/>
			<TouchableOpacity style={styles.button} onPress={handleRecovery}>
				<Text style={styles.buttonText}>계정 찾기</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#76DABF",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 20,
	},
	description: {
		fontSize: 16,
		color: "#fff",
		textAlign: "center",
		marginBottom: 30,
		lineHeight: 22,
	},
	input: {
		width: "90%",
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		marginBottom: 20,
	},
	button: {
		width: "90%",
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "#76DABF",
		fontSize: 18,
		fontWeight: "bold",
	},
})

export default LostAcountScreen

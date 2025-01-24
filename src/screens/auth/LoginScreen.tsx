import React from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Image,
} from "react-native"

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
	return (
		<View style={styles.container}>
			{/* App Logo */}
			<Image
				source={require("../../assets/logo/app-logo.png")}
				style={styles.logo}
			/>

			{/* Input Fields */}
			<TextInput
				style={styles.input}
				placeholder="아이디"
				placeholderTextColor="#fff"
			/>
			<TextInput
				style={styles.input}
				placeholder="비밀번호"
				placeholderTextColor="#fff"
				secureTextEntry
			/>

			{/* Buttons */}
			<TouchableOpacity
				style={styles.button}
				onPress={() => navigation.navigate("MedicalStaffHome")}
			>
				<Text style={styles.buttonText}>관리자 로그인</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.button}
				onPress={() => navigation.navigate("PatientHome")}
			>
				<Text style={styles.buttonText}>환자 로그인</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.signupButton}
				onPress={() => navigation.navigate("SignUp")}
			>
				<Text style={styles.signupButtonText}>회원가입</Text>
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
})

export default LoginScreen

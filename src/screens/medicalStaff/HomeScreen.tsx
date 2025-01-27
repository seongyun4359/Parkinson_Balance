import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
	const handleLogout = () => {
		Alert.alert("로그아웃", "로그아웃 되었습니다.")
		navigation.replace("Login")
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Icon name="admin-panel-settings" size={50} color="#fff" />
				<Text style={styles.title}>관리자 홈 화면</Text>
			</View>
			<TouchableOpacity
				style={styles.button}
				onPress={() => navigation.navigate("SearchInfo")}
			>
				<Icon
					name="person"
					size={24}
					color="#76DABF"
					style={styles.buttonIcon}
				/>
				<Text style={styles.buttonText}>환자 개인 정보 조회 및 변경</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.button}
				onPress={() => navigation.navigate("InfoTable")}
			>
				<Icon
					name="history"
					size={24}
					color="#76DABF"
					style={styles.buttonIcon}
				/>
				<Text style={styles.buttonText}>기록 조회 / 알림 전송</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
				<Icon name="logout" size={20} color="#fff" />
				<Text style={styles.logoutText}>로그아웃</Text>
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
	header: {
		alignItems: "center",
		marginBottom: 30,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
		marginTop: 10,
	},
	button: {
		width: "80%",
		height: 60,
		backgroundColor: "#fff",
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 20,
		elevation: 2,
	},
	buttonIcon: {
		marginRight: 10,
	},
	buttonText: {
		color: "#76DABF",
		fontSize: 16,
		fontWeight: "bold",
	},
	logoutButton: {
		position: "absolute",
		bottom: 50,
		flexDirection: "row",
		alignItems: "center",
	},
	logoutText: {
		fontSize: 14,
		color: "#fff",
		marginLeft: 5,
		textDecorationLine: "underline",
	},
})

export default HomeScreen

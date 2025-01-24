import React, { useEffect } from "react"
import { View, Text, StyleSheet, Image } from "react-native"

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			navigation.replace("Login") // 3초 후 Login 화면으로 이동
		}, 3000)
		return () => clearTimeout(timer) // 타이머 정리
	}, [navigation])

	return (
		<View style={styles.container}>
			{/* 로고 이미지 */}
			<Image
				source={require("../assets/logo/app-logo.png")} // 로고 경로 설정
				style={styles.logo}
			/>
			{/* 어플리케이션 이름 */}
			<Text style={styles.appName}>파킨슨 밸런스</Text>
			{/* 간단한 설명 */}
			<Text style={styles.subtitle}>건강한 움직임을 위한 동반자</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#76DABF", // 상쾌한 녹색 배경
	},
	logo: {
		width: 120,
		height: 120,
		marginBottom: 20,
	},
	appName: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: "#fff",
		textAlign: "center",
		paddingHorizontal: 20,
	},
})

export default SplashScreen

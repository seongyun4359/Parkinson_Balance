import React, { useEffect } from "react"
import { View, Text, StyleSheet, Image } from "react-native"

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			navigation.replace("Login")
		}, 3000)
		return () => clearTimeout(timer)
	}, [navigation])

	return (
		<View style={styles.container}>
			<Image
				source={require("../assets/logo/app-logo.png")}
				style={styles.logo}
			/>
			<Text style={styles.appName}>파킨슨 밸런스</Text>
			<Text style={styles.subtitle}>건강한 움직임을 위한 동반자</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#76DABF", // 로고 기본 색상
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

import React, { useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"

const SplashScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			navigation.replace("Login")
		}, 3000)
		return () => clearTimeout(timer)
	}, [navigation])

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Welcome to My App!</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
})

export default SplashScreen

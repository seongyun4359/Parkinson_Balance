import React, { useState } from "react"
import { TextInput, StyleSheet, View } from "react-native"
import Icon from "react-native-vector-icons/AntDesign"

const PasswordInput: React.FC<{
	value: string
	onChangeText: (text: string) => void
	placeholder: string
}> = ({ value, onChangeText, placeholder }) => {
	const [showPassword, setShowPassword] = useState(false)

	const togglePasswordVisibility = () => {
		setShowPassword(true)
		setTimeout(() => {
			setShowPassword(false)
		}, 3000)
	}

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder={placeholder}
				placeholderTextColor="#999"
				secureTextEntry={!showPassword}
				value={value}
				onChangeText={onChangeText}
			/>
			<Icon
				name="eye"
				size={24}
				color="#999"
				style={styles.icon}
				onPress={togglePasswordVisibility}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		position: "relative",
		width: "100%",
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
		borderWidth: 1.5,
		borderColor: "#a0a0a0",
		paddingRight: 40,
	},
	icon: {
		position: "absolute",
		right: 10,
		top: "50%",
		transform: [{ translateY: -12 }],
	},
})

export default PasswordInput

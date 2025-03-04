import React from "react"
import { TextInput, StyleSheet } from "react-native"

const PasswordInput: React.FC<{
	value: string
	onChangeText: (text: string) => void
	placeholder: string
}> = ({ value, onChangeText, placeholder }) => {
	return (
		<TextInput
			style={styles.input}
			placeholder={placeholder}
			placeholderTextColor="#999"
			secureTextEntry
			value={value}
			onChangeText={onChangeText}
		/>
	)
}

const styles = StyleSheet.create({
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
})

export default PasswordInput

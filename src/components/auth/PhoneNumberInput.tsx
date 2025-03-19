import React from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"

interface PhoneNumberInputProps {
	phoneNumber1: string
	setPhoneNumber1: React.Dispatch<React.SetStateAction<string>>
	phoneNumber2: string
	setPhoneNumber2: React.Dispatch<React.SetStateAction<string>>
	phoneNumber3: string
	setPhoneNumber3: React.Dispatch<React.SetStateAction<string>>
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
	phoneNumber1,
	setPhoneNumber1,
	phoneNumber2,
	setPhoneNumber2,
	phoneNumber3,
	setPhoneNumber3,
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>휴대폰 번호</Text>
			<View style={styles.phoneNumberContainer}>
				<TextInput
					style={styles.phoneInput}
					placeholder="010"
					placeholderTextColor="#999"
					keyboardType="numeric"
					maxLength={3}
					value={phoneNumber1}
					onChangeText={setPhoneNumber1}
				/>
				<TextInput
					style={styles.phoneInput}
					placeholder="1234"
					placeholderTextColor="#999"
					keyboardType="numeric"
					maxLength={4}
					value={phoneNumber2}
					onChangeText={setPhoneNumber2}
				/>
				<TextInput
					style={styles.phoneInput}
					placeholder="5678"
					placeholderTextColor="#999"
					keyboardType="numeric"
					maxLength={4}
					value={phoneNumber3}
					onChangeText={setPhoneNumber3}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	label: {
		fontSize: 16,
		color: "#333",
		marginBottom: 5,
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
		borderWidth: 1.5,
		borderColor: "#a0a0a0",
	},
})

export default PhoneNumberInput

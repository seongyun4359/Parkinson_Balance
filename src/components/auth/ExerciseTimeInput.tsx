import React from "react"
import { View, TextInput, Text, StyleSheet } from "react-native"

const ExerciseTimeInput: React.FC<{
	hour: string
	setHour: React.Dispatch<React.SetStateAction<string>>
	minute: string
	setMinute: React.Dispatch<React.SetStateAction<string>>
	second: string
	setSecond: React.Dispatch<React.SetStateAction<string>>
}> = ({ hour, setHour, minute, setMinute, second, setSecond }) => {
	const handleHourChange = (text: string) => {
		if (text === "") {
			setHour("")
			return
		}

		if (isNaN(Number(text))) {
			return
		}

		const value = parseInt(text)

		if (value >= 0 && value <= 23) {
			setHour(text)
		}
	}

	const handleMinuteChange = (text: string) => {
		if (text === "") {
			setMinute("")
			return
		}

		if (isNaN(Number(text))) {
			return
		}

		const value = parseInt(text)

		if (value >= 0 && value <= 59) {
			setMinute(text)
		}
	}

	const handleSecondChange = (text: string) => {
		if (text === "") {
			setSecond("")
			return
		}

		if (isNaN(Number(text))) {
			return
		}

		const value = parseInt(text)

		if (value >= 0 && value <= 59) {
			setSecond(text)
		}
	}

	return (
		<View style={styles.timeInputContainer}>
			<TextInput
				style={[styles.timeInput, styles.inputText]}
				placeholder="00-23"
				placeholderTextColor="#999"
				keyboardType="numeric"
				maxLength={2}
				value={hour}
				onChangeText={handleHourChange}
			/>
			<Text style={styles.colonText}>:</Text>
			<TextInput
				style={[styles.timeInput, styles.inputText]}
				placeholder="00-59"
				placeholderTextColor="#999"
				keyboardType="numeric"
				maxLength={2}
				value={minute}
				onChangeText={handleMinuteChange}
			/>
			<Text style={styles.colonText}>:</Text>
			<TextInput
				style={[styles.timeInput, styles.inputText]}
				placeholder="00-59"
				placeholderTextColor="#999"
				keyboardType="numeric"
				maxLength={2}
				value={second}
				onChangeText={handleSecondChange}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	timeInputContainer: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	timeInput: {
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
	inputText: {
		color: "#000",
	},
	colonText: {
		color: "#000",
		fontSize: 20,
		fontWeight: "bold",
	},
})

export default ExerciseTimeInput

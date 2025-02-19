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
	return (
		<View style={styles.timeInputContainer}>
			<TextInput
				style={styles.timeInput}
				placeholder="시"
				placeholderTextColor="#999"
				keyboardType="numeric"
				maxLength={2}
				value={hour}
				onChangeText={setHour}
			/>
			<Text>:</Text>
			<TextInput
				style={styles.timeInput}
				placeholder="분"
				placeholderTextColor="#999"
				keyboardType="numeric"
				maxLength={2}
				value={minute}
				onChangeText={setMinute}
			/>
			<Text>:</Text>
			<TextInput
				style={styles.timeInput}
				placeholder="초"
				placeholderTextColor="#999"
				keyboardType="numeric"
				maxLength={2}
				value={second}
				onChangeText={setSecond}
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
		borderWidth: 1,
		borderColor: "#808080",
	},
})

export default ExerciseTimeInput

import React from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"
import { Picker } from "@react-native-picker/picker"
interface NameGenderInputProps {
	name: string
	setName: React.Dispatch<React.SetStateAction<string>>
	gender: string
	setGender: React.Dispatch<React.SetStateAction<string>>
}

const NameGenderInput: React.FC<NameGenderInputProps> = ({
	name,
	setName,
	gender,
	setGender,
}) => {
	return (
		<View style={styles.container}>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>이름</Text>
				<TextInput
					style={styles.input}
					placeholder="이름"
					placeholderTextColor="#999"
					value={name}
					onChangeText={setName}
				/>
			</View>
			<View style={styles.inputContainer}>
				<Text style={styles.label}>성별</Text>
				<View style={styles.pickerContainer}>
					<Picker
						selectedValue={gender}
						onValueChange={setGender}
						style={styles.picker}
					>
						<Picker.Item label="남성" value="남성" />
						<Picker.Item label="여성" value="여성" />
					</Picker>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	inputContainer: {
		width: "48%",
	},
	label: {
		fontSize: 16,
		color: "#333",
		marginBottom: 5,
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
		borderWidth: 1,
		borderColor: "#808080",
	},
	pickerContainer: {
		width: "100%",
		height: 50,
		backgroundColor: "#fff",
		borderRadius: 10,
		justifyContent: "center",
		marginBottom: 15,
		elevation: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		borderWidth: 1,
		borderColor: "#808080",
	},
	picker: {
		width: "100%",
		height: "100%",
	},
})

export default NameGenderInput

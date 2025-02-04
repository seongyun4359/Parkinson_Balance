import React, { useState } from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import { PatientInfoType } from "../../../types/patient"

const mockPatient: PatientInfoType = {
	name: "홍길동",
	gender: "남자",
	phoneNumber: "010-1234-1234",
	password: "1234",
}

const EditInfoScreen: React.FC = () => {
	const navigation = useNavigation()
	const [patient, setPatient] = useState(mockPatient)
	const [passwordConfirm, setPasswordConfirm] = useState("")
	const [isEditing, setIsEditing] = useState(false) // 수정 모드 토글

	const isPasswordMatch = patient.password === passwordConfirm

	const handleSave = () => {
		setIsEditing(false)
		// 저장 로직 추가 가능
	}

	return (
		<View style={styles.container}>
			{/* 헤더 */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Ionicons name="arrow-back" size={24} color="black" />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>회원 정보 수정</Text>
			</View>

			{/* 입력 필드 */}
			<View style={styles.inputContainer}>
				<Text style={styles.label}>이름</Text>
				<TextInput
					style={styles.input}
					value={patient.name}
					onChangeText={(text) =>
						setPatient((prev) => ({ ...prev, name: text }))
					}
					editable={isEditing}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>성별</Text>
				<TextInput
					style={styles.input}
					value={patient.gender}
					onChangeText={(text) =>
						setPatient((prev) => ({ ...prev, gender: text }))
					}
					editable={isEditing}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>휴대폰 번호</Text>
				<TextInput
					style={styles.input}
					value={patient.phoneNumber}
					onChangeText={(text) =>
						setPatient((prev) => ({ ...prev, phoneNumber: text }))
					}
					editable={isEditing}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>비밀번호</Text>
				<TextInput
					style={styles.input}
					value={patient.password}
					onChangeText={(text) =>
						setPatient((prev) => ({ ...prev, password: text }))
					}
					secureTextEntry
					editable={isEditing}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.label}>비밀번호 확인</Text>
				<View style={styles.passwordBox}>
					<TextInput
						style={styles.input}
						value={passwordConfirm}
						onChangeText={setPasswordConfirm}
						secureTextEntry
						editable={isEditing}
					/>
					{passwordConfirm.length > 0 && (
						<Ionicons
							name={isPasswordMatch ? "checkmark-circle" : "alert-circle"}
							size={24}
							color={isPasswordMatch ? "green" : "red"}
						/>
					)}
				</View>
			</View>

			{/* 수정/완료 버튼 */}
			<TouchableOpacity
				style={[
					styles.editButton,
					!isPasswordMatch && isEditing && styles.disabled,
				]}
				onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
				disabled={isEditing && !isPasswordMatch} // 비밀번호 일치 안 하면 완료 비활성화
			>
				<Text style={styles.editButtonText}>{isEditing ? "완료" : "수정"}</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 20,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 10,
	},
	inputContainer: {
		marginBottom: 16,
	},
	label: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 4,
	},
	input: {
		backgroundColor: "#f9f9f9",
		borderRadius: 8,
		paddingHorizontal: 12,
		height: 50,
		borderWidth: 1,
		borderColor: "#ddd",
		fontSize: 16,
	},
	passwordBox: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f9f9f9",
		borderRadius: 8,
		paddingHorizontal: 12,
		height: 50,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	editButton: {
		backgroundColor: "#333",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
	},
	editButtonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 14,
	},
	disabled: {
		backgroundColor: "#aaa",
	},
})

export default EditInfoScreen

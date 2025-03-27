import React, { useState } from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Alert,
	ScrollView,
} from "react-native"
import { updateMember } from "../../../apis/member"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../../navigation/Root"

type EditInfoScreenProps = NativeStackScreenProps<RootStackParamList, "EditInfo">

const EditInfoScreen = ({ route, navigation }: EditInfoScreenProps) => {
	const { patientInfo } = route.params
	const [name, setName] = useState(patientInfo.name)
	const [phoneNumber, setPhoneNumber] = useState(patientInfo.phoneNumber)
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")

	const handleSave = async () => {
		try {
			if (!name.trim()) {
				Alert.alert("입력 오류", "이름을 입력해주세요.")
				return
			}

			if (!phoneNumber.trim()) {
				Alert.alert("입력 오류", "전화번호를 입력해주세요.")
				return
			}

			// 전화번호 형식 검증
			const phonePattern = /^010-\d{4}-\d{4}$/
			if (!phonePattern.test(phoneNumber)) {
				Alert.alert("입력 오류", "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)")
				return
			}

			if (password && password !== confirmPassword) {
				Alert.alert("비밀번호 오류", "비밀번호가 일치하지 않습니다.")
				return
			}

			// 변경된 데이터만 포함
			const updateData: any = {}
			if (name !== patientInfo.name) {
				updateData.name = name
			}
			if (phoneNumber !== patientInfo.phoneNumber) {
				updateData.phoneNumber = phoneNumber
			}
			if (password) {
				updateData.password = password
			}

			// 변경된 내용이 없는 경우
			if (Object.keys(updateData).length === 0) {
				Alert.alert("알림", "변경된 내용이 없습니다.")
				return
			}

			await updateMember(patientInfo.phoneNumber, updateData)
			Alert.alert("수정 완료", "환자 정보가 수정되었습니다.", [
				{
					text: "확인",
					onPress: () => {
						// 수정된 정보로 이전 화면들 업데이트
						navigation.navigate("PatientDetail", {
							patient: {
								...patientInfo,
								name: name,
								phoneNumber: phoneNumber,
							},
						})
					},
				},
			])
		} catch (error: any) {
			console.error("수정 오류:", error)
			if (error.message?.includes("이미 사용 중")) {
				Alert.alert("수정 실패", "해당 전화번호는 이미 다른 사용자가 사용 중입니다.")
			} else {
				Alert.alert("수정 실패", error.message || "환자 정보 수정 중 오류가 발생했습니다.")
			}
		}
	}

	const formatPhoneNumber = (text: string) => {
		// 숫자만 추출
		const numbers = text.replace(/[^\d]/g, "")
		// 형식에 맞게 변환
		if (numbers.length <= 3) {
			return numbers
		} else if (numbers.length <= 7) {
			return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
		} else {
			return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
		}
	}

	const handlePhoneNumberChange = (text: string) => {
		const formattedNumber = formatPhoneNumber(text)
		setPhoneNumber(formattedNumber)
	}

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.title}>환자 정보 수정</Text>

			<Text style={styles.label}>이름</Text>
			<TextInput
				style={styles.input}
				value={name}
				onChangeText={setName}
				placeholder="이름을 입력하세요"
			/>

			<Text style={styles.label}>전화번호</Text>
			<TextInput
				style={styles.input}
				value={phoneNumber}
				onChangeText={handlePhoneNumberChange}
				placeholder="010-0000-0000"
				keyboardType="phone-pad"
				maxLength={13}
			/>

			<Text style={styles.label}>새 비밀번호 (선택)</Text>
			<TextInput
				style={styles.input}
				value={password}
				onChangeText={setPassword}
				placeholder="새 비밀번호를 입력하세요"
				secureTextEntry
			/>

			<Text style={styles.label}>비밀번호 확인</Text>
			<TextInput
				style={styles.input}
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				placeholder="비밀번호를 다시 입력하세요"
				secureTextEntry
			/>

			<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
				<Text style={styles.saveButtonText}>저장</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
				<Text style={styles.cancelButtonText}>취소</Text>
			</TouchableOpacity>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#f8f8f8",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#333",
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		color: "#333",
	},
	input: {
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	saveButton: {
		backgroundColor: "#76DABF",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
	},
	saveButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	cancelButton: {
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 12,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	cancelButtonText: {
		color: "#333",
		fontSize: 16,
	},
})

export default EditInfoScreen

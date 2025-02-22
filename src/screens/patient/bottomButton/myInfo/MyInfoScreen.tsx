import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import PatientInfoCard from "../../../../components/patient/my-info/PatientInfo"
import { searchPatientByName } from "../../../../mock/mock"
import { useNavigation } from "@react-navigation/native"
import { SearchScreenNavigationProp } from "../../../../types/navigation"
import { PatientInfoType } from "../../../../types/patient"

const MyInfoScreen: React.FC = () => {
	const navigation = useNavigation<SearchScreenNavigationProp>()
	const [patientInfo, setPatientInfo] = useState<PatientInfoType | null>(null)

	useEffect(() => {
		const result = searchPatientByName("홍길동")
		if (result) {
			setPatientInfo(result)
		} else {
			Alert.alert("검색 실패", "홍길동 환자 정보를 찾을 수 없습니다.")
		}
	}, [])

	const handleEditPress = () => {
		if (patientInfo) {
			navigation.navigate("EditInfo", { patientInfo })
		}
	}

	const handlePrescriptionPress = () => {
		if (patientInfo) {
			navigation.navigate("Prescription", { patientInfo })
		}
	}

	const handleLogout = () => {
		Alert.alert(
			"로그아웃",
			"로그아웃 하시겠습니까?",
			[
				{
					text: "취소",
					style: "cancel",
				},
				{
					text: "네",
					onPress: async () => {
						try {
							// 토큰 제거
							await AsyncStorage.removeItem("authToken")
							// 홈 화면으로 이동
							navigation.reset({
								index: 0,
								routes: [{ name: "Login" }],
							})
						} catch (error) {
							console.error("로그아웃 실패:", error)
							Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.")
						}
					},
				},
			],
			{ cancelable: false }
		)
	}

	return (
		<View style={styles.container}>
			{patientInfo ? (
				<PatientInfoCard patientInfo={patientInfo} onPrescriptionPress={handlePrescriptionPress} />
			) : (
				<View style={styles.placeholderContainer}>
					<Ionicons name="search" size={48} color="#ddd" />
					<Text style={styles.placeholderText}>환자 정보를 찾을 수 없습니다.</Text>
				</View>
			)}

			<View style={styles.footerButtons}>
				<TouchableOpacity style={[styles.footerButton, styles.notificationButton]} onPress={handleLogout}>
					<Ionicons name="log-out-outline" size={24} color="#fff" />
					<Text style={styles.footerButtonText}>로그아웃</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.footerButton, styles.editButton]} onPress={handleEditPress}>
					<Ionicons name="create-outline" size={24} color="#fff" />
					<Text style={styles.footerButtonText}>정보 수정</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f8f8",
		padding: 16,
	},
	placeholderContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
	placeholderText: {
		color: "#aaa",
		fontSize: 16,
	},
	footerButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
		marginTop: "auto",
		paddingVertical: 16,
	},
	footerButton: {
		flex: 1,
		flexDirection: "row",
		height: 56,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 12,
		gap: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	notificationButton: {
		backgroundColor: "#76DABF",
	},
	editButton: {
		backgroundColor: "#333",
	},
	footerButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
})

export default MyInfoScreen

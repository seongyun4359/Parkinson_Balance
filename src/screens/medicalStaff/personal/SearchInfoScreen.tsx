import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import SearchBar from "../../../components/medicalStaff/SearchBar"
import PatientInfoCard from "../../../components/medicalStaff/PatientInfo"
import { searchMemberByName } from "../../../apis/member"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { SearchScreenNavigationProp, RootStackParamList } from "../../../types/navigation"
import { PatientInfoType } from "../../../types/patient"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SearchInfoScreen: React.FC = () => {
	const navigation = useNavigation<SearchScreenNavigationProp>()
	const [searchQuery, setSearchQuery] = useState("")
	const [patientInfo, setPatientInfo] = useState<PatientInfoType | null>(null)

	const handleSearch = async () => {
		try {
			if (!searchQuery.trim()) {
				Alert.alert("검색 오류", "환자 이름을 입력해주세요.")
				return
			}

			const response = await searchMemberByName(searchQuery)

			if (response.status === "SUCCESS" && response.data.length > 0) {
				const member = response.data[0]
				const patientData: PatientInfoType = {
					memberId: member.memberId,
					name: member.name,
					phoneNumber: member.phoneNumber,
					gender: member.gender,
					// 다른 필요한 필드들도 설정
				}
				setPatientInfo(patientData)
			} else {
				Alert.alert("검색 실패", "해당 환자를 찾을 수 없습니다.")
				setPatientInfo(null)
			}
		} catch (error) {
			console.error("API 오류:", error)
			Alert.alert("오류", "환자 정보 검색 중 오류가 발생했습니다.")
			setPatientInfo(null)
		}
	}

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

	return (
		<View style={styles.container}>
			<SearchBar value={searchQuery} onChangeText={setSearchQuery} onSearch={handleSearch} />

			{patientInfo ? (
				<PatientInfoCard patientInfo={patientInfo} onPrescriptionPress={handlePrescriptionPress} />
			) : (
				<View style={styles.placeholderContainer}>
					<Ionicons name="search" size={48} color="#ddd" />
					<Text style={styles.placeholderText}>환자 정보를 검색하세요.</Text>
				</View>
			)}

			<View style={styles.footerButtons}>
				<TouchableOpacity style={[styles.footerButton, styles.notificationButton]}>
					<Ionicons name="notifications-outline" size={24} color="#fff" />
					<Text style={styles.footerButtonText}>알림 전송</Text>
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

export default SearchInfoScreen

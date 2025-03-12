import React, { useState, useEffect, useCallback } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import SearchBar from "../../../components/medicalStaff/SearchBar"
import PatientInfoCard from "../../../components/medicalStaff/PatientInfo"
import { searchMemberByPhone } from "../../../apis/member"
import { useNavigation, CommonActions } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { SearchScreenNavigationProp, RootStackParamList } from "../../../types/navigation"
import { PatientInfoType } from "../../../types/patient"
import AsyncStorage from "@react-native-async-storage/async-storage"

const SearchInfoScreen: React.FC = () => {
	const navigation = useNavigation<SearchScreenNavigationProp>()
	const [searchQuery, setSearchQuery] = useState("")
	const [patientInfo, setPatientInfo] = useState<PatientInfoType | null>(null)
	const [isProcessingAuth, setIsProcessingAuth] = useState(false)

	const resetToAuth = useCallback(() => {
		navigation.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [{ name: "MedicalStaffAuth" }],
			})
		)
	}, [navigation])

	const handleTokenError = useCallback(async () => {
		if (isProcessingAuth) return

		try {
			setIsProcessingAuth(true)
			const refreshToken = await AsyncStorage.getItem("refreshToken")

			if (!refreshToken) {
				throw new Error("리프레시 토큰이 없습니다.")
			}

			// 리프레시 토큰으로 새 토큰 발급 시도
			const response = await fetch("https://kwhcclab.com:20955/api/refresh", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${refreshToken}`,
					"Content-Type": "application/json",
				},
			})

			const data = await response.json()

			if (data.status === "SUCCESS" && data.data[0].accessToken) {
				// 새 토큰 저장
				await AsyncStorage.setItem("accessToken", data.data[0].accessToken)
				if (data.data[0].refreshToken !== "cookie") {
					await AsyncStorage.setItem("refreshToken", data.data[0].refreshToken)
				}
				return true // 토큰 갱신 성공
			} else {
				throw new Error("토큰 갱신 실패")
			}
		} catch (error) {
			console.error("토큰 갱신 중 오류:", error)
			await AsyncStorage.multiRemove(["accessToken", "refreshToken"])
			Alert.alert("세션 만료", "로그인이 만료되었습니다. 다시 로그인해주세요.", [
				{
					text: "확인",
					onPress: resetToAuth,
				},
			])
			return false
		} finally {
			setIsProcessingAuth(false)
		}
	}, [resetToAuth, isProcessingAuth])

	useEffect(() => {
		let isMounted = true

		const checkToken = async () => {
			try {
				const [accessToken, refreshToken] = await Promise.all([AsyncStorage.getItem("accessToken"), AsyncStorage.getItem("refreshToken")])

				if (!accessToken || !refreshToken) {
					if (isMounted) {
						handleTokenError()
					}
				}
			} catch (error) {
				console.error("토큰 확인 중 오류:", error)
				if (isMounted) {
					handleTokenError()
				}
			}
		}

		checkToken()

		const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
			return true
		})

		return () => {
			isMounted = false
			backHandler.remove()
		}
	}, [handleTokenError])

	const handleSearch = async () => {
		try {
			if (!searchQuery.trim()) {
				Alert.alert("검색 오류", "환자 전화번호를 입력해주세요.")
				return
			}

			const accessToken = await AsyncStorage.getItem("accessToken")
			if (!accessToken) {
				const tokenRefreshed = await handleTokenError()
				if (!tokenRefreshed) return
			}

			const response = await searchMemberByPhone(searchQuery)

			if (response.status === "SUCCESS" && response.data.length > 0) {
				const member = response.data[0]
				const patientData: PatientInfoType = {
					memberId: member.memberId,
					name: member.name,
					phoneNumber: member.phoneNumber,
					gender: member.gender,
				}
				setPatientInfo(patientData)
			} else {
				setPatientInfo(null)
				Alert.alert("검색 결과 없음", "해당 전화번호로 등록된 환자가 없습니다.")
			}
		} catch (error: any) {
			console.error("API 오류:", error)
			setPatientInfo(null)

			if (error.message?.includes("토큰")) {
				const tokenRefreshed = await handleTokenError()
				if (tokenRefreshed) {
					// 토큰 갱신 성공시 검색 재시도
					handleSearch()
				}
			} else if (error.message?.includes("존재하지 않는 회원")) {
				Alert.alert("검색 결과 없음", "해당 전화번호로 등록된 환자가 없습니다.")
			} else {
				Alert.alert("검색 오류", "환자 정보 검색 중 오류가 발생했습니다.")
			}
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

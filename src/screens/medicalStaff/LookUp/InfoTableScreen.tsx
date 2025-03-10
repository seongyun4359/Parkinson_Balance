import React, { useState, useEffect } from "react"
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../../../types/navigation"
import PatientTable from "../../../components/medicalStaff/table/PatientTable"
import SearchFilterBar from "../../../components/medicalStaff/SearchFilterBar"
import Pagination from "../../../components/medicalStaff/Pagination"
import { Patient, SortConfig, FilterConfig } from "../../../types/patient"

const API_URL = "https://kwhcclab.com:20955/api/members"
const REFRESH_URL = "https://kwhcclab.com:20955/api/auth/refresh"
let AUTH_TOKEN = "eyJhbGciOiJIUzI1NiJ9..." // 최신 토큰

// ✅ API 요청 함수 (토큰 만료 시 자동 갱신 후 재요청)
const fetchWithToken = async (url: string, options: RequestInit = {}) => {
	try {
		let response = await fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${AUTH_TOKEN}`,
				"Content-Type": "application/json",
			},
		})

		// 401 Unauthorized → 토큰 만료 시 새 토큰 요청 후 재요청
		if (response.status === 401) {
			console.warn("토큰 만료됨. 새 토큰 요청 중...")
			const newToken = await refreshToken()

			if (newToken) {
				AUTH_TOKEN = newToken
				response = await fetch(url, {
					...options,
					headers: {
						...options.headers,
						Authorization: `Bearer ${AUTH_TOKEN}`,
						"Content-Type": "application/json",
					},
				})
			} else {
				throw new Error("토큰 갱신 실패")
			}
		}

		return response
	} catch (error) {
		console.error("API 요청 중 오류 발생:", error)
		throw error
	}
}
// ✅ 토큰 갱신 함수 수정 (갱신 실패 시 로그아웃)
const refreshToken = async () => {
	try {
		const response = await fetch(REFRESH_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${AUTH_TOKEN}`,
				"Content-Type": "application/json",
			},
		})

		if (!response.ok) {
			console.error("토큰 갱신 실패:", response.status)
			handleLogout() // 갱신 실패 시 로그아웃 처리
			return null
		}

		const data = await response.json()
		const newToken = data?.token

		if (newToken) {
			console.log("새로운 토큰 발급 완료:", newToken)
			return newToken
		} else {
			console.error("응답에 토큰 없음")
			handleLogout() // 응답에 토큰이 없을 경우 로그아웃 처리
			return null
		}
	} catch (error) {
		console.error("토큰 갱신 요청 중 오류:", error)
		handleLogout() // 오류 발생 시 로그아웃 처리
		return null
	}
}

// ✅ 로그아웃 처리 함수
const handleLogout = () => {
	// 예시: 토큰 삭제 후 로그인 화면으로 리다이렉트
	AUTH_TOKEN = "" // 토큰 삭제
	Alert.alert("알림", "세션이 만료되었습니다. 다시 로그인 해주세요.")
	// 네비게이션을 통해 로그인 화면으로 이동
	navigation.replace("Login")
}

export const InfoTableScreen = () => {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
	const [patients, setPatients] = useState<Patient[]>([])
	const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set())
	const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([])
	const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([])
	const [currentPage, setCurrentPage] = useState(0)
	const [totalPages, setTotalPages] = useState(1)

	// ✅ 환자 데이터 가져오기 (토큰 자동 갱신 포함)
	const fetchPatients = async (page = 0) => {
		try {
			const response = await fetchWithToken(`${API_URL}?page=${page}&size=10&sort=lastLoginAt,desc`)
			const result = await response.json()

			if (result.status === "SUCCESS") {
				const formattedPatients: Patient[] = result.data.content.map((item: any) => ({
					id: item.memberId,
					name: item.name,
					phoneNumber: item.phoneNumber,
					gender: item.gender,
					lastLogin: item.lastLoginAt,
					isFavorite: false, // 기본값 설정
					exerciseScore: 0, // 기본값 설정
				}))

				setPatients(formattedPatients)
				setTotalPages(result.data.totalPages)
			} else {
				console.error("Error fetching data:", result.error)
			}
		} catch (error) {
			console.error("API fetch error:", error)
		}
	}

	// ✅ 마운트 시 데이터 로드
	useEffect(() => {
		fetchPatients(currentPage)
	}, [])

	const handlePageChange = (newPage: number) => {
		if (newPage >= 0 && newPage < totalPages) {
			setCurrentPage(newPage)
			fetchPatients(newPage) // ✅ 페이지 변경 시 데이터 다시 로드
		}
	}

	return (
		<View style={styles.container}>
			<View>
				<SearchFilterBar onFiltersChange={setFilterConfigs} filters={filterConfigs} />
			</View>

			<PatientTable
				data={patients}
				selectedPatients={selectedPatients}
				sortConfigs={sortConfigs}
				onToggleSelect={(id) => {
					setSelectedPatients((prev) => {
						const newSelected = new Set(prev)
						newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id)
						return newSelected
					})
				}}
				onToggleSelectAll={() => {
					setSelectedPatients(new Set(patients.map((p) => p.id)))
				}}
				onToggleFavorite={function (id: string): void {
					throw new Error("Function not implemented.")
				}}
				onToggleSort={function (key: keyof Patient): void {
					throw new Error("Function not implemented.")
				}}
			/>

			<View>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
					hasNextPage={currentPage < totalPages - 1}
					onPrevPage={() => handlePageChange(currentPage - 1)}
					onNextPage={() => handlePageChange(currentPage + 1)}
				/>

				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[styles.button, selectedPatients.size === 0 && styles.buttonDisabled]}
						onPress={() => {
							if (selectedPatients.size === 0) {
								Alert.alert("알림", "조회할 환자를 선택하세요.")
								return
							}
							navigation.navigate("DetailTable", {
								patientIds: Array.from(selectedPatients),
							})
						}}
						disabled={selectedPatients.size === 0}
					>
						<Text style={styles.buttonText}>{`${selectedPatients.size}명 조회`}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.button, selectedPatients.size === 0 && styles.buttonDisabled, { backgroundColor: "#FF9800" }]}
						onPress={() => {
							if (selectedPatients.size === 0) {
								Alert.alert("알림", "알림을 전송할 환자를 선택하세요.")
								return
							}
							Alert.alert("알림 전송", `${selectedPatients.size}명에게 알림을 전송했습니다.`)
						}}
						disabled={selectedPatients.size === 0}
					>
						<Text style={styles.buttonText}>{`${selectedPatients.size}명 알림`}</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f9f9f9",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginTop: 10,
	},
	button: {
		backgroundColor: "#4CAF50",
		padding: 12,
		borderRadius: 12,
		minWidth: 120,
		alignItems: "center",
		elevation: 3,
		marginTop: 10,
	},
	buttonDisabled: {
		backgroundColor: "#D3D3D3",
	},
	buttonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
	},
})

export default InfoTableScreen

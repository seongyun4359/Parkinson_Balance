import React, { useState, useEffect, useCallback } from "react"
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../../../types/navigation"
import PatientTable from "../../../components/medicalStaff/table/PatientTable"
import SearchFilterBar from "../../../components/medicalStaff/SearchFilterBar"
import { Patient, SortConfig, FilterConfig } from "../../../types/patient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { addBookmark, removeBookmark, getBookmarks } from "../../../apis/bookmark"

const API_URL = "https://kwhcclab.com:20955/api/members"
const REFRESH_URL = "https://kwhcclab.com:20955/api/auth/refresh"
let AUTH_TOKEN = ""

// ✅ API 요청 함수 (토큰 만료 시 자동 갱신 후 재요청)
const fetchWithToken = async (url: string, options: RequestInit = {}, handleLogout: () => void) => {
	try {
		// 토큰이 없으면 저장된 토큰 가져오기
		if (!AUTH_TOKEN) {
			AUTH_TOKEN = (await AsyncStorage.getItem("accessToken")) || ""
			if (!AUTH_TOKEN) {
				handleLogout()
				throw new Error("토큰이 없습니다.")
			}
		}

		let response = await fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${AUTH_TOKEN}`,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})

		// 401 Unauthorized → 토큰 만료 시 새 토큰 요청 후 재요청
		if (response.status === 401) {
			console.warn("토큰 만료됨. 새 토큰 요청 중...")
			const refreshToken = await AsyncStorage.getItem("refreshToken")

			if (!refreshToken) {
				handleLogout()
				throw new Error("리프레시 토큰이 없습니다.")
			}

			const newToken = await refreshTokenRequest(refreshToken)
			if (!newToken) {
				handleLogout()
				throw new Error("토큰 갱신에 실패했습니다.")
			}

			AUTH_TOKEN = newToken
			await AsyncStorage.setItem("accessToken", newToken)

			// 새 토큰으로 원래 요청 재시도
			response = await fetch(url, {
				...options,
				headers: {
					...options.headers,
					Authorization: `Bearer ${newToken}`,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			})
		}

		return response
	} catch (error) {
		console.error("API 요청 중 오류 발생:", error)
		throw error
	}
}

// ✅ 토큰 갱신 요청 함수
const refreshTokenRequest = async (refreshToken: string): Promise<string | null> => {
	try {
		const response = await fetch(REFRESH_URL, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${refreshToken}`,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})

		if (!response.ok) {
			console.error("토큰 갱신 실패:", response.status)
			return null
		}

		const text = await response.text()
		if (!text) {
			console.error("토큰 갱신 응답이 비어있습니다.")
			return null
		}

		try {
			const data = JSON.parse(text)
			const newToken = data?.data?.[0]?.accessToken
			if (newToken) {
				console.log("새로운 토큰 발급 완료")
				return newToken
			}
		} catch (error) {
			console.error("토큰 갱신 응답 파싱 실패:", error)
		}
		return null
	} catch (error) {
		console.error("토큰 갱신 요청 중 오류:", error)
		return null
	}
}

export const InfoTableScreen = () => {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
	const [patients, setPatients] = useState<Patient[]>([])
	const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
	const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set())
	const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([])
	const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([])
	const [searchQuery, setSearchQuery] = useState("")
	const [currentPage, setCurrentPage] = useState(0)
	const [totalPages, setTotalPages] = useState(1)
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
	const [showRecentLoginOnly, setShowRecentLoginOnly] = useState(false)

	// ✅ 로그아웃 처리 함수
	const handleLogout = async () => {
		try {
			await AsyncStorage.multiRemove(["accessToken", "refreshToken"])
			AUTH_TOKEN = ""
			Alert.alert("알림", "세션이 만료되었습니다. 다시 로그인 해주세요.")
			navigation.reset({
				index: 0,
				routes: [{ name: "MedicalStaffAuth" }],
			})
		} catch (error) {
			console.error("로그아웃 처리 중 오류:", error)
		}
	}

	// 정렬 토글 함수 추가
	const onToggleSort = useCallback((key: keyof Patient) => {
		setSortConfigs((prevConfigs) => {
			const existingConfig = prevConfigs.find((config) => config.key === key)
			if (existingConfig) {
				// 이미 존재하는 정렬 설정이면 방향을 변경하거나 제거
				if (existingConfig.direction === "asc") {
					existingConfig.direction = "desc"
					return [...prevConfigs]
				} else {
					return prevConfigs.filter((config) => config.key !== key)
				}
			} else {
				// 새로운 정렬 설정 추가
				return [...prevConfigs, { key, direction: "asc" }]
			}
		})
	}, [])

	// 정렬 적용 함수
	const applySorting = useCallback(
		(patients: Patient[]) => {
			let sortedPatients = [...patients]
			sortConfigs.forEach((config) => {
				sortedPatients.sort((a, b) => {
					const aValue = a[config.key]
					const bValue = b[config.key]

					if (typeof aValue === "string" && typeof bValue === "string") {
						return config.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
					}

					if (aValue instanceof Date && bValue instanceof Date) {
						return config.direction === "asc" ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime()
					}

					return 0
				})
			})
			return sortedPatients
		},
		[sortConfigs]
	)

	// 필터 적용 함수 수정
	const applyFilters = useCallback(() => {
		let result = [...patients]

		// 검색어 필터링
		if (searchQuery) {
			result = result.filter((patient) => patient.name.toLowerCase().includes(searchQuery.toLowerCase()))
		}

		// 즐겨찾기 필터링
		if (showFavoritesOnly) {
			result = result.filter((patient) => patient.isFavorite)
		}

		// 최근 로그인 필터링 (24시간 이내)
		if (showRecentLoginOnly) {
			const oneDayAgo = new Date()
			oneDayAgo.setDate(oneDayAgo.getDate() - 1)
			result = result.filter((patient) => {
				const loginDate = new Date(patient.lastLogin)
				return loginDate > oneDayAgo
			})
		}

		// 정렬 적용
		result = applySorting(result)

		setFilteredPatients(result)
	}, [patients, searchQuery, showFavoritesOnly, showRecentLoginOnly, applySorting])

	// ✅ 필터 변경 처리
	const handleFiltersChange = useCallback((newFilters: FilterConfig[]) => {
		setFilterConfigs(newFilters)
		setShowFavoritesOnly(newFilters.some((filter) => filter.type === "favorite"))
		setShowRecentLoginOnly(newFilters.some((filter) => filter.type === "recentLogin"))
	}, [])

	// ✅ 검색어 변경 처리
	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query)
	}, [])

	// ✅ 즐겨찾기 토글 처리 수정
	const handleToggleFavorite = useCallback(
		async (id: string) => {
			try {
				const patient = patients.find((p) => p.id === id)
				if (!patient) return

				if (patient.isFavorite) {
					await removeBookmark(id)
					setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: false } : p)))
				} else {
					try {
						await addBookmark(id)
						setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: true } : p)))
					} catch (error: any) {
						if (error.message.includes("이미 북마크한 회원입니다")) {
							// 이미 즐겨찾기된 상태라면 UI를 업데이트
							setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, isFavorite: true } : p)))
						} else {
							throw error
						}
					}
				}
			} catch (error: any) {
				console.error("즐겨찾기 토글 오류:", error)
				Alert.alert("오류", error.message)
			}
		},
		[patients]
	)

	// ✅ 필터 변경시 자동 적용
	useEffect(() => {
		applyFilters()
	}, [applyFilters, patients, searchQuery, showFavoritesOnly, showRecentLoginOnly])

	// ✅ 환자 데이터 가져오기 (토큰 자동 갱신 포함)
	const fetchPatients = async (page = 0) => {
		try {
			// 환자 목록 가져오기
			const response = await fetchWithToken(`${API_URL}?page=${page}&size=10&sort=lastLoginAt,desc`, {}, handleLogout)

			if (!response.ok) {
				throw new Error(`서버 응답 오류: ${response.status}`)
			}

			const text = await response.text()
			if (!text) {
				throw new Error("서버로부터 빈 응답을 받았습니다.")
			}

			let result
			try {
				result = JSON.parse(text)
			} catch (parseError) {
				console.error("JSON 파싱 오류:", parseError)
				console.error("받은 데이터:", text)
				throw new Error("서버 응답을 파싱할 수 없습니다.")
			}

			// 즐겨찾기 목록 가져오기
			let bookmarkedMembers: string[] = []
			try {
				const bookmarks = await getBookmarks()
				bookmarkedMembers = bookmarks.map((bookmark: any) => bookmark.memberId)
				console.log("즐겨찾기된 회원 ID:", bookmarkedMembers)
			} catch (error) {
				console.error("즐겨찾기 목록 조회 실패:", error)
			}

			if (result.status === "SUCCESS" && result.data?.content) {
				const formattedPatients: Patient[] = result.data.content.map((item: any) => ({
					id: item.memberId,
					name: item.name,
					phoneNumber: item.phoneNumber,
					gender: item.gender,
					lastLogin: item.lastLoginAt,
					isFavorite: bookmarkedMembers.includes(item.memberId),
					exerciseScore: 0,
				}))

				console.log("환자 목록 처리 결과:", {
					total: formattedPatients.length,
					bookmarked: formattedPatients.filter((p) => p.isFavorite).length,
				})

				setPatients(formattedPatients)
				setFilteredPatients(formattedPatients)
				setTotalPages(result.data.totalPages || 1)
			} else {
				console.error("서버 응답 형식 오류:", result)
				throw new Error(result.error || "데이터를 불러오는데 실패했습니다.")
			}
		} catch (error: any) {
			console.error("API fetch error:", error)
			Alert.alert("데이터 로딩 오류", error.message || "환자 정보를 불러오는데 실패했습니다.")
			setPatients([])
			setFilteredPatients([])
			setTotalPages(1)
		}
	}

	useEffect(() => {
		fetchPatients(currentPage)
	}, [])

	const handlePageChange = (newPage: number) => {
		if (newPage >= 0 && newPage < totalPages) {
			setCurrentPage(newPage)
			fetchPatients(newPage)
		}
	}

	const handleNamePress = (patient: Patient) => {
		navigation.navigate("PatientDetail", { patient })
	}

	return (
		<View style={styles.container}>
			<SearchFilterBar
				searchValue={searchQuery}
				onSearchChange={handleSearchChange}
				filters={filterConfigs}
				onFiltersChange={handleFiltersChange}
				renderExtraButton={() => (
					<TouchableOpacity
						style={[styles.notificationButton, selectedPatients.size === 0 && styles.buttonDisabled]}
						onPress={() => {
							if (selectedPatients.size === 0) {
								Alert.alert("알림", "알림을 전송할 환자를 선택하세요.")
								return
							}
							Alert.alert("알림 전송", `${selectedPatients.size}명에게 알림을 전송했습니다.`)
						}}
						disabled={selectedPatients.size === 0}
					>
						<Text style={styles.notificationButtonText}>{`${selectedPatients.size}명 알림`}</Text>
					</TouchableOpacity>
				)}
			/>

			<View style={styles.tableContainer}>
				<PatientTable
					data={filteredPatients}
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
						setSelectedPatients(new Set(filteredPatients.map((p) => p.id)))
					}}
					onToggleFavorite={handleToggleFavorite}
					onToggleSort={onToggleSort}
					onNamePress={handleNamePress}
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f9f9f9",
		padding: 16,
	},
	notificationButton: {
		backgroundColor: "#FF9800",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		elevation: 2,
		marginLeft: 8,
	},
	notificationButtonText: {
		color: "#fff",
		fontSize: 12,
		fontWeight: "bold",
	},
	tableContainer: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 12,
		marginTop: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	footer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	buttonDisabled: {
		backgroundColor: "#D3D3D3",
	},
})

export default InfoTableScreen

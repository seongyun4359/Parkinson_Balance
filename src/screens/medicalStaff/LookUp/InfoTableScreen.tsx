import React, { useState, useEffect } from "react"
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../../../types/navigation"
import PatientTable from "../../../components/medicalStaff/table/PatientTable"
import SearchFilterBar from "../../../components/medicalStaff/SearchFilterBar"
import Pagination from "../../../components/medicalStaff/Pagination"
import { patientMockData } from "../../../mock/patientMock"
import { Patient, SortConfig, FilterConfig } from "../../../types/patient"

const ITEMS_PER_PAGE = 10

export const InfoTableScreen = () => {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
	const [patients, setPatients] = useState<Patient[]>(patientMockData)
	const [selectedPatients, setSelectedPatients] = useState<Set<string>>(
		new Set()
	)
	const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([])
	const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		setCurrentPage(1)
		const filteredData = getFilteredData()
		setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE))
	}, [filterConfigs])

	const getFilteredData = () => {
		let filtered = [...patients]

		// 최근 로그인 필터 적용
		const loginFilter = filterConfigs.find((f) => f.key === "lastLogin")
		if (loginFilter) {
			const daysAgo = parseInt(
				String(loginFilter.value).replace("일 이내", ""),
				10
			)
			const cutoffDate = new Date()
			cutoffDate.setDate(cutoffDate.getDate() - daysAgo)
			filtered = filtered.filter((p) => new Date(p.lastLogin) >= cutoffDate)
		}

		// 운동 수행 점수 필터 적용
		const scoreFilter = filterConfigs.find((f) => f.key === "exerciseScore")
		if (scoreFilter) {
			filtered.sort((a, b) =>
				scoreFilter.value === "높은 점수 순"
					? b.exerciseScore - a.exerciseScore
					: a.exerciseScore - b.exerciseScore
			)
		}

		// 즐겨찾기 필터 적용
		const favoriteFilter = filterConfigs.find((f) => f.key === "isFavorite")
		if (favoriteFilter) {
			filtered = filtered.filter((p) => p.isFavorite)
		}

		return filtered
	}

	const getCurrentPageData = () => {
		const filtered = getFilteredData()
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
		return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)
	}

	const handleToggleSort = (key: keyof Patient) => {
		const existingSort = sortConfigs.find((sort) => sort.key === key)
		if (!existingSort) {
			setSortConfigs([{ key, direction: "asc" }])
		} else {
			setSortConfigs(
				existingSort.direction === "asc" ? [{ key, direction: "desc" }] : []
			)
		}
	}

	const handleToggleFavorite = (patientId: string) => {
		setPatients(
			patients.map((patient) =>
				patient.id === patientId
					? { ...patient, isFavorite: !patient.isFavorite }
					: patient
			)
		)
	}

	// ✅ 안정성 강화 - Navigation 오류 방지
	const handleViewDetails = () => {
		try {
			if (selectedPatients.size === 0) {
				Alert.alert("알림", "조회할 환자를 선택하세요.")
				return
			}
			const selectedPatientIds = Array.from(selectedPatients)
			navigation.navigate("DetailTable", { patientIds: selectedPatientIds })
		} catch (error) {
			console.error("Navigation Error:", error)
			Alert.alert("오류", "환자 정보를 조회하는 중 문제가 발생했습니다.")
		}
	}

	return (
		<View style={styles.container}>
			<View>
				<SearchFilterBar
					onFiltersChange={setFilterConfigs}
					filters={filterConfigs}
				/>
			</View>

			<PatientTable
				data={getCurrentPageData()}
				selectedPatients={selectedPatients}
				sortConfigs={sortConfigs}
				onToggleSelect={(id) => {
					setSelectedPatients((prev) => {
						const newSelected = new Set(prev)
						if (newSelected.has(id)) {
							newSelected.delete(id)
						} else {
							newSelected.add(id)
						}
						return newSelected
					})
				}}
				onToggleSelectAll={() => {
					const currentData = getCurrentPageData()
					setSelectedPatients((prev) =>
						prev.size === currentData.length
							? new Set()
							: new Set(currentData.map((p) => p.id))
					)
				}}
				onToggleFavorite={handleToggleFavorite}
				onToggleSort={handleToggleSort}
			/>

			<View>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					hasNextPage={false}
					onPrevPage={function (): void {
						throw new Error("기능이 구현되지 않았습니다.")
					}}
					onNextPage={function (): void {
						throw new Error("F기능이 구현되지 않았습니다.")
					}}
				/>

				<TouchableOpacity
					style={[
						styles.button,
						selectedPatients.size === 0 && styles.buttonDisabled,
					]}
					onPress={handleViewDetails}
					disabled={selectedPatients.size === 0}
					activeOpacity={0.7}
				>
					<Text
						style={styles.buttonText}
					>{`${selectedPatients.size}명 조회`}</Text>
				</TouchableOpacity>
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

	button: {
		backgroundColor: "#4CAF50",
		padding: 12,
		borderRadius: 12,
		minWidth: 120,
		alignItems: "center",
		elevation: 3,
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

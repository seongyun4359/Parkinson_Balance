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

		const scoreFilter = filterConfigs.find((f) => f.key === "exerciseScore")
		if (scoreFilter) {
			filtered.sort((a, b) =>
				scoreFilter.value === "높은 점수 순"
					? b.exerciseScore - a.exerciseScore
					: a.exerciseScore - b.exerciseScore
			)
		}

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

	// 단체 알림 전송 함수
	const handleSendGroupNotification = () => {
		if (selectedPatients.size === 0) {
			Alert.alert("알림", "알림을 전송할 환자를 선택하세요.")
			return
		}

		const selectedPatientIds = Array.from(selectedPatients)
		console.log("단체 알림 전송 대상 환자들: ", selectedPatientIds)

		// 여기서 단체 알림 전송 API나 로직을 호출
		Alert.alert(
			"알림 전송",
			`${selectedPatients.size}명에게 알림을 전송했습니다.`
		)
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
					onPrevPage={() => {
						throw new Error("기능이 구현되지 않았습니다.")
					}}
					onNextPage={() => {
						throw new Error("기능이 구현되지 않았습니다.")
					}}
				/>

				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={[
							styles.button,
							selectedPatients.size === 0 && styles.buttonDisabled,
							{ backgroundColor: "#4CAF50" },
						]}
						onPress={handleViewDetails}
						disabled={selectedPatients.size === 0}
						activeOpacity={0.7}
					>
						<Text
							style={styles.buttonText}
						>{`${selectedPatients.size}명 조회`}</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[
							styles.button,
							selectedPatients.size === 0 && styles.buttonDisabled,
							{ backgroundColor: "#FF9800" },
						]}
						onPress={handleSendGroupNotification}
						disabled={selectedPatients.size === 0}
						activeOpacity={0.7}
					>
						<Text
							style={styles.buttonText}
						>{`${selectedPatients.size}명 알림`}</Text>
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

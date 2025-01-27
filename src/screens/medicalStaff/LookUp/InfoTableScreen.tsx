import React, { useState, useEffect } from "react"
import { View, StyleSheet, TouchableOpacity, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamList } from "../../../types/navigation"
import SearchBar from "../../../components/medicalStaff/SearchBar"
import PatientTable from "../../../components/medicalStaff/table/PatientTable"
import SearchFilterBar from "../../../components/medicalStaff/SearchFilterBar"
import Pagination from "../../../components/medicalStaff/Pagination"
import { patientMockData } from "../../../mock/patientMock"
import { Patient, SortConfig, FilterConfig } from "../../../types/patient"

const ITEMS_PER_PAGE = 10

export const InfoTableScreen = () => {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
	const [patients, setPatients] = useState<Patient[]>(patientMockData)
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedPatients, setSelectedPatients] = useState<Set<string>>(
		new Set()
	)
	const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([])
	const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		// 검색이나 필터가 변경될 때 첫 페이지로 이동
		setCurrentPage(1)
		const filteredData = getFilteredData()
		setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE))
	}, [searchQuery, filterConfigs])

	const getFilteredData = () => {
		let filtered = [...patients]

		// 검색 적용
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase()
			filtered = filtered.filter(
				(patient) =>
					patient.name.toLowerCase().includes(query) ||
					patient.id.toLowerCase().includes(query)
			)
		}

		// 필터 적용
		filtered = filtered.filter((patient) => {
			return filterConfigs.every(
				(filter) => patient[filter.key] === filter.value
			)
		})

		// 정렬 적용
		if (sortConfigs.length > 0) {
			filtered.sort((a, b) => {
				for (const sort of sortConfigs) {
					const aValue = a[sort.key]
					const bValue = b[sort.key]
					if (aValue !== bValue) {
						return sort.direction === "asc"
							? aValue > bValue
								? 1
								: -1
							: aValue < bValue
							? 1
							: -1
					}
				}
				return 0
			})
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
			if (existingSort.direction === "asc") {
				setSortConfigs([{ key, direction: "desc" }])
			} else {
				setSortConfigs([])
			}
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
		if (selectedPatients.size > 0) {
			const selectedPatientIds = Array.from(selectedPatients)
			navigation.navigate("DetailTable", { patientIds: selectedPatientIds })
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.searchSection}>
				<SearchBar
					value={searchQuery}
					onChangeText={setSearchQuery}
					onSearch={() => {}}
					placeholder="환자 이름 또는 ID로 검색..."
				/>
				<SearchFilterBar
					onFiltersChange={setFilterConfigs}
					currentFilters={filterConfigs}
				/>
			</View>

			<PatientTable
				data={getCurrentPageData()}
				selectedPatients={selectedPatients}
				sortConfigs={sortConfigs}
				onToggleSelect={(id) => {
					const newSelected = new Set(selectedPatients)
					if (newSelected.has(id)) {
						newSelected.delete(id)
					} else {
						newSelected.add(id)
					}
					setSelectedPatients(newSelected)
				}}
				onToggleSelectAll={() => {
					const currentData = getCurrentPageData()
					if (selectedPatients.size === currentData.length) {
						setSelectedPatients(new Set())
					} else {
						setSelectedPatients(new Set(currentData.map((p) => p.id)))
					}
				}}
				onToggleFavorite={handleToggleFavorite}
				onToggleSort={handleToggleSort}
			/>

			<View style={styles.footer}>
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					hasNextPage={false}
					onPrevPage={function (): void {
						throw new Error("Function not implemented.")
					}}
					onNextPage={function (): void {
						throw new Error("Function not implemented.")
					}}
				/>
				<TouchableOpacity
					style={[
						styles.button,
						selectedPatients.size === 0 && styles.buttonDisabled,
					]}
					onPress={handleViewDetails}
					disabled={selectedPatients.size === 0}
				>
					<Text style={styles.buttonText}>
						{`${selectedPatients.size}명의 환자 정보 조회`}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#fff",
	},
	searchSection: {
		marginBottom: 16,
	},
	footer: {
		padding: 16,
		borderTopWidth: 1,
		borderTopColor: "#eee",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	button: {
		backgroundColor: "#76DABF",
		padding: 12,
		borderRadius: 8,
		minWidth: 120,
		alignItems: "center",
	},
	buttonDisabled: {
		backgroundColor: "#ccc",
	},
	buttonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
	},
})

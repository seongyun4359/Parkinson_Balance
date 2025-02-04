import React, { useState } from "react"
import {
	View,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Modal,
	Text,
	FlatList,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { FilterConfig } from "../../types/patient"

interface SearchFilterBarProps {
	filters: FilterConfig[]
	onFiltersChange: (filters: FilterConfig[]) => void
}

const filterOptions: FilterConfig[] = [
	{ key: "lastLogin", value: "7일 이내" },
	{ key: "lastLogin", value: "30일 이내" },
	{ key: "exerciseScore", value: "높은 점수 순" },
	{ key: "exerciseScore", value: "낮은 점수 순" },
	{ key: "isFavorite", value: "즐겨찾기만 보기" },
]

const SearchFilterBar = ({
	filters,
	onFiltersChange,
}: SearchFilterBarProps) => {
	const [searchQuery, setSearchQuery] = useState("")
	const [modalVisible, setModalVisible] = useState(false)
	const [selectedFilters, setSelectedFilters] =
		useState<FilterConfig[]>(filters)

	const handleSearchChange = (text: string) => {
		setSearchQuery(text)
	}

	const handleFilterPress = () => {
		setModalVisible(true)
	}

	const handleApplyFilters = () => {
		onFiltersChange(selectedFilters)
		setModalVisible(false)
	}

	const toggleFilter = (filter: FilterConfig) => {
		setSelectedFilters((prev) => {
			const exists = prev.some(
				(f) => f.key === filter.key && f.value === filter.value
			)
			return exists
				? prev.filter((f) => f.value !== filter.value)
				: [...prev, filter]
		})
	}

	return (
		<View>
			<View style={styles.container}>
				<View style={styles.searchContainer}>
					<Ionicons name="search" size={20} color="#666" />
					<TextInput
						value={searchQuery}
						onChangeText={handleSearchChange}
						placeholder="환자 검색"
						style={styles.input}
					/>
				</View>
				<TouchableOpacity
					onPress={handleFilterPress}
					style={styles.filterButton}
				>
					<Ionicons name="filter" size={24} color="#666" />
				</TouchableOpacity>
			</View>

			{/* 필터 모달 */}
			<Modal visible={modalVisible} animationType="slide" transparent>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>필터 선택</Text>
						<FlatList
							data={filterOptions}
							keyExtractor={(item) => `${item.key}-${item.value}`}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={[
										styles.filterOption,
										selectedFilters.some((f) => f.value === item.value)
											? styles.selectedFilter
											: null,
									]}
									onPress={() => toggleFilter(item)}
								>
									<Text style={styles.filterText}>{item.value}</Text>
								</TouchableOpacity>
							)}
						/>
						<View style={styles.modalActions}>
							<TouchableOpacity
								onPress={() => setModalVisible(false)}
								style={[styles.button, styles.cancelButton]}
							>
								<Text style={styles.buttonText}>취소</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleApplyFilters}
								style={[styles.button, styles.applyButton]}
							>
								<Text style={styles.buttonText}>적용</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 12,
		marginBottom: 16,
	},
	searchContainer: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f8f8f8",
		borderRadius: 8,
		paddingHorizontal: 12,
		gap: 8,
	},
	input: {
		flex: 1,
		height: 40,
		fontSize: 16,
	},
	filterButton: {
		width: 40,
		height: 40,
		backgroundColor: "#f8f8f8",
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		width: "80%",
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 20,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	filterOption: {
		padding: 12,
		borderRadius: 8,
		marginBottom: 10,
		backgroundColor: "#f8f8f8",
		alignItems: "center",
	},
	selectedFilter: {
		backgroundColor: "#76DABF",
	},
	filterText: {
		fontSize: 16,
		color: "#333",
	},
	modalActions: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 16,
	},
	button: {
		flex: 1,
		padding: 12,
		borderRadius: 8,
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#ccc",
		marginRight: 10,
	},
	applyButton: {
		backgroundColor: "#76DABF",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
})

export default SearchFilterBar

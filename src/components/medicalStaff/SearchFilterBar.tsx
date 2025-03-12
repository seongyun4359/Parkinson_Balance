import React from "react"
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from "react-native"
import { SearchFilterBarProps, FilterConfig, FilterType } from "../../types/patient"
import Ionicons from "react-native-vector-icons/Ionicons"

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ searchValue, onSearchChange, filters, onFiltersChange }) => {
	const toggleFilter = (type: FilterType) => {
		const currentFilter = filters.find((f) => f.type === type)
		if (currentFilter) {
			onFiltersChange(filters.filter((f) => f.type !== type))
		} else {
			onFiltersChange([...filters, { type, value: true }])
		}
	}

	const isFilterActive = (type: FilterType) => {
		return filters.some((f) => f.type === type)
	}

	return (
		<View style={styles.container}>
			<View style={styles.searchContainer}>
				<Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
				<TextInput style={styles.searchInput} value={searchValue} onChangeText={onSearchChange} placeholder="환자 이름으로 검색" placeholderTextColor="#999" />
			</View>
			<View style={styles.filterContainer}>
				<TouchableOpacity style={[styles.filterButton, isFilterActive("favorite") && styles.filterButtonActive]} onPress={() => toggleFilter("favorite")}>
					<Ionicons name={isFilterActive("favorite") ? "star" : "star-outline"} size={20} color={isFilterActive("favorite") ? "#fff" : "#666"} />
					<Text style={[styles.filterText, isFilterActive("favorite") && styles.filterTextActive]}>즐겨찾기</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.filterButton, isFilterActive("recentLogin") && styles.filterButtonActive]} onPress={() => toggleFilter("recentLogin")}>
					<Ionicons name={isFilterActive("recentLogin") ? "time" : "time-outline"} size={20} color={isFilterActive("recentLogin") ? "#fff" : "#666"} />
					<Text style={[styles.filterText, isFilterActive("recentLogin") && styles.filterTextActive]}>최근 로그인</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
		marginBottom: 16,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 12,
		paddingHorizontal: 12,
		height: 48,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	searchIcon: {
		marginRight: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
	filterContainer: {
		flexDirection: "row",
		gap: 8,
	},
	filterButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f0f0f0",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		gap: 4,
	},
	filterButtonActive: {
		backgroundColor: "#76DABF",
	},
	filterText: {
		fontSize: 14,
		color: "#666",
	},
	filterTextActive: {
		color: "#fff",
	},
})

export default SearchFilterBar

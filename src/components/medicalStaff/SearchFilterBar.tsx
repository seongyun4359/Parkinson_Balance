import React from "react"
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { FilterConfig } from "../../types/patient"

interface SearchFilterBarProps {
	searchValue: string
	onSearchChange: (value: string) => void
	filters: FilterConfig[]
	onFiltersChange: (filters: FilterConfig[]) => void
	renderExtraButton?: () => React.ReactNode
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ searchValue, onSearchChange, filters, onFiltersChange, renderExtraButton }) => {
	const toggleFilter = (type: "favorite" | "recentLogin") => {
		const newFilters = filters.some((f) => f.type === type) ? filters.filter((f) => f.type !== type) : [...filters, { type, value: true }]
		onFiltersChange(newFilters)
	}

	return (
		<View style={styles.container}>
			<View style={styles.searchContainer}>
				<Icon name="search" size={24} color="#666" style={styles.searchIcon} />
				<TextInput style={styles.searchInput} placeholder="환자 이름으로 검색" value={searchValue} onChangeText={onSearchChange} />
			</View>
			<View style={styles.filterContainer}>
				<TouchableOpacity style={[styles.filterButton, filters.some((f) => f.type === "favorite") && styles.filterButtonActive]} onPress={() => toggleFilter("favorite")}>
					<Icon name="star" size={16} color={filters.some((f) => f.type === "favorite") ? "#fff" : "#666"} />
					<Text style={[styles.filterButtonText, filters.some((f) => f.type === "favorite") && styles.filterButtonTextActive]}>즐겨찾기</Text>
				</TouchableOpacity>

				<TouchableOpacity style={[styles.filterButton, filters.some((f) => f.type === "recentLogin") && styles.filterButtonActive]} onPress={() => toggleFilter("recentLogin")}>
					<Icon name="schedule" size={16} color={filters.some((f) => f.type === "recentLogin") ? "#fff" : "#666"} />
					<Text style={[styles.filterButtonText, filters.some((f) => f.type === "recentLogin") && styles.filterButtonTextActive]}>최근 로그인</Text>
				</TouchableOpacity>

				{renderExtraButton && renderExtraButton()}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 12,
		paddingHorizontal: 16,
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
	filterButtonText: {
		fontSize: 14,
		color: "#666",
	},
	filterButtonTextActive: {
		color: "#fff",
	},
})

export default SearchFilterBar

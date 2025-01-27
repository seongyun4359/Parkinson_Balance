import React from "react"
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { FilterConfig } from "../../types/patient"

interface SearchFilterBarProps {
	filters: FilterConfig[]
	onFiltersChange: (filters: FilterConfig[]) => void
}

const SearchFilterBar = ({
	searchQuery,
	onSearchChange,
	onFilterPress,
}: SearchFilterBarProps) => {
	return (
		<View style={styles.container}>
			<View style={styles.searchContainer}>
				<Ionicons name="search" size={20} color="#666" />
				<TextInput
					value={searchQuery}
					onChangeText={onSearchChange}
					placeholder="환자 검색"
					style={styles.input}
				/>
			</View>
			<TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
				<Ionicons name="filter" size={24} color="#666" />
			</TouchableOpacity>
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
})

export default SearchFilterBar

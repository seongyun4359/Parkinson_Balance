import React from "react"
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { FilterConfig } from "../../types/patient"
import { GestureResponderEvent } from "react-native"

interface SearchFilterBarProps {
	filters: FilterConfig[]
	onFiltersChange: (filters: FilterConfig[]) => void
}

const SearchFilterBar = ({
	filters,
	onFiltersChange,
}: SearchFilterBarProps) => {
	const [searchQuery, setSearchQuery] = React.useState("")

	const handleSearchChange = (text: string) => {
		setSearchQuery(text)
	}

	const handleFilterPress = () => {
		// TODO: 필터 모달 구현
	}

	function onSearchChange(text: string): void {
		throw new Error("Function not implemented.")
	}

	function onFilterPress(event: GestureResponderEvent): void {
		throw new Error("Function not implemented.")
	}

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

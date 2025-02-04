import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

interface TableHeaderProps {
	onSelectAll: () => void
	isAllSelected: boolean
	sortOrder: "desc" | "asc"
	onSortChange: () => void
}

const TableHeader = ({
	onSelectAll,
	isAllSelected,
	sortOrder,
	onSortChange,
}: TableHeaderProps) => {
	return (
		<View style={styles.header}>
			<TouchableOpacity onPress={onSelectAll} style={styles.checkboxCell}>
				<Ionicons
					name={isAllSelected ? "checkbox" : "square-outline"}
					size={24}
					color="#76DABF"
				/>
			</TouchableOpacity>
			<Text style={styles.cell}>환자명</Text>
			<TouchableOpacity style={styles.cell} onPress={onSortChange}>
				<Text>최근 로그인</Text>
				<Ionicons
					name={sortOrder === "desc" ? "arrow-down" : "arrow-up"}
					size={16}
					color="#666"
				/>
			</TouchableOpacity>
			<Text style={styles.cell}>운동 수행 정도</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		backgroundColor: "#f8f8f8",
		padding: 12,
		borderRadius: 8,
	},
	checkboxCell: {
		width: 40,
		alignItems: "center",
	},
	cell: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
})

export default TableHeader

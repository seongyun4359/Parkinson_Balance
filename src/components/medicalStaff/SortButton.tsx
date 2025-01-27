import React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

interface SortButtonProps {
	sortOrder: "desc" | "asc"
	onPress: () => void
}

const SortButton = ({ sortOrder, onPress }: SortButtonProps) => {
	return (
		<TouchableOpacity onPress={onPress} style={styles.sortButton}>
			<Ionicons
				name={sortOrder === "desc" ? "arrow-down" : "arrow-up"}
				size={20}
				color="#666"
			/>
			<Text style={styles.sortButtonText}>
				{sortOrder === "desc" ? "최신순" : "오래된순"}
			</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	sortButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	sortButtonText: {
		color: "#666",
		fontSize: 16,
	},
})

export default SortButton

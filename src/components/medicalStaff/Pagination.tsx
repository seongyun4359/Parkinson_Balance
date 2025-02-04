import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

interface PaginationProps {
	currentPage: number
	hasNextPage: boolean
	onPrevPage: () => void
	onNextPage: () => void
	totalPages: number
	onPageChange: (page: number) => void
}

const Pagination = ({
	currentPage,
	hasNextPage,
	onPrevPage,
	onNextPage,
}: PaginationProps) => {
	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={onPrevPage}
				disabled={currentPage === 1}
				style={[styles.button, currentPage === 1 && styles.buttonDisabled]}
			>
				<Text style={styles.buttonText}>이전</Text>
			</TouchableOpacity>
			<Text style={styles.pageText}>{currentPage}</Text>
			<TouchableOpacity
				onPress={onNextPage}
				disabled={!hasNextPage}
				style={[styles.button, !hasNextPage && styles.buttonDisabled]}
			>
				<Text style={styles.buttonText}>다음</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		gap: 16,
	},
	button: {
		padding: 8,
		backgroundColor: "#76DABF",
		borderRadius: 4,
	},
	buttonDisabled: {
		backgroundColor: "#ccc",
	},
	buttonText: {
		color: "#fff",
	},
	pageText: {
		fontSize: 16,
	},
})

export default Pagination

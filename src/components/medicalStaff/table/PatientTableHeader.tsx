import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import CheckBox from "@react-native-community/checkbox"
import { Patient } from "../../../types/patient"

interface PatientTableHeaderProps {
	selectedCount: number
	totalCount: number
	onToggleSelectAll: () => void
	onToggleSort: (key: keyof Patient) => void
}

const PatientTableHeader = ({
	selectedCount,
	totalCount,
	onToggleSelectAll,
	onToggleSort,
}: PatientTableHeaderProps) => {
	return (
		<View style={styles.header}>
			<CheckBox
				value={selectedCount === totalCount && totalCount > 0}
				onValueChange={onToggleSelectAll}
			/>
			<TouchableOpacity onPress={() => onToggleSort("name")}>
				<Text style={styles.headerText}>환자명</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => onToggleSort("lastVisit")}>
				<Text style={styles.headerText}>최근 로그인</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => onToggleSort("activityLevel")}>
				<Text style={styles.headerText}>운동 수행 정도</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 8,
		backgroundColor: "#f5f5f5",
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
	},
	headerText: {
		fontSize: 14,
		fontWeight: "bold",
	},
})

export default PatientTableHeader

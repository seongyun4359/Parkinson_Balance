import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import CheckBox from "@react-native-community/checkbox"
import Icon from "react-native-vector-icons/MaterialIcons"
import { Patient } from "../../../types/patient"

interface PatientTableRowProps {
	patient: Patient
	isSelected: boolean
	onToggleSelect: () => void
	onToggleFavorite: () => void
}

const PatientTableRow = ({
	patient,
	isSelected,
	onToggleSelect,
	onToggleFavorite,
}: PatientTableRowProps) => {
	return (
		<View style={styles.row}>
			<CheckBox value={isSelected} onValueChange={onToggleSelect} />
			<Text style={styles.cell}>{patient.name}</Text>
			<Text style={styles.cell}>{patient.lastVisit}</Text>
			<Text style={styles.cell}>{patient.activityLevel}</Text>
			<TouchableOpacity onPress={onToggleFavorite}>
				<Icon
					name={patient.isFavorite ? "star" : "star-border"}
					size={24}
					color={patient.isFavorite ? "#FFD700" : "#000"}
				/>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	cell: {
		flex: 1,
		fontSize: 14,
	},
})

export default PatientTableRow

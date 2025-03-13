import React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Patient, SortConfig } from "../../../types/patient.ts"
import Ionicons from "react-native-vector-icons/Ionicons"
import { formatDate, getLoginStatus } from "../../../utils/dateFormat"
import Icon from "react-native-vector-icons/MaterialIcons"

interface PatientTableProps {
	data: Patient[]
	selectedPatients: Set<string>
	sortConfigs: SortConfig[]
	onToggleSelect: (id: string) => void
	onToggleSelectAll: () => void
	onToggleFavorite: (id: string) => void
	onToggleSort: (key: keyof Patient) => void
	onNamePress: (patient: Patient) => void
}

const PatientTable: React.FC<PatientTableProps> = ({ data, selectedPatients, sortConfigs, onToggleSelect, onToggleSelectAll, onToggleFavorite, onToggleSort, onNamePress }) => {
	const getSortIcon = (key: keyof Patient) => {
		const config = sortConfigs.find((config) => config.key === key)
		if (!config) return null
		return config.direction === "asc" ? "arrow-upward" : "arrow-downward"
	}

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<TouchableOpacity style={styles.checkboxCell} onPress={onToggleSelectAll}>
					<Icon name={selectedPatients.size === data.length ? "check-box" : "check-box-outline-blank"} size={24} color="#76DABF" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.headerCell} onPress={() => onToggleSort("name")}>
					<Text style={styles.headerText}>이름</Text>
					{getSortIcon("name") && <Icon name={getSortIcon("name")!} size={16} color="#666" />}
				</TouchableOpacity>
				<TouchableOpacity style={styles.headerCell} onPress={() => onToggleSort("lastLogin")}>
					<Text style={styles.headerText}>최근 접속</Text>
					{getSortIcon("lastLogin") && <Icon name={getSortIcon("lastLogin")!} size={16} color="#666" />}
				</TouchableOpacity>
				<View style={styles.favoriteCell}>
					<Icon name="star" size={24} color="#FFB74D" />
				</View>
			</View>

			<ScrollView style={styles.scrollView}>
				{data.map((patient) => (
					<View key={patient.id} style={styles.row}>
						<TouchableOpacity style={styles.checkboxCell} onPress={() => onToggleSelect(patient.id)}>
							<Icon name={selectedPatients.has(patient.id) ? "check-box" : "check-box-outline-blank"} size={24} color="#76DABF" />
						</TouchableOpacity>
						<TouchableOpacity style={styles.cell} onPress={() => onNamePress(patient)}>
							<Text style={styles.nameText}>{patient.name}</Text>
							<Text style={styles.phoneText}>{patient.phoneNumber}</Text>
						</TouchableOpacity>
						<View style={styles.cell}>
							<Text>{new Date(patient.lastLogin).toLocaleDateString()}</Text>
						</View>
						<TouchableOpacity style={styles.favoriteCell} onPress={() => onToggleFavorite(patient.id)}>
							<Icon name={patient.isFavorite ? "star" : "star-border"} size={24} color="#FFB74D" />
						</TouchableOpacity>
					</View>
				))}
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 12,
		overflow: "hidden",
	},
	headerRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderColor: "#ddd",
		backgroundColor: "#f8f9fa",
		paddingVertical: 12,
	},
	scrollView: {
		flex: 1,
	},
	row: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderColor: "#eee",
		paddingVertical: 12,
	},
	headerCell: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 4,
		paddingHorizontal: 8,
	},
	cell: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 8,
	},
	checkboxCell: {
		width: 48,
		justifyContent: "center",
		alignItems: "center",
	},
	favoriteCell: {
		width: 48,
		justifyContent: "center",
		alignItems: "center",
	},
	headerText: {
		fontWeight: "bold",
		color: "#333",
	},
	nameText: {
		color: "#2196F3",
		fontWeight: "500",
		textDecorationLine: "underline",
	},
	phoneText: {
		fontSize: 12,
		color: "#666",
		marginTop: 4,
	},
})

export default PatientTable

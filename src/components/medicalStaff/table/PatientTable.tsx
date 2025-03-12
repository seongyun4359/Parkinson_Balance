import React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Patient, SortConfig } from "../../../types/patient.ts"
import Ionicons from "react-native-vector-icons/Ionicons"
import { formatDate, getLoginStatus } from "../../../utils/dateFormat"

interface PatientTableProps {
	data: Patient[]
	selectedPatients: Set<string>
	sortConfigs: SortConfig[]
	onToggleSelect: (id: string) => void
	onToggleSelectAll: () => void
	onToggleFavorite: (id: string) => void
	onToggleSort: (key: keyof Patient) => void
}

const PatientTable: React.FC<PatientTableProps> = ({ data, selectedPatients, sortConfigs, onToggleSelect, onToggleSelectAll, onToggleFavorite, onToggleSort }) => {
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.checkboxCell} onPress={onToggleSelectAll}>
					<Ionicons name={selectedPatients.size === data.length ? "checkbox" : "square-outline"} size={24} color="#76DABF" />
				</TouchableOpacity>
				<TouchableOpacity style={styles.nameCell} onPress={() => onToggleSort("name")}>
					<Text style={styles.headerText}>이름</Text>
				</TouchableOpacity>
				<View style={styles.genderCell}>
					<Text style={styles.headerText}>성별</Text>
				</View>
				<TouchableOpacity style={styles.loginCell} onPress={() => onToggleSort("lastLogin")}>
					<Text style={styles.headerText}>최근 로그인</Text>
				</TouchableOpacity>
				<View style={styles.actionCell}>
					<Text style={styles.headerText}>즐겨찾기</Text>
				</View>
			</View>

			<ScrollView style={styles.scrollView}>
				{data.map((patient) => (
					<View key={patient.id} style={styles.row}>
						<TouchableOpacity style={styles.checkboxCell} onPress={() => onToggleSelect(patient.id)}>
							<Ionicons name={selectedPatients.has(patient.id) ? "checkbox" : "square-outline"} size={24} color="#76DABF" />
						</TouchableOpacity>
						<View style={styles.nameCell}>
							<Text style={styles.cellText}>{patient.name}</Text>
							<Text style={styles.phoneText}>{patient.phoneNumber}</Text>
						</View>
						<View style={styles.genderCell}>
							<Text style={styles.cellText}>{patient.gender}</Text>
						</View>
						<View style={styles.loginCell}>
							<Text style={styles.cellText}>{formatDate(patient.lastLogin)}</Text>
							<Text style={[styles.statusText, getLoginStatus(patient.lastLogin) === "최근 접속" && styles.recentStatus, getLoginStatus(patient.lastLogin) === "장기 미접속" && styles.inactiveStatus]}>
								{getLoginStatus(patient.lastLogin)}
							</Text>
						</View>
						<TouchableOpacity style={styles.actionCell} onPress={() => onToggleFavorite(patient.id)}>
							<Ionicons name={patient.isFavorite ? "star" : "star-outline"} size={24} color={patient.isFavorite ? "#FFD700" : "#666"} />
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
	header: {
		flexDirection: "row",
		backgroundColor: "#f8f8f8",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	scrollView: {
		flex: 1,
	},
	row: {
		flexDirection: "row",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
		backgroundColor: "#fff",
	},
	checkboxCell: {
		width: 40,
		justifyContent: "center",
	},
	nameCell: {
		flex: 2,
		justifyContent: "center",
	},
	genderCell: {
		width: 60,
		justifyContent: "center",
		alignItems: "center",
	},
	loginCell: {
		flex: 1.5,
		justifyContent: "center",
	},
	actionCell: {
		width: 60,
		justifyContent: "center",
		alignItems: "center",
	},
	headerText: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#333",
	},
	cellText: {
		fontSize: 14,
		color: "#333",
	},
	phoneText: {
		fontSize: 12,
		color: "#666",
		marginTop: 2,
	},
	statusText: {
		fontSize: 12,
		color: "#666",
		marginTop: 2,
	},
	recentStatus: {
		color: "#4CAF50",
	},
	inactiveStatus: {
		color: "#FF5722",
	},
})

export default PatientTable

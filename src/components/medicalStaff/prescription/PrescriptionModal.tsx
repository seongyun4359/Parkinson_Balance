import React from "react"
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Prescription } from "../../../types/prescription"

interface PrescriptionModalProps {
	prescription: Prescription | null
	visible: boolean
	onClose: () => void
}

const PrescriptionModal = ({
	prescription,
	visible,
	onClose,
}: PrescriptionModalProps) => {
	if (!prescription) return null

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>처방 상세 정보</Text>
						<TouchableOpacity onPress={onClose}>
							<Ionicons name="close" size={24} color="#333" />
						</TouchableOpacity>
					</View>
					<View style={styles.modalBody}>
						<Text style={styles.modalDate}>{prescription.date}</Text>
						<View style={styles.infoRow}>
							<Text style={styles.label}>병원</Text>
							<Text style={styles.value}>{prescription.hospitalName}</Text>
						</View>
						<View style={styles.infoRow}>
							<Text style={styles.label}>담당의</Text>
							<Text style={styles.value}>{prescription.doctorName}</Text>
						</View>
						<View style={styles.infoRow}>
							<Text style={styles.label}>진단</Text>
							<Text style={styles.value}>{prescription.diagnosis}</Text>
						</View>
						<Text style={styles.sectionTitle}>처방 약품</Text>
						{prescription.medications.map((med, index) => (
							<View key={index} style={styles.medicationItem}>
								<Text style={styles.medName}>{med.name}</Text>
								<Text style={styles.medDosage}>{med.dosage}</Text>
								<Text style={styles.medInstructions}>{med.instructions}</Text>
							</View>
						))}
						{prescription.nextAppointment && (
							<View style={styles.infoRow}>
								<Text style={styles.label}>다음 예약</Text>
								<Text style={styles.value}>{prescription.nextAppointment}</Text>
							</View>
						)}
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		width: "90%",
		maxHeight: "80%",
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
	},
	modalBody: {
		gap: 16,
	},
	modalDate: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	label: {
		fontSize: 16,
		color: "#666",
		width: 80,
	},
	value: {
		fontSize: 16,
		color: "#333",
		flex: 1,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginTop: 8,
	},
	medicationItem: {
		backgroundColor: "#f8f8f8",
		padding: 12,
		borderRadius: 8,
		gap: 4,
	},
	medName: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	medDosage: {
		fontSize: 14,
		color: "#666",
	},
	medInstructions: {
		fontSize: 14,
		color: "#666",
	},
})

export default PrescriptionModal

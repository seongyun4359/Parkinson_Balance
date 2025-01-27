import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { getPrescriptions } from "../../../mock/prescriptionMock"
import { Prescription } from "../../../types/prescription"
import PrescriptionList from "../../../components/medicalStaff/PrescriptionList"
import PrescriptionModal from "../../../components/medicalStaff/PrescriptionModal"

const PrescriptionScreen = () => {
	const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
	const [currentPage, setCurrentPage] = useState(1)
	const [selectedPrescription, setSelectedPrescription] =
		useState<Prescription | null>(null)
	const [modalVisible, setModalVisible] = useState(false)

	const { prescriptions, totalPages } = getPrescriptions(
		currentPage,
		5,
		sortOrder
	)

	const toggleSortOrder = () => {
		setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
	}

	const handlePrescriptionPress = (prescription: Prescription) => {
		setSelectedPrescription(prescription)
		setModalVisible(true)
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>처방 기록</Text>
				<TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
					{sortOrder === "desc" ? (
						<Ionicons name="arrow-down" size={20} color="#666" />
					) : (
						<Ionicons name="arrow-up" size={20} color="#666" />
					)}
					<Text style={styles.sortButtonText}>
						{sortOrder === "desc" ? "최신순" : "오래된순"}
					</Text>
				</TouchableOpacity>
			</View>

			<PrescriptionList
				prescriptions={prescriptions}
				onPrescriptionPress={handlePrescriptionPress}
			/>

			<View style={styles.pagination}>
				<TouchableOpacity
					onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
					disabled={currentPage === 1}
				>
					<Text
						style={[styles.pageButton, currentPage === 1 && styles.disabled]}
					>
						이전
					</Text>
				</TouchableOpacity>
				<Text style={styles.pageText}>
					{currentPage} / {totalPages}
				</Text>
				<TouchableOpacity
					onPress={() =>
						setCurrentPage((prev) => Math.min(totalPages, prev + 1))
					}
					disabled={currentPage === totalPages}
				>
					<Text
						style={[
							styles.pageButton,
							currentPage === totalPages && styles.disabled,
						]}
					>
						다음
					</Text>
				</TouchableOpacity>
			</View>

			<PrescriptionModal
				prescription={selectedPrescription}
				visible={modalVisible}
				onClose={() => setModalVisible(false)}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 16,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	sortButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	sortButtonText: {
		color: "#666",
		fontSize: 16,
	},
	pagination: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
		paddingVertical: 16,
	},
	pageButton: {
		color: "#76DABF",
		fontSize: 16,
		fontWeight: "bold",
	},
	pageText: {
		fontSize: 16,
		color: "#333",
	},
	disabled: {
		color: "#ccc",
	},
})

export default PrescriptionScreen

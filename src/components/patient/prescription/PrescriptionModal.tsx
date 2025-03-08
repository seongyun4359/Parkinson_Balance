import React from "react"
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
} from "react-native"
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
					{/* 헤더 */}
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>처방된 운동 목표</Text>
						<TouchableOpacity onPress={onClose}>
							<Ionicons name="close" size={24} color="#333" />
						</TouchableOpacity>
					</View>

					{/* 본문 스크롤 영역 */}
					<ScrollView style={styles.modalBody}>
						<Text style={styles.modalDate}>{prescription.date}</Text>

						{/* 운동 처방 */}
						<Text style={styles.sectionTitle}>운동 처방</Text>
						{prescription.exercisePrescriptions?.length ? (
							prescription.exercisePrescriptions.map((exercise) => (
								<View key={exercise.goalId} style={styles.exerciseItem}>
									<Text style={styles.exerciseType}>
										{exercise.exerciseName}
									</Text>
									<Text style={styles.exerciseDetail}>
										세트 수: {exercise.setCount} / 반복 횟수:{" "}
										{exercise.repeatCount}회
										{exercise.duration > 0
											? ` / 지속 시간: ${exercise.duration}초`
											: ""}
									</Text>
								</View>
							))
						) : (
							<Text style={styles.noData}>운동 처방이 없습니다.</Text>
						)}
					</ScrollView>
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
		paddingBottom: 20,
	},
	modalDate: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginTop: 16,
		marginBottom: 8,
	},
	exerciseItem: {
		backgroundColor: "#eef6ff",
		padding: 10,
		borderRadius: 8,
		marginBottom: 8,
	},
	exerciseType: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#0055aa",
	},
	exerciseDetail: {
		fontSize: 14,
		color: "#333",
	},
	noData: {
		fontSize: 16,
		color: "#999",
		textAlign: "center",
		marginTop: 10,
		marginBottom: 5,
	},
})

export default PrescriptionModal

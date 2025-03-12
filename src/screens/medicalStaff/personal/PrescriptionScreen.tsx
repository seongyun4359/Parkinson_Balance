import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { getPrescriptions } from "../../../mock/prescriptionMock"
import { Prescription } from "../../../types/prescription"
import PrescriptionList from "../../../components/medicalStaff/prescription/PrescriptionList"
import PrescriptionModal from "../../../components/medicalStaff/prescription/PrescriptionModal"
import { getExerciseGoals, ExerciseGoal } from "../../../apis/exercise"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../../../types/navigation"

type PrescriptionScreenRouteProp = RouteProp<RootStackParamList, "Prescription">

const PrescriptionScreen = () => {
	const route = useRoute<PrescriptionScreenRouteProp>()
	const { patientInfo } = route.params

	const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
	const [currentPage, setCurrentPage] = useState(1)
	const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
	const [modalVisible, setModalVisible] = useState(false)
	const [exerciseGoal, setExerciseGoal] = useState<ExerciseGoal | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { prescriptions, totalPages } = getPrescriptions(currentPage, 5, sortOrder)

	useEffect(() => {
		loadExerciseGoals()
	}, [patientInfo.phoneNumber])

	const loadExerciseGoals = async () => {
		try {
			setLoading(true)
			setError(null)
			const goals = await getExerciseGoals(patientInfo.phoneNumber)
			setExerciseGoal(goals)
		} catch (error: any) {
			console.error("운동 목표 로딩 오류:", error)
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

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
				<Text style={styles.title}>운동 목표 및 처방 기록</Text>
				<TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
					{sortOrder === "desc" ? <Ionicons name="arrow-down" size={20} color="#666" /> : <Ionicons name="arrow-up" size={20} color="#666" />}
					<Text style={styles.sortButtonText}>{sortOrder === "desc" ? "최신순" : "오래된순"}</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.exerciseGoalsSection}>
				<View style={styles.sectionHeader}>
					<Ionicons name="fitness-outline" size={24} color="#76DABF" />
					<Text style={styles.sectionTitle}>운동 목표</Text>
					<TouchableOpacity onPress={loadExerciseGoals} style={styles.refreshButton}>
						<Ionicons name="refresh-outline" size={20} color="#666" />
					</TouchableOpacity>
				</View>

				<View style={styles.goalsContainer}>
					{loading ? (
						<View style={styles.centerContent}>
							<ActivityIndicator size="large" color="#76DABF" />
						</View>
					) : error ? (
						<View style={styles.centerContent}>
							<Text style={styles.errorText}>{error}</Text>
							<TouchableOpacity onPress={loadExerciseGoals} style={styles.retryButton}>
								<Text style={styles.retryText}>다시 시도</Text>
							</TouchableOpacity>
						</View>
					) : exerciseGoal?.goals && exerciseGoal.goals.length > 0 ? (
						exerciseGoal.goals.map((goal, index) => (
							<View key={index} style={styles.goalItem}>
								<Text style={styles.goalType}>{goal.type}</Text>
								<Text style={styles.goalTarget}>{goal.target}</Text>
								<Text style={styles.goalDescription}>{goal.description}</Text>
							</View>
						))
					) : (
						<View style={styles.centerContent}>
							<Text style={styles.noGoalsText}>설정된 운동 목표가 없습니다</Text>
						</View>
					)}
				</View>
			</View>

			<View style={styles.divider} />

			<Text style={styles.sectionTitle}>처방 기록</Text>
			<PrescriptionList prescriptions={prescriptions} onPrescriptionPress={handlePrescriptionPress} />

			<View style={styles.pagination}>
				<TouchableOpacity onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
					<Text style={[styles.pageButton, currentPage === 1 && styles.disabled]}>이전</Text>
				</TouchableOpacity>
				<Text style={styles.pageText}>
					{currentPage} / {totalPages}
				</Text>
				<TouchableOpacity onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
					<Text style={[styles.pageButton, currentPage === totalPages && styles.disabled]}>다음</Text>
				</TouchableOpacity>
			</View>

			<PrescriptionModal prescription={selectedPrescription} visible={modalVisible} onClose={() => setModalVisible(false)} />
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
	exerciseGoalsSection: {
		backgroundColor: "#f8f8f8",
		borderRadius: 12,
		padding: 16,
		marginBottom: 20,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
		gap: 8,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		flex: 1,
	},
	refreshButton: {
		padding: 4,
	},
	goalsContainer: {
		minHeight: 100,
	},
	centerContent: {
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	errorText: {
		color: "#ff6b6b",
		textAlign: "center",
		marginBottom: 8,
	},
	retryButton: {
		backgroundColor: "#76DABF",
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		marginTop: 8,
	},
	retryText: {
		color: "#fff",
		fontWeight: "bold",
	},
	noGoalsText: {
		color: "#999",
		textAlign: "center",
	},
	goalItem: {
		backgroundColor: "#fff",
		borderRadius: 8,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	goalType: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 4,
	},
	goalTarget: {
		fontSize: 14,
		color: "#666",
		marginBottom: 4,
	},
	goalDescription: {
		fontSize: 14,
		color: "#666",
	},
	divider: {
		height: 1,
		backgroundColor: "#eee",
		marginVertical: 16,
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

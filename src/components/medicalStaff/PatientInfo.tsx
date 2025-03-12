import React, { useState, useEffect } from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { PatientInfoProps } from "../../types/patient"
import { getExerciseGoals, ExerciseGoal } from "../../apis/exercise"

const PatientInfoCard: React.FC<PatientInfoProps> = ({ patientInfo, onPrescriptionPress }) => {
	const [exerciseGoal, setExerciseGoal] = useState<ExerciseGoal | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

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

	return (
		<View style={styles.infoContainer}>
			<View style={styles.infoBox}>
				<View style={styles.profileSection}>
					<View style={styles.avatarContainer}>
						<Ionicons name="person" size={40} color="#76DABF" />
					</View>
					<View style={styles.basicInfo}>
						<Text style={styles.nameText}>{patientInfo.name}</Text>
						<Text style={styles.subText}>{patientInfo.gender}</Text>
					</View>
				</View>
				<View style={styles.divider} />
				<View style={styles.detailsSection}>
					<View style={styles.detailItem}>
						<Ionicons name="call-outline" size={20} color="#666" />
						<Text style={styles.detailText}>{patientInfo.phoneNumber}</Text>
					</View>
				</View>
			</View>
			<TouchableOpacity
				style={styles.prescriptionBox}
				onPress={() => {
					onPrescriptionPress()
					loadExerciseGoals()
				}}
			>
				<View style={styles.prescriptionHeader}>
					<Ionicons name="document-text" size={24} color="#76DABF" />
					<Text style={styles.prescriptionTitle}>운동 목표</Text>
				</View>
				<View style={styles.goalsContainer}>
					{loading ? (
						<View style={styles.centerContent}>
							<ActivityIndicator size="large" color="#76DABF" />
						</View>
					) : error ? (
						<View style={styles.centerContent}>
							<Text style={styles.errorText}>{error}</Text>
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
							<Ionicons name="fitness-outline" size={48} color="#ddd" />
							<Text style={styles.noGoalsText}>설정된 운동 목표가 없습니다</Text>
						</View>
					)}
				</View>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	infoContainer: {
		marginVertical: 20,
		gap: 16,
	},
	infoBox: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	profileSection: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	avatarContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#f0f9f6",
		justifyContent: "center",
		alignItems: "center",
	},
	basicInfo: {
		marginLeft: 16,
	},
	nameText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	subText: {
		fontSize: 16,
		color: "#666",
		marginTop: 4,
	},
	divider: {
		height: 1,
		backgroundColor: "#eee",
		marginVertical: 16,
	},
	detailsSection: {
		gap: 12,
	},
	detailItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	detailText: {
		fontSize: 16,
		color: "#333",
	},
	prescriptionBox: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	prescriptionHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 16,
	},
	prescriptionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	goalsContainer: {
		minHeight: 200,
	},
	centerContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		minHeight: 200,
	},
	errorText: {
		color: "#ff6b6b",
		textAlign: "center",
		marginTop: 8,
	},
	noGoalsText: {
		color: "#999",
		marginTop: 8,
	},
	goalItem: {
		backgroundColor: "#f8f8f8",
		borderRadius: 8,
		padding: 16,
		marginBottom: 12,
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
})

export default PatientInfoCard

import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert, ScrollView } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { getExerciseGoals, ExerciseGoalResponse, ExerciseGoalItem, updateExerciseGoal } from "../../../apis/exercise"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../../../types/navigation"

type PrescriptionScreenRouteProp = RouteProp<RootStackParamList, "Prescription">

const PrescriptionScreen = () => {
	const route = useRoute<PrescriptionScreenRouteProp>()
	const { patientInfo } = route.params

	const [exerciseGoals, setExerciseGoals] = useState<ExerciseGoalResponse | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [editingGoal, setEditingGoal] = useState<{
		goalId: number
		repeatCount: number
		setCount: number
	} | null>(null)

	useEffect(() => {
		loadExerciseGoals()
	}, [patientInfo.phoneNumber])

	const loadExerciseGoals = async () => {
		try {
			setLoading(true)
			setError(null)
			const goals = await getExerciseGoals(patientInfo.phoneNumber)
			setExerciseGoals(goals)
		} catch (error: any) {
			console.error("운동 목표 로딩 오류:", error)
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	const handleUpdateGoal = async () => {
		if (!editingGoal) return

		// 입력값 검증
		if (editingGoal.repeatCount <= 0) {
			Alert.alert("입력 오류", "반복 횟수는 1 이상이어야 합니다.")
			return
		}

		if (editingGoal.setCount <= 0) {
			Alert.alert("입력 오류", "세트 수는 1 이상이어야 합니다.")
			return
		}

		try {
			setLoading(true)
			console.log("운동 목표 수정 시도:", {
				phoneNumber: patientInfo.phoneNumber,
				...editingGoal,
			})

			await updateExerciseGoal(patientInfo.phoneNumber, editingGoal)
			Alert.alert("성공", "운동 목표가 수정되었습니다.")
			loadExerciseGoals()
			setEditingGoal(null)
		} catch (error: any) {
			console.error("운동 목표 수정 오류:", error)
			Alert.alert("오류", error.message || "운동 목표 수정에 실패했습니다. 잠시 후 다시 시도해주세요.")
		} finally {
			setLoading(false)
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>운동 목표 관리</Text>
				<TouchableOpacity onPress={loadExerciseGoals} style={styles.refreshButton}>
					<Ionicons name="refresh-outline" size={20} color="#666" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.exerciseGoalsSection}>
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
				) : exerciseGoals?.content && exerciseGoals.content.length > 0 ? (
					<>
						<View style={styles.summaryContainer}>
							<Text style={styles.summaryText}>
								총 {exerciseGoals.totalElements}개의 운동 목표 ({exerciseGoals.number + 1}/{exerciseGoals.totalPages} 페이지)
							</Text>
						</View>
						{exerciseGoals.content.map((goal: ExerciseGoalItem) => (
							<View key={goal.goalId} style={styles.goalItem}>
								<View style={styles.goalHeader}>
									<Text style={styles.goalType}>{goal.exerciseName}</Text>
									<TouchableOpacity
										style={styles.editButton}
										onPress={() =>
											setEditingGoal({
												goalId: goal.goalId,
												repeatCount: goal.repeatCount,
												setCount: goal.setCount,
											})
										}
									>
										<Ionicons name="create-outline" size={20} color="#fff" />
										<Text style={styles.editButtonText}>수정</Text>
									</TouchableOpacity>
								</View>
								{editingGoal?.goalId === goal.goalId ? (
									<View style={styles.editForm}>
										<View style={styles.inputContainer}>
											<Text style={styles.label}>반복 횟수</Text>
											<TextInput
												style={styles.input}
												value={editingGoal.repeatCount.toString()}
												onChangeText={(text) => {
													const value = parseInt(text) || 0
													setEditingGoal({
														...editingGoal,
														repeatCount: value,
													})
												}}
												keyboardType="numeric"
												maxLength={3}
												placeholder="1-999"
											/>
										</View>
										<View style={styles.inputContainer}>
											<Text style={styles.label}>세트 수</Text>
											<TextInput
												style={styles.input}
												value={editingGoal.setCount.toString()}
												onChangeText={(text) => {
													const value = parseInt(text) || 0
													setEditingGoal({
														...editingGoal,
														setCount: value,
													})
												}}
												keyboardType="numeric"
												maxLength={2}
												placeholder="1-99"
											/>
										</View>
										<View style={styles.buttonGroup}>
											<TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setEditingGoal(null)}>
												<Text style={styles.buttonText}>취소</Text>
											</TouchableOpacity>
											<TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdateGoal}>
												<Text style={styles.buttonText}>저장</Text>
											</TouchableOpacity>
										</View>
									</View>
								) : (
									<>
										<Text style={styles.goalTarget}>
											{goal.repeatCount}회 × {goal.setCount}세트
										</Text>
										{goal.duration > 0 && <Text style={styles.goalDuration}>유지 시간: {goal.duration}초</Text>}
									</>
								)}
							</View>
						))}
					</>
				) : (
					<View style={styles.centerContent}>
						<Text style={styles.noGoalsText}>설정된 운동 목표가 없습니다</Text>
					</View>
				)}
			</ScrollView>
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
	refreshButton: {
		padding: 8,
	},
	exerciseGoalsSection: {
		flex: 1,
	},
	summaryContainer: {
		backgroundColor: "#f0f0f0",
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	summaryText: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
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
		backgroundColor: "#f8f8f8",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
	},
	goalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	goalType: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		flex: 1,
		marginRight: 8,
	},
	goalTarget: {
		fontSize: 16,
		color: "#666",
		marginBottom: 4,
	},
	goalDuration: {
		fontSize: 14,
		color: "#666",
		fontStyle: "italic",
	},
	editForm: {
		marginTop: 12,
		padding: 12,
		backgroundColor: "#fff",
		borderRadius: 8,
	},
	inputContainer: {
		marginBottom: 12,
	},
	label: {
		fontSize: 14,
		color: "#666",
		marginBottom: 4,
	},
	input: {
		backgroundColor: "#f0f0f0",
		borderRadius: 8,
		padding: 8,
		fontSize: 16,
	},
	buttonGroup: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 8,
		marginTop: 12,
	},
	button: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		minWidth: 80,
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#ff6b6b",
	},
	saveButton: {
		backgroundColor: "#76DABF",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	editButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#76DABF",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
		gap: 4,
	},
	editButtonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "500",
	},
})

export default PrescriptionScreen

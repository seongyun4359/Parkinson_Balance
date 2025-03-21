import React, { useState, useEffect } from "react"
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Alert,
	TextInput,
	Modal,
} from "react-native"
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native"
import { RootStackParamList } from "../../../types/navigation"
import { Patient } from "../../../types/patient"
import { getExerciseGoals, ExerciseGoalItem, updateExerciseGoal } from "../../../apis/exercise"
import { getExerciseHistory, ExerciseHistoryItem } from "../../../apis/exercise"
import Icon from "react-native-vector-icons/MaterialIcons"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type PatientDetailScreenRouteProp = RouteProp<RootStackParamList, "PatientDetail">
type PatientDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>

type TabType = "info" | "goals" | "history"

const PatientDetailScreen = () => {
	const route = useRoute<PatientDetailScreenRouteProp>()
	const navigation = useNavigation<PatientDetailScreenNavigationProp>()
	const { patient } = route.params
	const [activeTab, setActiveTab] = useState<TabType>("info")
	const [exerciseGoals, setExerciseGoals] = useState<ExerciseGoalItem[]>([])
	const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistoryItem[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [editingGoal, setEditingGoal] = useState<{
		goalId: number
		setCount: string
	} | null>(null)

	useEffect(() => {
		if (activeTab === "goals") {
			loadExerciseGoals()
		} else if (activeTab === "history") {
			loadExerciseHistory()
		}
	}, [activeTab])

	const loadExerciseGoals = async () => {
		try {
			setLoading(true)
			setError(null)
			const response = await getExerciseGoals(patient.phoneNumber)
			setExerciseGoals(response.content)
		} catch (error: any) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	const loadExerciseHistory = async () => {
		try {
			setLoading(true)
			setError(null)
			const response = await getExerciseHistory(patient.phoneNumber)
			setExerciseHistory(response.content)
		} catch (error: any) {
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	const handleEditInfo = () => {
		navigation.navigate("EditInfo", {
			patientInfo: {
				name: patient.name,
				phoneNumber: patient.phoneNumber,
				gender: patient.gender,
			},
		})
	}

	const handleEditGoal = (goal: ExerciseGoalItem) => {
		setEditingGoal({
			goalId: goal.goalId,
			setCount: goal.setCount.toString(),
		})
	}

	const handleSaveGoal = async () => {
		if (!editingGoal) return

		const setCount = parseInt(editingGoal.setCount)

		if (isNaN(setCount) || setCount <= 0) {
			Alert.alert("입력 오류", "세트 수는 1 이상의 숫자여야 합니다.")
			return
		}

		try {
			console.log("운동 목표 수정 시도:", {
				phoneNumber: patient.phoneNumber,
				goalId: editingGoal.goalId,
				setCount,
			})

			await updateExerciseGoal(patient.phoneNumber, editingGoal.goalId, setCount)

			// UI 즉시 업데이트
			setExerciseGoals((prevGoals) =>
				prevGoals.map((goal) => (goal.goalId === editingGoal.goalId ? { ...goal, setCount } : goal))
			)

			Alert.alert("성공", "운동 목표가 수정되었습니다.")
			setEditingGoal(null)

			// 서버에서 최신 데이터 다시 로드
			await loadExerciseGoals()
		} catch (error: any) {
			Alert.alert("오류", error.message || "운동 목표 수정에 실패했습니다.")
		}
	}

	const renderTabContent = () => {
		if (loading) {
			return (
				<View style={styles.centerContent}>
					<Text>로딩 중...</Text>
				</View>
			)
		}

		if (error) {
			return (
				<View style={styles.centerContent}>
					<Text style={styles.errorText}>{error}</Text>
				</View>
			)
		}

		switch (activeTab) {
			case "info":
				return (
					<View style={styles.tabContent}>
						<View style={styles.infoHeader}>
							<Text style={styles.infoTitle}>기본 정보</Text>
							<TouchableOpacity style={styles.editButton} onPress={handleEditInfo}>
								<Icon name="edit" size={20} color="#fff" />
								<Text style={styles.editButtonText}>수정</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>이름</Text>
							<Text style={styles.infoValue}>{patient.name}</Text>
						</View>
						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>전화번호</Text>
							<Text style={styles.infoValue}>{patient.phoneNumber}</Text>
						</View>
						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>성별</Text>
							<Text style={styles.infoValue}>{patient.gender === "MALE" ? "남성" : "여성"}</Text>
						</View>
						<View style={styles.infoItem}>
							<Text style={styles.infoLabel}>최근 접속</Text>
							<Text style={styles.infoValue}>{new Date(patient.lastLogin).toLocaleString()}</Text>
						</View>
					</View>
				)

			case "goals":
				return (
					<ScrollView style={styles.tabContent}>
						{exerciseGoals.map((goal) => (
							<View key={goal.goalId} style={styles.goalItem}>
								<View style={styles.goalHeader}>
									<View style={styles.goalInfo}>
										<Text style={styles.exerciseType}>{goal.exerciseType}</Text>
										<Text style={styles.goalTitle}>{goal.exerciseName}</Text>
										<View style={styles.goalDetails}>
											<Text style={styles.goalText}>세트 수: {goal.setCount}세트</Text>
											{goal.duration > 0 && (
												<Text style={styles.goalText}>유지 시간: {goal.duration}초</Text>
											)}
										</View>
									</View>
									<TouchableOpacity style={styles.editButton} onPress={() => handleEditGoal(goal)}>
										<Icon name="edit" size={20} color="#fff" />
										<Text style={styles.editButtonText}>수정</Text>
									</TouchableOpacity>
								</View>
							</View>
						))}
					</ScrollView>
				)

			case "history":
				return (
					<ScrollView style={styles.tabContent}>
						{exerciseHistory.map((history) => (
							<View key={history.historyId} style={styles.historyItem}>
								<View style={styles.historyHeader}>
									<View>
										<Text style={styles.historyTitle}>{history.exerciseName}</Text>
										<Text style={styles.dateText}>
											{new Date(history.createdAt).toLocaleDateString()}
										</Text>
									</View>
									<Text
										style={[
											styles.historyStatus,
											history.status === "COMPLETE"
												? styles.statusComplete
												: history.status === "PROGRESS"
												? styles.statusProgress
												: styles.statusIncomplete,
										]}
									>
										{history.status === "COMPLETE"
											? "완료"
											: history.status === "PROGRESS"
											? "진행중"
											: "미완료"}
									</Text>
								</View>
								<View style={styles.historyDetails}>
									<Text style={styles.historyText}>세트 수: {history.setCount}세트</Text>
									{history.duration > 0 && (
										<Text style={styles.historyText}>수행 시간: {history.duration}초</Text>
									)}
								</View>
							</View>
						))}
					</ScrollView>
				)
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>{patient.name}님의 정보</Text>
			</View>

			<View style={styles.tabBar}>
				<TouchableOpacity
					style={[styles.tab, activeTab === "info" && styles.activeTab]}
					onPress={() => setActiveTab("info")}
				>
					<Icon name="person" size={20} color={activeTab === "info" ? "#76DABF" : "#666"} />
					<Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>
						기본 정보
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.tab, activeTab === "goals" && styles.activeTab]}
					onPress={() => setActiveTab("goals")}
				>
					<Icon name="flag" size={20} color={activeTab === "goals" ? "#76DABF" : "#666"} />
					<Text style={[styles.tabText, activeTab === "goals" && styles.activeTabText]}>
						운동 목표
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.tab, activeTab === "history" && styles.activeTab]}
					onPress={() => setActiveTab("history")}
				>
					<Icon name="history" size={20} color={activeTab === "history" ? "#76DABF" : "#666"} />
					<Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>
						운동 기록
					</Text>
				</TouchableOpacity>
			</View>

			{renderTabContent()}

			<Modal visible={editingGoal !== null} transparent={true} animationType="fade">
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>운동 목표 수정</Text>

						<Text style={styles.modalLabel}>세트 수</Text>
						<TextInput
							style={styles.modalInput}
							value={editingGoal?.setCount}
							onChangeText={(text) =>
								setEditingGoal((prev) => (prev ? { ...prev, setCount: text } : null))
							}
							keyboardType="numeric"
							placeholder="세트 수 입력"
						/>

						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[styles.modalButton, styles.cancelButton]}
								onPress={() => setEditingGoal(null)}
							>
								<Text style={styles.cancelButtonText}>취소</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalButton, styles.saveButton]}
								onPress={handleSaveGoal}
							>
								<Text style={styles.saveButtonText}>저장</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f9f9f9",
	},
	header: {
		padding: 16,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	tabBar: {
		flexDirection: "row",
		backgroundColor: "#fff",
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	tab: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		gap: 4,
	},
	activeTab: {
		borderBottomWidth: 2,
		borderBottomColor: "#76DABF",
	},
	tabText: {
		fontSize: 14,
		color: "#666",
	},
	activeTabText: {
		color: "#76DABF",
		fontWeight: "bold",
	},
	tabContent: {
		flex: 1,
		padding: 16,
	},
	centerContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	errorText: {
		color: "#ff6b6b",
		textAlign: "center",
	},
	infoItem: {
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 8,
		marginBottom: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	infoLabel: {
		fontSize: 16,
		color: "#666",
	},
	infoValue: {
		fontSize: 16,
		color: "#333",
		fontWeight: "500",
	},
	goalItem: {
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 8,
		marginBottom: 12,
	},
	goalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 2,
	},
	goalInfo: {
		flex: 1,
		marginRight: 12,
	},
	goalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 2,
		flexShrink: 1,
	},
	goalDetails: {
		gap: 4,
	},
	goalText: {
		fontSize: 14,
		color: "#666",
	},
	historyItem: {
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 8,
		marginBottom: 12,
	},
	historyHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	historyTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
	},
	historyStatus: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		overflow: "hidden",
		fontSize: 12,
		fontWeight: "bold",
	},
	statusComplete: {
		backgroundColor: "#76DABF",
		color: "#fff",
	},
	statusProgress: {
		backgroundColor: "#FFB74D",
		color: "#fff",
	},
	statusIncomplete: {
		backgroundColor: "#ff6b6b",
		color: "#fff",
	},
	historyDetails: {
		gap: 4,
	},
	historyText: {
		fontSize: 14,
		color: "#666",
	},
	infoHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	infoTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	editButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#76DABF",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 8,
		gap: 4,
		marginTop: 8,
	},
	editButtonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "500",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 20,
		width: "80%",
		maxWidth: 400,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 16,
		color: "#333",
	},
	modalLabel: {
		fontSize: 14,
		color: "#666",
		marginBottom: 4,
	},
	modalInput: {
		backgroundColor: "#f8f8f8",
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: 8,
	},
	modalButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		minWidth: 80,
		alignItems: "center",
	},
	saveButton: {
		backgroundColor: "#76DABF",
	},
	saveButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	cancelButton: {
		backgroundColor: "#ff6b6b",
	},
	cancelButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	dateText: {
		fontSize: 12,
		color: "#666",
		marginTop: 2,
	},
	exerciseType: {
		fontSize: 12,
		color: "#666",
		backgroundColor: "#f0f0f0",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginTop: 4,
		marginBottom: 8,
		alignSelf: "flex-start",
	},
})

export default PatientDetailScreen

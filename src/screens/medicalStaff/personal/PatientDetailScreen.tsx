import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../../../types/navigation"
import { Patient } from "../../../types/patient"
import { getExerciseGoals, ExerciseGoalItem } from "../../../apis/exercise"
import { getExerciseHistory, ExerciseHistoryItem } from "../../../apis/exercise"
import Icon from "react-native-vector-icons/MaterialIcons"

type PatientDetailScreenRouteProp = RouteProp<RootStackParamList, "PatientDetail">

type TabType = "info" | "goals" | "history"

const PatientDetailScreen = () => {
	const route = useRoute<PatientDetailScreenRouteProp>()
	const { patient } = route.params
	const [activeTab, setActiveTab] = useState<TabType>("info")
	const [exerciseGoals, setExerciseGoals] = useState<ExerciseGoalItem[]>([])
	const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistoryItem[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

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
								<Text style={styles.goalTitle}>{goal.exerciseName}</Text>
								<View style={styles.goalDetails}>
									<Text style={styles.goalText}>반복 횟수: {goal.repeatCount}회</Text>
									<Text style={styles.goalText}>세트 수: {goal.setCount}세트</Text>
									{goal.duration > 0 && <Text style={styles.goalText}>유지 시간: {goal.duration}초</Text>}
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
									<Text style={styles.historyTitle}>{history.exerciseName}</Text>
									<Text style={[styles.historyStatus, history.status === "COMPLETE" ? styles.statusComplete : history.status === "PROGRESS" ? styles.statusProgress : styles.statusIncomplete]}>
										{history.status === "COMPLETE" ? "완료" : history.status === "PROGRESS" ? "진행중" : "미완료"}
									</Text>
								</View>
								<View style={styles.historyDetails}>
									<Text style={styles.historyText}>반복 횟수: {history.repeatCount}회</Text>
									<Text style={styles.historyText}>세트 수: {history.setCount}세트</Text>
									{history.duration && <Text style={styles.historyText}>수행 시간: {history.duration}초</Text>}
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
				<TouchableOpacity style={[styles.tab, activeTab === "info" && styles.activeTab]} onPress={() => setActiveTab("info")}>
					<Icon name="person" size={20} color={activeTab === "info" ? "#76DABF" : "#666"} />
					<Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>기본 정보</Text>
				</TouchableOpacity>

				<TouchableOpacity style={[styles.tab, activeTab === "goals" && styles.activeTab]} onPress={() => setActiveTab("goals")}>
					<Icon name="flag" size={20} color={activeTab === "goals" ? "#76DABF" : "#666"} />
					<Text style={[styles.tabText, activeTab === "goals" && styles.activeTabText]}>운동 목표</Text>
				</TouchableOpacity>

				<TouchableOpacity style={[styles.tab, activeTab === "history" && styles.activeTab]} onPress={() => setActiveTab("history")}>
					<Icon name="history" size={20} color={activeTab === "history" ? "#76DABF" : "#666"} />
					<Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>운동 기록</Text>
				</TouchableOpacity>
			</View>

			{renderTabContent()}
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
	goalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
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
})

export default PatientDetailScreen

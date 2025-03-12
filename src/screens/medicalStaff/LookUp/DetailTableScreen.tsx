import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from "react-native"
import { LineChart } from "react-native-chart-kit"
import Icon from "react-native-vector-icons/MaterialIcons"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../../../types/navigation"
import { getExerciseHistory, ExerciseHistoryItem } from "../../../apis/exercise"

type DetailTableScreenRouteProp = RouteProp<RootStackParamList, "DetailTable">

export default function DetailTableScreen() {
	const route = useRoute<DetailTableScreenRouteProp>()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [exerciseHistory, setExerciseHistory] = useState<ExerciseHistoryItem[]>([])

	useEffect(() => {
		loadExerciseHistory()
	}, [])

	const loadExerciseHistory = async () => {
		try {
			setLoading(true)
			setError(null)
			// 현재는 첫 번째 선택된 환자의 기록만 조회
			const patientId = route.params.patientIds[0]
			const history = await getExerciseHistory(patientId)
			setExerciseHistory(history.content)
		} catch (error: any) {
			console.error("운동 기록 로딩 오류:", error)
			setError(error.message)
		} finally {
			setLoading(false)
		}
	}

	const calculateCompletionRate = (histories: ExerciseHistoryItem[]) => {
		if (histories.length === 0) return 0
		const completed = histories.filter((h) => h.status === "COMPLETE").length
		return (completed / histories.length) * 100
	}

	const chartData = {
		labels: exerciseHistory.map((_, index) => `${index + 1}일`),
		datasets: [
			{
				data: exerciseHistory.map(() => calculateCompletionRate(exerciseHistory)),
			},
		],
	}

	if (loading) {
		return (
			<View style={styles.centerContainer}>
				<ActivityIndicator size="large" color="#76DABF" />
			</View>
		)
	}

	if (error) {
		return (
			<View style={styles.centerContainer}>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		)
	}

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.analysisText}>
				<Icon name="analytics" size={24} color="#000" /> 운동 수행 분석
			</Text>

			<View style={styles.scoreTable}>
				<View style={styles.headerRow}>
					<Text style={styles.headerCell}>
						<Icon name="person" size={20} color="#000" /> 환자명
					</Text>
					<Text style={styles.headerCell}>{exerciseHistory[0]?.memberName || "정보 없음"}</Text>
				</View>

				<View style={styles.row}>
					<Text style={styles.cell}>
						<Icon name="fitness-center" size={20} color="#000" /> 총 운동 수
					</Text>
					<Text style={styles.cell}>{exerciseHistory.length}개</Text>
				</View>

				<View style={styles.row}>
					<Text style={styles.cell}>
						<Icon name="check-circle" size={20} color="#000" /> 완료된 운동
					</Text>
					<Text style={styles.cell}>{exerciseHistory.filter((h) => h.status === "COMPLETE").length}개</Text>
				</View>

				<View style={styles.row}>
					<Text style={styles.cell}>
						<Icon name="trending-up" size={20} color="#000" /> 달성률
					</Text>
					<Text style={styles.cell}>{calculateCompletionRate(exerciseHistory).toFixed(1)}%</Text>
				</View>
			</View>

			<Text style={styles.graphTitle}>
				<Icon name="timeline" size={20} color="#000" /> 운동 달성률 추이
			</Text>

			<View style={styles.chartContainer}>
				<LineChart
					data={chartData}
					width={Dimensions.get("window").width - 40}
					height={220}
					chartConfig={{
						backgroundColor: "#ffffff",
						backgroundGradientFrom: "#ffffff",
						backgroundGradientTo: "#ffffff",
						decimalPlaces: 0,
						color: (opacity = 1) => `rgba(118, 218, 191, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
						style: {
							borderRadius: 16,
						},
					}}
					bezier
					style={styles.chart}
				/>
			</View>

			<Text style={styles.sectionTitle}>
				<Icon name="list" size={20} color="#000" /> 운동 기록 상세
			</Text>

			{exerciseHistory.map((history, index) => (
				<View key={history.historyId} style={styles.exerciseItem}>
					<View style={styles.exerciseHeader}>
						<Text style={styles.exerciseName}>{history.exerciseName}</Text>
						<Text style={[styles.status, history.status === "COMPLETE" ? styles.statusComplete : history.status === "PROGRESS" ? styles.statusProgress : styles.statusIncomplete]}>
							{history.status === "COMPLETE" ? "완료" : history.status === "PROGRESS" ? "진행중" : "미완료"}
						</Text>
					</View>
					<View style={styles.exerciseDetails}>
						<Text style={styles.detailText}>반복 횟수: {history.repeatCount}회</Text>
						<Text style={styles.detailText}>세트 수: {history.setCount}세트</Text>
						{history.duration && <Text style={styles.detailText}>수행 시간: {history.duration}초</Text>}
					</View>
				</View>
			))}
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#ffffff",
	},
	centerContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#ffffff",
	},
	errorText: {
		color: "#ff6b6b",
		fontSize: 16,
		textAlign: "center",
	},
	analysisText: {
		fontSize: 24,
		fontWeight: "500",
		color: "#000000",
		marginBottom: 20,
	},
	scoreTable: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		marginBottom: 20,
		backgroundColor: "#fff",
		elevation: 2,
	},
	headerRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderColor: "#ddd",
		backgroundColor: "#f8f9fa",
	},
	row: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderColor: "#ddd",
	},
	headerCell: {
		flex: 1,
		padding: 12,
		fontWeight: "bold",
		textAlign: "center",
	},
	cell: {
		flex: 1,
		padding: 12,
		textAlign: "center",
	},
	graphTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#000000",
	},
	chartContainer: {
		backgroundColor: "#ffffff",
		borderRadius: 12,
		padding: 10,
		marginBottom: 20,
		elevation: 2,
	},
	chart: {
		marginVertical: 8,
		borderRadius: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		marginTop: 20,
		color: "#000000",
	},
	exerciseItem: {
		backgroundColor: "#f8f9fa",
		borderRadius: 8,
		padding: 15,
		marginBottom: 10,
		elevation: 1,
	},
	exerciseHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	exerciseName: {
		fontSize: 16,
		fontWeight: "500",
		color: "#000000",
		flex: 1,
	},
	status: {
		paddingHorizontal: 10,
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
	exerciseDetails: {
		marginTop: 8,
	},
	detailText: {
		fontSize: 14,
		color: "#666",
		marginBottom: 4,
	},
})

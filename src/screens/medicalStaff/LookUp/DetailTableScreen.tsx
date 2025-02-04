import React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { exerciseScores, exerciseHistory } from "../../../mock/exerciseData"

export default function DetailTableScreen() {
	const chartData = {
		labels: exerciseHistory.map((item) => ""), // x축 라벨은 빈 문자열로 처리
		datasets: [
			{
				data: exerciseHistory.map((item) => item.score),
			},
		],
	}

	return (
		<View style={styles.container}>
			{/* 점수 테이블 */}
			<View style={styles.scoreTable}>
				<View style={styles.headerRow}>
					<Text style={styles.headerCell}>환자명</Text>
					<Text style={styles.headerCell}>홍길동</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.cell}>일간 운동 점수</Text>
					<Text style={styles.cell}>{exerciseScores.daily}</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.cell}>주간 운동 점수</Text>
					<Text style={styles.cell}>{exerciseScores.weekly}</Text>
				</View>
				<View style={styles.row}>
					<Text style={styles.cell}>월간 운동 점수</Text>
					<Text style={styles.cell}>{exerciseScores.monthly}</Text>
				</View>
			</View>

			{/* 그래프 제목 */}
			<Text style={styles.graphTitle}>운동 추이</Text>

			{/* 라인 차트 */}
			<LineChart
				data={chartData}
				width={Dimensions.get("window").width - 40}
				height={220}
				chartConfig={{
					backgroundColor: "#ffffff",
					backgroundGradientFrom: "#ffffff",
					backgroundGradientTo: "#ffffff",
					decimalPlaces: 0,
					color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
					style: {
						borderRadius: 16,
					},
				}}
				bezier
				style={styles.chart}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#ffffff",
	},
	scoreTable: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		marginBottom: 20,
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
	},
	chart: {
		marginVertical: 8,
		borderRadius: 16,
	},
})

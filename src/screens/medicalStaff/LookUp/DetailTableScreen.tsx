import React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { exerciseHistory } from "../../../mock/exerciseData"

export default function DetailTableScreen() {
	const goalItems = [
		{ label: "일간 목표 달성률", value: "80%" },
		{ label: "주간 목표 달성률", value: "75%" },
		{ label: "월간 목표 달성률", value: "85%" },
	]

	const chartData = {
		labels: exerciseHistory.map(() => ""),
		datasets: [{ data: exerciseHistory.map((item) => item.score) }],
	}

	return (
		<View style={styles.container}>
			<Text style={styles.analysisText}>운동 목표 달성률 분석</Text>

			<View style={styles.scoreTable}>
				<View style={styles.headerRow}>
					<Text style={styles.headerCell}>환자명</Text>
					<Text style={styles.headerCell}>홍길동</Text>
				</View>

				{goalItems.map((item, index) => (
					<View key={index} style={styles.row}>
						<Text style={styles.cell}>{item.label}</Text>
						<Text style={styles.cell}>{item.value}</Text>
					</View>
				))}
			</View>

			<Text style={styles.graphTitle}>운동 목표 달성 추이</Text>

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
					}}
					bezier
				/>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#ffffff",
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
		backgroundColor: "#f1f1f1",
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
		paddingTop: 5,
		paddingRight: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 1,
	},
})

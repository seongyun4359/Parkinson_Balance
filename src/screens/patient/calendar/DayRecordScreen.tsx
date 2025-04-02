import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import CalendarComponent from "../../../components/patient/Calendar"
import ScreenHeader from "../../../components/patient/ScreenHeader"
import { RouteProp, useRoute } from "@react-navigation/native"
import { RootStackParamList } from "../../../navigation/Root"
import { getExerciseHistory, getExercisePrescriptionsByDate } from "../../../apis/exercisePrescription"

import type { ExercisePrescriptionItem } from "../../../apis/exercisePrescription"

//  createdAt 필드를 포함한 타입 정의
interface ExerciseHistoryItem {
	exerciseName: string
	setCount: number
	createdAt?: string // API에서 createdAt이 없을 수도 있으므로 옵셔널 처리
}

type DayRecordScreenRouteProp = RouteProp<RootStackParamList, "DayRecord">

const DayRecordScreen = () => {
	const route = useRoute<DayRecordScreenRouteProp>()
	const today = new Date().toISOString().split("T")[0]
	const date = route.params?.date || today

	const [exerciseGoals, setExerciseGoals] = useState<ExercisePrescriptionItem[]>([])
	const [exerciseHistory, setExerciseHistory] = useState<Record<string, number>>({})
	const [loading, setLoading] = useState(true)
	const [completedDates, setCompletedDates] = useState<Set<string>>(new Set())

	useEffect(() => {
		const fetchExerciseData = async () => {
			try {
				setLoading(true)
	
				const goalsResponse = await getExercisePrescriptionsByDate(date)
				const goalsData = goalsResponse.content || []
	
				const historyData = await getExerciseHistory(date)
	
				const historyMap: Record<string, Record<string, number>> = {}
	
				;(historyData.content as ExerciseHistoryItem[]).forEach((item) => {
					const createdDate = item.createdAt?.split("T")[0]
					if (createdDate) {
						if (!historyMap[createdDate]) historyMap[createdDate] = {}
						historyMap[createdDate][item.exerciseName] = item.setCount ?? 0
					}
				})
	
				setExerciseGoals(goalsData)
				setExerciseHistory(historyMap[date] || {})
	
				const updatedCompletedDates = new Set(completedDates)
	
				Object.keys(historyMap).forEach((day) => {
					const allDone = goalsData.every((goal) => {
						const done = historyMap[day]?.[goal.exerciseName] ?? 0
						return done >= goal.setCount
					})
	
					if (allDone) updatedCompletedDates.add(day)
				})
	
				setCompletedDates(updatedCompletedDates)
			} catch (error) {
				console.error("🚨 운동 기록 불러오기 오류:", error)
			} finally {
				setLoading(false)
			}
		}
		fetchExerciseData()
	}, [date])
	
	if (loading) {
		return <ActivityIndicator size="large" color="#76DABF" />
	}

	return (
		<View style={styles.container}>
			<ScreenHeader />

			{/*  Set을 Array로 변환하여 안전하게 CalendarComponent로 전달 */}
			<CalendarComponent completedDates={Array.from(completedDates)} />

			<ScrollView style={styles.recordContainer}>
				<Text style={styles.dateText}>{date} 기록</Text>

				{exerciseGoals.length === 0 ? (
					<Text style={styles.noRecordText}>운동 목표가 없습니다.</Text>
				) : (
					exerciseGoals.map((exercise) => {
						const completedSets = exerciseHistory[exercise.exerciseName] || 0
						const totalSets = exercise.setCount || 0
						const progress =
							totalSets > 0 ? parseFloat(((completedSets / totalSets) * 100).toFixed(0)) : 0
						const isCompleted = completedSets >= totalSets

						return (
							<View
								key={exercise.exerciseName}
								style={[
									styles.recordBox,
									isCompleted ? styles.completedExercise : styles.pendingExercise,
								]}
							>
								<Text style={styles.recordLabel}>{exercise.exerciseName}</Text>
								<Text style={styles.recordResult}>
									{completedSets}/{totalSets} 세트 | {progress}%
								</Text>
							</View>
						)
					})
				)}
			</ScrollView>
		</View>
	)
}

export default DayRecordScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	recordContainer: {
		marginTop: 16,
		paddingHorizontal: 16,
	},
	dateText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#76DABF",
		marginBottom: 12,
	},
	noRecordText: {
		fontSize: 16,
		color: "#888",
		textAlign: "center",
		marginTop: 20,
	},
	recordBox: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 12,
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		backgroundColor: "#FFFFFF",
		borderColor: "#76DABF",
	},
	recordLabel: {
		fontSize: 16,
		fontWeight: "bold",
	},
	recordResult: {
		fontSize: 16,
		fontWeight: "bold",
		color: "blue",
	},
	completedExercise: {
		backgroundColor: "#76DABF",
		borderColor: "#76DABF",
	},
	pendingExercise: {
		backgroundColor: "#FFFFFF",
		borderColor: "#76DABF",
	},
})

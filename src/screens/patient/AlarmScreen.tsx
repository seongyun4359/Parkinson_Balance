import React, { useState } from "react"
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	Modal,
	FlatList,
	Switch,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import DateTimePicker from "@react-native-community/datetimepicker"
import ScreenHeader from "../../components/patient/ScreenHeader"
import { RootStackParamList } from "../../navigation/Root"

type AlarmScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	"Alarm"
>

interface Alarm {
	id: number
	time: string
	days: string[]
	enabled: boolean
}

const AlarmScreen = () => {
	const navigation = useNavigation<AlarmScreenNavigationProp>()

	const [modalVisible, setModalVisible] = useState(false)
	const [time, setTime] = useState(new Date())
	const [selectedDays, setSelectedDays] = useState<string[]>([])
	const [alarms, setAlarms] = useState<Alarm[]>([])

	const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"]

	const handleTimeChange = (event: any, selectedTime?: Date) => {
		if (selectedTime) {
			setTime(selectedTime)
			setModalVisible(false)
		}
	}

	const toggleDay = (day: string) => {
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
		)
	}

	const handleAddAlarm = () => {
		if (selectedDays.length === 0) return

		const formattedTime = time.toLocaleTimeString("ko-KR", {
			hour: "2-digit",
			minute: "2-digit",
		})
		const newAlarm: Alarm = {
			id: Date.now(),
			time: formattedTime,
			days: selectedDays,
			enabled: true,
		}

		setAlarms([...alarms, newAlarm])
		setModalVisible(false)
		setSelectedDays([])
	}

	const handleDeleteAlarm = (id: number) => {
		setAlarms(alarms.filter((alarm) => alarm.id !== id))
	}

	const toggleAlarmEnabled = (id: number) => {
		setAlarms(
			alarms.map((alarm) =>
				alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
			)
		)
	}

	return (
		<View style={styles.container}>
			<ScreenHeader />

			<TouchableOpacity
				style={styles.addButton}
				onPress={() => setModalVisible(true)}
			>
				<Text style={styles.addButtonText}>알람 추가하기</Text>
			</TouchableOpacity>

			<FlatList
				data={alarms}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View style={styles.alarmItem}>
						<Text style={styles.alarmTime}>{item.time}</Text>
						<Text style={styles.alarmDays}>
							{daysOfWeek.filter((day) => item.days.includes(day)).join(" ")}
						</Text>

						<Switch
							value={item.enabled}
							onValueChange={() => toggleAlarmEnabled(item.id)}
						/>

						<TouchableOpacity onPress={() => handleDeleteAlarm(item.id)}>
							<Text style={styles.deleteButton}>x</Text>
						</TouchableOpacity>
					</View>
				)}
			/>

			{!modalVisible && (
				<TouchableOpacity
					style={styles.completeButton}
					onPress={() => navigation.navigate("PatientHome")}
				>
					<Text style={styles.completeButtonText}>완료</Text>
				</TouchableOpacity>
			)}

			<Modal visible={modalVisible} transparent animationType="slide">
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>알람 추가</Text>

						<View style={styles.timePickerContainer}>
							<DateTimePicker
								value={time}
								mode="time"
								is24Hour={false}
								display="spinner"
								onChange={handleTimeChange}
							/>
						</View>

						<View style={styles.daysContainer}>
							{daysOfWeek.map((day) => (
								<TouchableOpacity
									key={day}
									style={[
										styles.dayButton,
										selectedDays.includes(day) && styles.selectedDay,
									]}
									onPress={() => toggleDay(day)}
								>
									<Text style={styles.dayText}>{day}</Text>
								</TouchableOpacity>
							))}
						</View>

						<View style={styles.buttonRow}>
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={() => setModalVisible(false)}
							>
								<Text style={styles.cancelButtonText}>취소</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.addAlarmButton}
								onPress={handleAddAlarm}
							>
								<Text style={styles.addAlarmButtonText}>추가하기</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	)
}

export default AlarmScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		paddingTop: 40,
		justifyContent: "space-between",
	},
	addButton: {
		backgroundColor: "#76DABF",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		marginBottom: 20,
	},
	addButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	alarmItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		width: "90%",
		padding: 15,
		borderWidth: 1,
		borderColor: "#76DABF",
		borderRadius: 10,
		marginBottom: 10,
	},
	alarmTime: {
		fontSize: 24,
		fontWeight: "bold",
	},
	alarmDays: {
		fontSize: 14,
		color: "#666",
	},
	deleteButton: {
		fontSize: 20,
		marginLeft: 10,
		color: "black",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		width: "80%",
		alignItems: "center",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	selectedTime: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 10,
	},
  timePickerContainer: {
    marginVertical: 10,
  },
	daysContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginVertical: 10,
	},
	dayButton: {
		padding: 8,
		marginHorizontal: 4,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: "#76DABF",
	},
	selectedDay: {
		backgroundColor: "#76DABF",
	},
	dayText: {
		fontSize: 16,
	},
	completeButton: {
		backgroundColor: "#76DABF",
		paddingVertical: 12,
		paddingHorizontal: 40,
		borderRadius: 8,
		marginBottom: 30,
	},
	completeButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginTop: 20,
	},
	cancelButton: {
		backgroundColor: "#ccc",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		flex: 1,
		marginRight: 5,
	},
	cancelButtonText: {
		color: "#000",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
	addAlarmButton: {
		backgroundColor: "#76DABF",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		flex: 1,
		marginLeft: 5,
	},
	addAlarmButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
})

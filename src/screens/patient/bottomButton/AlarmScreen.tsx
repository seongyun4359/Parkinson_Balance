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
import DateTimePickerModal from "react-native-modal-datetime-picker"
import ScreenHeader from "../../../components/patient/ScreenHeader"
import { RootStackParamList } from "../../../navigation/Root"
import Icon from "react-native-vector-icons/MaterialIcons"

interface Alarm {
	id: number
	time: string
	period: string
	days: string[]
	enabled: boolean
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Alarm">

const AlarmScreen = () => {
	const navigation = useNavigation<HomeScreenNavigationProp>()
	const [modalVisible, setModalVisible] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [editingAlarmId, setEditingAlarmId] = useState<number | null>(null) 
	const [time, setTime] = useState(new Date())
	const [selectedDays, setSelectedDays] = useState<string[]>([])
	const [alarms, setAlarms] = useState<Alarm[]>([])
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

	const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"]

	const showDatePicker = () => setDatePickerVisibility(true)
	const hideDatePicker = () => setDatePickerVisibility(false)

	const handleConfirm = (selectedTime: Date) => {
		setTime(selectedTime)
		hideDatePicker()
	}

	const toggleDay = (day: string) => {
		setSelectedDays((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
		)
	}

	const handleSaveAlarm = () => {
		if (selectedDays.length === 0) return

		const hours = time.getHours()
		const minutes = time.getMinutes()
		const formattedTime = `${hours % 12 || 12}:${minutes
			.toString()
			.padStart(2, "0")}`
		const period = hours >= 12 ? "오후" : "오전"

		if (isEditing && editingAlarmId !== null) {
			setAlarms((prev) =>
				prev.map((alarm) =>
					alarm.id === editingAlarmId
						? { ...alarm, time: formattedTime, period, days: selectedDays }
						: alarm
				)
			)
		} else {
			const newAlarm: Alarm = {
				id: Date.now(),
				time: formattedTime,
				period: period,
				days: selectedDays,
				enabled: true,
			}
			setAlarms([...alarms, newAlarm])
		}

		setModalVisible(false)
		setSelectedDays([])
		setIsEditing(false)
		setEditingAlarmId(null)
	}

	const handleDeleteAlarm = (id: number) => {
		setAlarms((prev) => prev.filter((alarm) => alarm.id !== id))
	}

	const handleEditAlarm = (alarm: Alarm) => {
		setIsEditing(true)
		setEditingAlarmId(alarm.id)
		setTime(new Date()) 
		setSelectedDays(alarm.days)
		setModalVisible(true)
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
						<View style={styles.timeContainer}>
							<Text style={styles.period}>{item.period}</Text>
							<Text style={styles.alarmTime}>{item.time}</Text>
						</View>
						<View style={styles.alarmOptions}>
							<Text style={styles.alarmDays}>{item.days.join(" ")}</Text>
							<Switch
								value={item.enabled}
								onValueChange={() =>
									setAlarms((prev) =>
										prev.map((alarm) =>
											alarm.id === item.id
												? { ...alarm, enabled: !alarm.enabled }
												: alarm
										)
									)
								}
							/>
							<TouchableOpacity onPress={() => handleEditAlarm(item)}>
								<Icon name="edit" size={24} />
							</TouchableOpacity>
							<TouchableOpacity onPress={() => handleDeleteAlarm(item.id)}>
								<Icon name="delete" size={24} />
							</TouchableOpacity>
						</View>
					</View>
				)}
			/>

			<TouchableOpacity
				style={styles.completeButton}
				onPress={() => navigation.navigate("PatientHome")}
			>
				<Text style={styles.completeButtonText}>완료</Text>
			</TouchableOpacity>
			{/* 알람 추가 / 수정 모달 */}
			<Modal visible={modalVisible} transparent animationType="fade">
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>
								{isEditing ? "알람 수정" : "알람 추가"}
							</Text>
							<TouchableOpacity onPress={() => setModalVisible(false)}>
								<Icon name="close" size={24} color="#666" />
							</TouchableOpacity>
						</View>

						{/* 시간 선택 버튼 */}
						<TouchableOpacity
							style={styles.timeSelectButton}
							onPress={showDatePicker}
						>
							<Text style={styles.timeSelectText}>
								{time.toLocaleTimeString("ko-KR", {
									hour: "2-digit",
									minute: "2-digit",
									hour12: true,
								})}
							</Text>
						</TouchableOpacity>

						{/* 시간 선택 모달 */}
						<DateTimePickerModal
							isVisible={isDatePickerVisible}
							mode="time"
							is24Hour={false}
							onConfirm={handleConfirm}
							onCancel={hideDatePicker}
						/>

						{/* 요일 선택 */}
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
									<Text
										style={[
											styles.dayText,
											selectedDays.includes(day) && styles.selectedDayText,
										]}
									>
										{day}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						{/* 추가하기 버튼 */}
						<TouchableOpacity
							style={styles.addAlarmButton}
							onPress={handleSaveAlarm}
						>
							<Text style={styles.addAlarmButtonText}>
								{isEditing ? "수정하기" : "추가하기"}
							</Text>
						</TouchableOpacity>
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
		width: "95%",
		padding: 15,
		borderWidth: 2,
		borderColor: "#76DABF",
		borderRadius: 10,
		marginBottom: 10,
	},
	timeContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	period: {
		fontSize: 16,
		marginRight: 5,
		color: "#333",
	},
	alarmTime: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#000",
	},
	alarmOptions: {
		flexDirection: "row",
		alignItems: "center",
	},
	alarmDays: {
		fontSize: 14,
		color: "#666",
		marginRight: 10,
	},
	editButton: {
		fontSize: 18,
		color: "#4A90E2",
		marginLeft: 10,
	},
	deleteButton: {
		fontSize: 18,
		color: "#E74C3C",
		marginLeft: 10,
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
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		width: "80%",
		alignItems: "center",
	},
	modalHeader: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 15,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	timeSelectButton: {
		backgroundColor: "#F0F0F0",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		marginBottom: 15,
		width: "100%",
		alignItems: "center",
	},
	timeSelectText: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#000",
	},
	daysContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		marginVertical: 15,
	},
	dayButton: {
		padding: 10,
		margin: 5,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#76DABF",
		width: 40,
		alignItems: "center",
		justifyContent: "center",
	},
	selectedDay: {
		backgroundColor: "#76DABF",
	},
	dayText: {
		fontSize: 16,
		color: "#333",
	},
	selectedDayText: {
		color: "#fff",
		fontWeight: "bold",
	},
	addAlarmButton: {
		backgroundColor: "#76DABF",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		marginTop: 10,
		width: "100%",
		alignItems: "center",
	},
	addAlarmButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
})

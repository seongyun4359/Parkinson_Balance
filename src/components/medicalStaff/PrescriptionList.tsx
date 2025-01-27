import React from "react"
import {
	FlatList,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
} from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { Prescription } from "../../types/prescription"

interface PrescriptionListProps {
	prescriptions: Prescription[]
	onPrescriptionPress: (prescription: Prescription) => void
}

const PrescriptionList = ({
	prescriptions,
	onPrescriptionPress,
}: PrescriptionListProps) => {
	const renderPrescriptionItem = ({ item }: { item: Prescription }) => (
		<View style={styles.prescriptionItem}>
			<Text style={styles.dateText}>{item.date}</Text>
			<TouchableOpacity onPress={() => onPrescriptionPress(item)}>
				<Ionicons name="information-circle-outline" size={24} color="#666" />
			</TouchableOpacity>
		</View>
	)

	return (
		<FlatList
			data={prescriptions}
			renderItem={renderPrescriptionItem}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.listContainer}
			scrollEnabled={false}
			showsVerticalScrollIndicator={false}
		/>
	)
}

const styles = StyleSheet.create({
	listContainer: {
		gap: 12,
		flexGrow: 0,
	},
	prescriptionItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	dateText: {
		fontSize: 18,
		color: "#333",
	},
})

export default PrescriptionList

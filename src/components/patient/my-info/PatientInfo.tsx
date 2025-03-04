import React from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { PatientInfoProps } from "../../../types/patient"

const PatientInfoCard: React.FC<PatientInfoProps> = ({
	patientInfo,
	onPrescriptionPress,
}) => {
	return (
		<View style={styles.infoContainer}>
			<View style={styles.infoBox}>
				<View style={styles.profileSection}>
					<View style={styles.avatarContainer}>
						<Ionicons name="person" size={40} color="#76DABF" />
					</View>
					<View style={styles.basicInfo}>
						<Text style={styles.nameText}>{patientInfo.name}</Text>
						<Text style={styles.subText}>{patientInfo.gender}</Text>
					</View>
				</View>
				<View style={styles.divider} />
				<View style={styles.detailsSection}>
					<View style={styles.detailItem}>
						<Ionicons name="call-outline" size={20} color="#666" />
						<Text style={styles.detailText}>{patientInfo.phoneNumber}</Text>
					</View>
				</View>
			</View>
			<TouchableOpacity
				style={styles.prescriptionBox}
				onPress={onPrescriptionPress}
			>
				<View style={styles.prescriptionHeader}>
					<Ionicons name="document-text" size={24} color="#76DABF" />
					<Text style={styles.prescriptionTitle}>받은 처방 확인하기</Text>
				</View>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	infoContainer: {
		marginVertical: 20,
		gap: 16,
	},
	infoBox: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	profileSection: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	avatarContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#f0f9f6",
		justifyContent: "center",
		alignItems: "center",
	},
	basicInfo: {
		marginLeft: 16,
	},
	nameText: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	subText: {
		fontSize: 16,
		color: "#666",
		marginTop: 4,
	},
	divider: {
		height: 1,
		backgroundColor: "#eee",
		marginVertical: 16,
	},
	detailsSection: {
		gap: 12,
	},
	detailItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	detailText: {
		fontSize: 16,
		color: "#333",
	},
	prescriptionBox: {
		backgroundColor: "#fff",
		borderRadius: 16,
		marginTop: 20,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	prescriptionHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 16,
	},
	prescriptionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	prescriptionImage: {
		width: "100%",
		height: 200,
		borderRadius: 12,
	},
	noImageContainer: {
		height: 200,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f8f8f8",
		borderRadius: 12,
	},
	noImageText: {
		color: "#999",
		marginTop: 8,
	},
})

export default PatientInfoCard

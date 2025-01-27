import React, { useState } from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Image,
	Alert,
} from "react-native"
import mockPatients, { searchPatientByName } from "../../../mock/mock"

const SearchInfoScreen: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("")
	const [patientInfo, setPatientInfo] = useState<any | null>(null)

	const handleSearch = () => {
		const result = searchPatientByName(searchQuery)
		if (result) {
			setPatientInfo(result)
		} else {
			Alert.alert("검색 실패", "해당 환자를 찾을 수 없습니다.")
			setPatientInfo(null)
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder="환자 이름 검색"
					value={searchQuery}
					onChangeText={setSearchQuery}
					placeholderTextColor="#aaa"
				/>
				<TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
					<Text style={styles.searchButtonText}>검색</Text>
				</TouchableOpacity>
			</View>

			{patientInfo ? (
				<View style={styles.infoContainer}>
					<View style={styles.infoBox}>
						<Text style={styles.infoText}>이름: {patientInfo.name}</Text>
						<Text style={styles.infoText}>성별: {patientInfo.gender}</Text>
						<Text style={styles.infoText}>
							휴대폰 번호: {patientInfo.phoneNumber}
						</Text>
					</View>
					<View style={styles.prescriptionBox}>
						<Text style={styles.prescriptionText}>받은 처방</Text>
						<Image
							source={{ uri: "https://example.com/sample-image.png" }}
							style={styles.prescriptionImage}
						/>
					</View>
				</View>
			) : (
				<Text style={styles.placeholderText}>환자 정보를 검색하세요.</Text>
			)}

			<View style={styles.footerButtons}>
				<TouchableOpacity style={styles.footerButton}>
					<Text style={styles.footerButtonText}>알림 전송</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.footerButton}>
					<Text style={styles.footerButtonText}>정보 수정</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 16,
	},
	searchContainer: {
		flexDirection: "row",
		marginBottom: 20,
	},
	searchInput: {
		flex: 1,
		height: 50,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		paddingHorizontal: 10,
		fontSize: 16,
	},
	searchButton: {
		backgroundColor: "#76DABF",
		paddingHorizontal: 20,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		marginLeft: 10,
	},
	searchButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	infoContainer: {
		marginVertical: 20,
	},
	infoBox: {
		backgroundColor: "#f9f9f9",
		padding: 20,
		borderRadius: 8,
		marginBottom: 20,
	},
	infoText: {
		fontSize: 16,
		marginBottom: 10,
		color: "#333",
	},
	prescriptionBox: {
		backgroundColor: "#f9f9f9",
		flexDirection: "row",
		alignItems: "center",
		padding: 20,
		borderRadius: 8,
	},
	prescriptionText: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
	prescriptionImage: {
		width: 50,
		height: 50,
		borderRadius: 8,
	},
	placeholderText: {
		textAlign: "center",
		color: "#aaa",
		fontSize: 16,
		marginVertical: 20,
	},
	footerButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: "auto",
	},
	footerButton: {
		flex: 1,
		height: 50,
		backgroundColor: "#333",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		marginHorizontal: 5,
	},
	footerButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
})

export default SearchInfoScreen

import React from "react"
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import ScreenHeader from "../../components/patient/ScreenHeader"
import Calendar from "../../components/patient/Calendar"
import { RootStackParamList } from "../../navigation/Root"

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>

const HomeScreen = () => {
	const navigation = useNavigation<HomeScreenNavigationProp>()

	return (
		<View style={styles.container}>
			<View style={styles.screenHeader}>
				<ScreenHeader />
			</View>
			<Calendar />
			<View style={styles.menuContainer}>
				<MenuButton
					source={require("../../assets/menu/menu-exercise.png")}
					label="운동 종류"
					onPress={() => navigation.navigate("Category")}
				/>
				<MenuButton
					source={require("../../assets/menu/menu-alarm.png")}
					label="알람"
					onPress={() => navigation.navigate("Alarm")}
				/>
				<MenuButton
					source={require("../../assets/menu/menu-information.png")}
					label="내 정보"
					onPress={() => navigation.navigate("MyInformation")}
				/>
				<MenuButton
					source={require("../../assets/menu/menu-start.png")}
					label="운동 시작"
					onPress={() => navigation.navigate("ExerciseScreen")}
				/>
			</View>
		</View>
	)
}

// 메뉴 버튼 컴포넌트
const MenuButton = ({
	source,
	label,
	onPress = () => console.log(`${label} 클릭됨`),
}: {
	source: any
	label: string
	onPress?: () => void
}) => (
	<TouchableOpacity style={styles.menuButton} onPress={onPress}>
		<Image source={source} style={styles.menuIcon} />
		<Text style={styles.menuText}>{label}</Text>
	</TouchableOpacity>
)

export default HomeScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "space-between",
	},
	screenHeader: {
		marginBottom: -20,
	},
	menuContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		paddingVertical: 12,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	menuButton: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 12,
		backgroundColor: "#76DABF",
		width: 80,
		height: 80,
	},
	menuIcon: {
		width: 32,
		height: 32,
		marginBottom: 4,
	},
	menuText: {
		color: "#FAFAFA",
		fontSize: 12,
		fontWeight: "bold",
	},
})

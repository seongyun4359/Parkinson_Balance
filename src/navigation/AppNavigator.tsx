import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import LoginScreen from "../screens/auth/LoginScreen"
import MedicalStaffHome from "../screens/medicalStaff/HomeScreen"
import PatientHome from "../screens/patient/HomeScreen"
import AlarmScreen from "../screens/patient/bottomButton/AlarmScreen"
import ExerciseScreen from "../screens/patient/bottomButton/exerciseVideo/ExerciseScreen"
import RecordScreen from "../screens/patient/bottomButton/exerciseVideo/RecordScreen"
import CategoryScreen from "../screens/patient/bottomButton/category/CategoryScreen"
import KidneyExerciseScreen from "../screens/patient/bottomButton/category/kidneyExerciseScreen"
import StrengthExerciseScreen from "../screens/patient/bottomButton/category/strengthExerciseScreen"
import BalanceExerciseScreen from "../screens/patient/bottomButton/category/balanceExerciseScreen"
import OralExerciseScreen from "../screens/patient/bottomButton/category/oralExerciseScreen"
import DayRecordScreen from "../screens/patient/calendar/DayRecordScreen"
import SignUpScreen from "../screens/auth/SignUpScreen"
import EditInfoScreen from "../screens/medicalStaff/personal/EditInfoScreen"
import PrescriptionScreen from "../screens/medicalStaff/personal/PrescriptionScreen"
import SearchInfoScreen from "../screens/medicalStaff/personal/SearchInfoScreen"
import DetailTableScreen from "../screens/medicalStaff/LookUp/DetailTableScreen"
import { InfoTableScreen } from "../screens/medicalStaff/LookUp/InfoTableScreen"
import MyInfoScreen from "../screens/patient/bottomButton/myInfo/MyInfoScreen"
import PatientDetailScreen from "../screens/medicalStaff/personal/PatientDetailScreen"
import { RootStackParamList } from "./Root"

const Stack = createNativeStackNavigator<RootStackParamList>()

const AppNavigator = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Login"
				screenOptions={{
					headerStyle: {
						backgroundColor: "#fff",
					},
					headerTintColor: "#333",
					headerTitleStyle: {
						fontWeight: "bold",
					},
				}}
			>
				{/* 기본 스크린 */}
				<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
				<Stack.Screen name="MedicalStaffHome" component={MedicalStaffHome} options={{ title: "관리자 홈" }} />
				<Stack.Screen name="PatientHome" component={PatientHome} options={{ title: "환자 홈" }} />
				<Stack.Screen name="Alarm" component={AlarmScreen} options={{ title: "알람페이지" }} />
				<Stack.Screen name="ExerciseScreen" component={ExerciseScreen} options={{ title: "운동 시작" }} />
				<Stack.Screen name="Category" component={CategoryScreen} options={{ title: "운동 종류" }} />
				<Stack.Screen name="KidneyExercise" component={KidneyExerciseScreen} options={{ title: "신장운동" }} />
				<Stack.Screen name="StrengthExercise" component={StrengthExerciseScreen} options={{ title: "근력 운동" }} />
				<Stack.Screen name="BalanceExercise" component={BalanceExerciseScreen} options={{ title: "균형/협응 운동" }} />
				<Stack.Screen name="OralExercise" component={OralExerciseScreen} options={{ title: "구강/발성 운동" }} />
				<Stack.Screen name="DayRecord" component={DayRecordScreen} options={{ title: "운동 일일 기록" }} />
				<Stack.Screen name="RecordScreen" component={RecordScreen} options={{ title: "운동 기록" }} />
				<Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "회원가입" }} />
				<Stack.Screen name="EditInfo" component={EditInfoScreen} options={{ title: "정보 수정" }} />
				<Stack.Screen name="Prescription" component={PrescriptionScreen} options={{ title: "처방 관리" }} />
				<Stack.Screen name="SearchInfo" component={SearchInfoScreen} options={{ title: "정보 검색" }} />
				<Stack.Screen name="InfoTable" component={InfoTableScreen} options={{ title: "전체 기록 테이블" }} />
				<Stack.Screen name="DetailTable" component={DetailTableScreen} options={{ title: "상세 테이블" }} />
				<Stack.Screen name="MyInformation" component={MyInfoScreen} options={{ title: "내 정보" }} />
				<Stack.Screen name="MedicalStaffAuth" component={LoginScreen} options={{ headerShown: false }} />
				<Stack.Screen name="PatientDetail" component={PatientDetailScreen} options={{ title: "환자 상세 정보" }} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default AppNavigator

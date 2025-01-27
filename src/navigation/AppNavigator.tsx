import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import LoginScreen from "../screens/auth/LoginScreen"
import MedicalStaffHome from "../screens/medicalStaff/HomeScreen"
import PatientHome from "../screens/patient/HomeScreen"
import SignUpScreen from "../screens/auth/SignUpScreen"
import LostAccountScreen from "../screens/auth/LostAcountScreen"

import EditInfoScreen from "../screens/medicalStaff/personal/EditInfoScreen"
import PrescriptionScreen from "../screens/medicalStaff/personal/PrescriptionScreen"
import SearchInfoScreen from "../screens/medicalStaff/personal/SearchInfoScreen"

import DetailTableScreen from "../screens/medicalStaff/LookUp/DetailTableScreen"
import InfoTableScreen from "../screens/medicalStaff/LookUp/DetailTableScreen"

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				{/* 기본 스크린 */}
				<Stack.Screen
					name="Login"
					component={LoginScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="MedicalStaffHome"
					component={MedicalStaffHome}
					options={{ title: "관리자 홈" }}
				/>
				<Stack.Screen
					name="PatientHome"
					component={PatientHome}
					options={{ title: "환자 홈" }}
				/>
				<Stack.Screen
					name="SignUp"
					component={SignUpScreen}
					options={{ title: "회원가입" }}
				/>
				<Stack.Screen
					name="LostAccount"
					component={LostAccountScreen}
					options={{ title: "계정 찾기" }}
				/>
				<Stack.Screen
					name="EditInfo"
					component={EditInfoScreen}
					options={{ title: "정보 수정" }}
				/>
				<Stack.Screen
					name="Prescription"
					component={PrescriptionScreen}
					options={{ title: "처방 관리" }}
				/>
				<Stack.Screen
					name="SearchInfo"
					component={SearchInfoScreen}
					options={{ title: "정보 검색" }}
				/>
				<Stack.Screen
					name="DetailTable"
					component={DetailTableScreen}
					options={{ title: "상세 테이블" }}
				/>
				<Stack.Screen name="InfoTable" component={DetailTableScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default AppNavigator

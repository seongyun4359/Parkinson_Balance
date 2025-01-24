import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import LoginScreen from "../screens/auth/LoginScreen"
import MedicalStaffHome from "../screens/medicalStaff/HomeScreen"
import PatientHome from "../screens/patient/HomeScreen"
import SignUpScreen from "../screens/auth/SignUpScreen"
import LostAccountScreen from "../screens/auth/LostAcountScreen"

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
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
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default AppNavigator

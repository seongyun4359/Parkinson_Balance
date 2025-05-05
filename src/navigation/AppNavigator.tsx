import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import LoginScreen from "../screens/auth/LoginScreen"
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
import { InfoTableScreen } from "../screens/medicalStaff/InfoTableScreen"
import MyInfoScreen from "../screens/patient/bottomButton/myInfo/MyInfoScreen"
import PatientDetailScreen from "../screens/medicalStaff/PatientDetailScreen"
import { RootStackParamList } from "./Root"

const Stack = createStackNavigator<RootStackParamList>()

const AppNavigator = () => {
	return (
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
			<Stack.Screen name="PatientHome" component={PatientHome}  options={{ headerShown: false }} />
			<Stack.Screen name="Alarm" component={AlarmScreen}  options={{ headerShown: false }} />
			<Stack.Screen
				name="ExerciseScreen"
				component={ExerciseScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen name="Category" component={CategoryScreen}  options={{ headerShown: false }} />
			<Stack.Screen
				name="KidneyExercise"
				component={KidneyExerciseScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="StrengthExercise"
				component={StrengthExerciseScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="BalanceExercise"
				component={BalanceExerciseScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="OralExercise"
				component={OralExerciseScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="DayRecord"
				component={DayRecordScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen name="RecordScreen" component={RecordScreen}  options={{ headerShown: false }} />
			<Stack.Screen name="SignUp" component={SignUpScreen}  options={{ headerShown: false }} />
			<Stack.Screen name="EditInfo" component={EditInfoScreen}  options={{ headerShown: false }} />
			<Stack.Screen
				name="InfoTable"
				component={InfoTableScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen name="MyInformation" component={MyInfoScreen}  options={{ headerShown: false }} />
			<Stack.Screen
				name="MedicalStaffAuth"
				component={LoginScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="PatientDetail"
				component={PatientDetailScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	)
}

export default AppNavigator

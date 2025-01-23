import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import SplashScreen from "../screens/SplashScreen"
import LoginScreen from "../screens/auth/LoginScreen"
import SignUpScreen from "../screens/auth/SignUpScreen"
import LostAccountScreen from "../screens/auth/LostAcountScreen"
import HomeScreen from "../screens/patient/HomeScreen"
import ProfileScreen from "../screens/ProfileScreen"
import SettingsScreen from "../screens/SettingScreen"

export type RootStackParamList = {
	Splash: undefined
	Login: undefined
	SignUp: undefined
	LostAccount: undefined
	Home: undefined
	Profile: undefined
	Settings: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

const AppNavigator: React.FC = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Splash">
				<Stack.Screen
					name="Splash"
					component={SplashScreen}
					options={{ headerShown: false }}
				/>
				{/* Authentication Screens */}
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="SignUp" component={SignUpScreen} />
				<Stack.Screen name="LostAccount" component={LostAccountScreen} />
				{/* Main Screens */}
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="Profile" component={ProfileScreen} />
				<Stack.Screen name="Settings" component={SettingsScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default AppNavigator

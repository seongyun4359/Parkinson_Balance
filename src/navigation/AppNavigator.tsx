import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import SplashScreen from "../screens/SplashScreen"
import LoginScreen from "../screens/auth/LoginScreen"
import SignUpScreen from "../screens/auth/SignUpScreen"
import LostAccountScreen from "../screens/auth/LostAcountScreen"
import HomeScreen from "../screens/patient/HomeScreen"
import type { RootStackParamList } from "./Root"

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
			</Stack.Navigator>
		</NavigationContainer>
	)
}

export default AppNavigator

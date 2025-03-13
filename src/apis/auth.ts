import { getApiEndpoint } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SignUpRequest {
	phoneNumber: string;
	password: string;
	name: string;
	gender: string;
	exerciseNotificationTime: string; // ✅ 운동 알람 시간 추가!
	fcmToken: string;
}

const USER_INFO_KEY = "userInfo"; // 사용자 정보 저장 키

export const signUp = async (signUpData: SignUpRequest) => {
	try {
		const API_BASE_URL = getApiEndpoint();
		const response = await fetch(`${API_BASE_URL}/api/members/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(signUpData),
		});

		const data = await response.json();

		// ✅ 회원가입 성공 시 사용자 정보 저장
		if (response.ok) {
			await saveUserInfo({
				phoneNumber: signUpData.phoneNumber,
				name: signUpData.name,
				gender: signUpData.gender,
				exerciseNotificationTime: signUpData.exerciseNotificationTime, // ✅ 운동 알람 시간도 저장!
			});
		}

		return data;
	} catch (error) {
		throw error;
	}
};

// ✅ 로그인한 사용자의 정보 저장
export const saveUserInfo = async (userInfo: any) => {
	try {
		await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
		console.log("🔑 사용자 정보 저장 완료:", userInfo);
	} catch (error) {
		console.error("❌ 사용자 정보 저장 실패:", error);
	}
};

// ✅ 저장된 사용자 정보 가져오기 (운동 알람 시간 포함!)
export const getUserInfo = async (): Promise<{ phoneNumber: string; exerciseNotificationTime?: string } | null> => {
	try {
		const userInfo = await AsyncStorage.getItem(USER_INFO_KEY);
		if (userInfo) {
			const parsedInfo = JSON.parse(userInfo);
			console.log("📱 저장된 사용자 정보:", parsedInfo);
			return parsedInfo;
		}
	} catch (error) {
		console.error("❌ 사용자 정보 가져오기 실패:", error);
	}
	return null;
};

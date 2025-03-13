import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserPhoneNumber = async (): Promise<string | null> => {
	try {
		const userInfo = await AsyncStorage.getItem("userInfo");
		if (!userInfo) {
			console.warn("⚠️ 저장된 사용자 정보가 없습니다.");
			return null; // ✅ userInfo가 없으면 null 반환
		}

		const parsedInfo = JSON.parse(userInfo);
		if (!parsedInfo.phoneNumber) {
			console.warn("⚠️ 저장된 전화번호가 없습니다.");
			return null; // ✅ phoneNumber가 없으면 null 반환
		}

		console.log("📱 저장된 전화번호:", parsedInfo.phoneNumber);
		return parsedInfo.phoneNumber;
	} catch (error) {
		console.error("❌ 전화번호 가져오기 실패:", error);
		return null; // ✅ 에러 발생 시에도 null 반환
	}
};

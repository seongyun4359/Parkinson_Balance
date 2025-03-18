import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserPhoneNumber = async (): Promise<string | null> => {
	try {
		const userInfo = await AsyncStorage.getItem("userInfo");
		console.log("🟢 저장된 userInfo 값:", userInfo); // 로그 추가

		if (!userInfo) {
			console.warn("⚠️ 저장된 사용자 정보가 없습니다.");
			return null;
		}

		const parsedInfo = JSON.parse(userInfo);
		console.log("🔵 파싱된 userInfo:", parsedInfo); // 로그 추가

		if (!parsedInfo.phoneNumber) {
			console.warn("⚠️ 저장된 전화번호가 없습니다.");
			return null;
		}

		console.log("📱 최종 저장된 전화번호:", parsedInfo.phoneNumber);
		return parsedInfo.phoneNumber;
	} catch (error) {
		console.error("❌ 전화번호 가져오기 실패:", error);
		return null;
	}
};

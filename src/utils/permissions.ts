import { PermissionsAndroid, Platform } from "react-native"

export const requestStoragePermission = async () => {
	if (Platform.OS === "android" && Platform.Version >= 33) {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
			)
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log("✅ 비디오 접근 권한 허용됨")
			} else {
				console.warn("🚨 비디오 접근 권한 거부됨")
			}
		} catch (err) {
			console.error("❌ 권한 요청 실패:", err)
		}
	}
}

export const requestExactAlarmPermission = async () => {
	if (Platform.OS === "android") {
		try {
			if (Platform.Version >= 33) {
				// Android 13 이상은 manifest에 USE_EXACT_ALARM만 있으면 충분
				console.log("✅ Android 13 이상: 정확한 알람 권한 manifest로 처리됨")
			} else {
				console.log("✅ Android 12 이하: 알람 권한 요청 없이 사용 가능 (manifest만 설정)")
			}
			return true
		} catch (err) {
			console.error("❌ 정확한 알람 권한 처리 중 오류:", err)
			return false
		}
	}
	return true
}

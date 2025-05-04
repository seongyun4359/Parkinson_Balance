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
			// Android 13 이상에서는 SCHEDULE_EXACT_ALARM 권한이 필요하지 않음
			if (Platform.Version >= 33) {
				// USE_EXACT_ALARM은 권한 요청이 필요하지 않음 (manifest에만 선언)
				console.log("✅ Android 13 이상: 정확한 알람 권한 사용 가능")
				return true
			} else {
				// Android 12 이하에서는 SCHEDULE_EXACT_ALARM 권한만 필요
				const result = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.SCHEDULE_EXACT_ALARM as any
				)
				const granted = result === PermissionsAndroid.RESULTS.GRANTED
				if (granted) {
					console.log("✅ 정확한 알람 권한 허용됨")
				} else {
					console.warn("🚨 정확한 알람 권한 거부됨")
				}
				return granted
			}
		} catch (err) {
			console.error("❌ 정확한 알람 권한 요청 실패:", err)
			return false
		}
	}
	return true
}

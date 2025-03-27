import React from "react"
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import PushNotification from "react-native-push-notification"
import { useNavigation } from "@react-navigation/native"
import { SearchScreenNavigationProp } from "../../../../types/navigation"

const MyInfoScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>()

  const handleLogout = () => {
    Alert.alert(
      "로그아웃",
      "로그아웃 하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "네",
          onPress: async () => {
            try {
              console.log("🔹 로그아웃 시작...")

              PushNotification.cancelAllLocalNotifications()
              PushNotification.removeAllDeliveredNotifications()
              console.log("✅ 모든 로컬 푸시 알람이 삭제되었습니다.")

              await AsyncStorage.removeItem("exerciseNotificationTime")
              console.log("✅ 운동 알람 시간이 초기화되었습니다.")

              await AsyncStorage.removeItem("authToken")
              console.log("✅ 인증 토큰 삭제 완료.")

              const exerciseTime = await AsyncStorage.getItem("exerciseNotificationTime")
              if (!exerciseTime) {
                console.log("✅ 운동 알람 시간이 AsyncStorage에서 삭제되었습니다.")
              } else {
                console.log("❌ 운동 알람 시간이 삭제되지 않았습니다.")
              }

              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              })
              console.log("✅ 로그인 화면으로 이동.")
            } catch (error) {
              console.error("❌ 로그아웃 실패:", error)
              Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.")
            }
          },
        },
      ],
      { cancelable: false }
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MyInfoScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5A5F",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
})

import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import PushNotification from "react-native-push-notification";
import ScreenHeader from "../../../components/patient/ScreenHeader";
import { RootStackParamList } from "../../../navigation/Root";
import { getUserInfo } from "../../../apis/auth";

// 네비게이션 타입 정의
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Alarm">;

const AlarmScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [alarmTime, setAlarmTime] = useState<string | null>(null);

  // 🔹 알림 권한 요청 함수
  const requestNotifications = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("⚠️ 알림 권한이 거부되었습니다.");
        return false;
      }
    }

    PushNotification.requestPermissions();
    return true;
  };

  // 🔹 운동 시간 가져오기 (로컬 저장된 데이터 사용)
  const loadUserExerciseTime = async () => {
    try {
      const userInfo = await getUserInfo();
      if (userInfo && userInfo.exerciseNotificationTime) {
        console.log("✅ 저장된 운동 알람 시간:", userInfo.exerciseNotificationTime);
        setAlarmTime(userInfo.exerciseNotificationTime);
        scheduleAlarm(userInfo.exerciseNotificationTime);
      } else {
        console.warn("⚠️ 저장된 운동 알람 시간이 없습니다.");
      }
    } catch (error) {
      console.error("❌ 운동 알람 시간 불러오기 실패:", error);
      Alert.alert("오류", "운동 알람 시간을 불러오지 못했습니다.");
    }
  };

  // 🔹 운동 시간에 맞춰 알람을 울리도록 설정
  const scheduleAlarm = async (time: string) => {
    if (!time) {
      console.error("❌ 알람 설정 실패: 시간 값이 없습니다.");
      return;
    }
  
    // 🔹 알림 권한 확인 후 설정
    const hasPermission = await requestNotifications();
    if (!hasPermission) {
      console.warn("⚠️ 알림 권한이 없어 알람을 설정하지 않습니다.");
      return;
    }
  
    const timeParts = time.split(":").map(Number);
    if (timeParts.length !== 3 || timeParts.some(isNaN)) {
      console.error("❌ 잘못된 시간 형식:", time);
      return;
    }
  
    const [hour, minute, second] = timeParts;
    const now = new Date();
    let alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);
  
    if (alarmTime < now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }
  
    console.log("✅ 알람 설정됨:", alarmTime.toISOString());
  
    // 🔥 로그 추가: 알람이 실제로 예약되는지 확인
    PushNotification.getScheduledLocalNotifications((notifs) => {
      console.log("🔍 예약된 알람 목록:", notifs);
    });
  
    PushNotification.localNotificationSchedule({
      channelId: "exercise-alarm",
      title: "운동 알람",
      message: "운동할 시간입니다! 건강을 위해 몸을 움직여 보세요!",
      date: alarmTime,
      allowWhileIdle: true,
      soundName: "default",
      vibrate: true,
      repeatType: "day",
    });
  };
  

  useEffect(() => {
    requestNotifications();  // ✅ 알림 권한 요청
    loadUserExerciseTime();  // ✅ 운동 알람 시간 가져오기
  }, []);

  return (
    <View style={styles.container}>
      <ScreenHeader />

      {/* 알람 시간 표시 */}
      {alarmTime ? (
        <View style={styles.alarmItem}>
          <Text style={styles.alarmTime}>{alarmTime}</Text>
        </View>
      ) : (
        <Text style={styles.noAlarmText}>설정된 운동 알람이 없습니다.</Text>
      )}

      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => navigation.navigate("PatientHome")}
      >
        <Text style={styles.completeButtonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AlarmScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 40,
  },
  alarmItem: {
    width: "95%",
    padding: 15,
    borderWidth: 2,
    borderColor: "#76DABF",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  noAlarmText: {
    fontSize: 18,
    color: "#888",
    marginTop: 20,
  },
  completeButton: {
    backgroundColor: "#76DABF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 30,
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

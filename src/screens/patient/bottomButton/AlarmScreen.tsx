import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import PushNotification from "react-native-push-notification";
import ScreenHeader from "../../../components/patient/ScreenHeader";
import { RootStackParamList } from "../../../navigation/Root";
import { getUserInfo } from "../../../apis/auth"; // ✅ 사용자 정보 가져오는 함수 사용

// 네비게이션 타입 정의
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Alarm">;

const AlarmScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [alarmTime, setAlarmTime] = useState<string | null>(null);

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
  const scheduleAlarm = (time: string) => {
    const [hour, minute, second] = time.split(":").map(Number);
    const now = new Date();
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, second);

    // 현재 시간보다 이전이면 다음 날로 설정
    if (alarmTime < now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

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
    loadUserExerciseTime(); // ✅ 로그인한 사용자의 운동 알람 시간 가져오기
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

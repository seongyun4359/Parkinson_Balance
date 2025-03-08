import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";
import { Platform, PermissionsAndroid } from "react-native";

// ✅ Firebase 설정 정보
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// ✅ Firebase 앱 초기화 (중복 방지)
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

console.log("✅ Firebase 앱 초기화 완료:", firebaseApp.name);

// ✅ Firebase Messaging 가져오기 (Android 전용)
let firebaseMessaging: Messaging | null = null;
if (Platform.OS === "android") {
  try {
    firebaseMessaging = getMessaging(firebaseApp);
    console.log("✅ Firebase Messaging 객체 설정 완료");
  } catch (error) {
    console.error("🚨 Firebase Messaging 초기화 오류:", error);
  }
}

// ✅ Android 푸시 알림 권한 요청 (필수)
const requestAndroidPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error("🚨 알림 권한 요청 실패:", error);
    return false;
  }
};

// ✅ FCM 토큰 요청 함수 (최신 방식 적용)
const requestFCMToken = async (): Promise<string | null> => {
  try {
    console.log("🚀 FCM 토큰 요청 시작...");

    if (!firebaseMessaging) {
      console.warn("⚠️ Firebase Messaging이 지원되지 않는 플랫폼이거나, 초기화되지 않았습니다.");
      return null;
    }

    // 🔹 Android에서 알림 권한 요청
    if (Platform.OS === "android") {
      const hasPermission = await requestAndroidPermissions();
      if (!hasPermission) {
        console.warn("🚨 푸시 알림 권한이 없습니다.");
        return null;
      }
    }

    // 🔹 FCM 토큰 가져오기
    const token = await getToken(firebaseMessaging);
    console.log("🔥 FCM Token:", token);
    return token;
  } catch (error) {
    console.error("🚨 FCM Token Fetch Error:", error);
    return null;
  }
};

// ✅ 포그라운드 알림 이벤트 리스너 설정
const setupNotificationListeners = () => {
  if (!firebaseMessaging) {
    console.warn("⚠️ Firebase Messaging이 설정되지 않았습니다. 리스너를 실행하지 않습니다.");
    return;
  }

  try {
    onMessage(firebaseMessaging, async (remoteMessage) => {
      console.log("📩 Foreground 메시지 수신:", remoteMessage);
    });
    console.log("🔔 Firebase 메시지 리스너가 설정되었습니다.");
  } catch (error) {
    console.error("🚨 Firebase 메시지 리스너 설정 오류:", error);
  }
};

// ✅ `export` 수정하여 중복 `export` 방지
export { firebaseApp, firebaseMessaging, requestFCMToken, setupNotificationListeners };

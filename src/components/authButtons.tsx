import React from "react";
import { Button, Alert } from "react-native";
import { login, refreshToken } from "../utils/api";

type AuthButtonsProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthButtons: React.FC<AuthButtonsProps> = ({
  isLoggedIn,
  setIsLoggedIn,
  token,
  setToken,
}) => {
  const handleLogin = async () => {
    try {
      const data = await login("testuser", "password123");
      setToken(data.token);
      setIsLoggedIn(true);
      Alert.alert("로그인 성공", "로그인 되었습니다.");
    } catch (error) {
      console.error("로그인 오류:", error);
      Alert.alert("오류", "로그인에 실패했습니다.");
    }
  };

  const handleRefreshToken = async () => {
    try {
      if (!token) throw new Error("유효한 토큰이 없습니다.");
      const data = await refreshToken(token);
      setToken(data.newToken);
      Alert.alert("토큰 갱신", "토큰이 성공적으로 갱신되었습니다.");
    } catch (error) {
      console.error("토큰 갱신 오류:", error);
      Alert.alert("오류", "토큰 갱신에 실패했습니다.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    Alert.alert("로그아웃", "성공적으로 로그아웃되었습니다.");
  };

  return (
    <>
      {!isLoggedIn ? (
        <Button title="로그인" onPress={handleLogin} />
      ) : (
        <>
          <Button title="토큰 갱신" onPress={handleRefreshToken} />
          <Button title="로그아웃" onPress={handleLogout} />
        </>
      )}
    </>
  );
};

export default AuthButtons;

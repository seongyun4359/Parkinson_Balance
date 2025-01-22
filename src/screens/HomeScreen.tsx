import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import AuthButtons from "../components/authButtons";

type NavigationProp = {
  navigation: {
    navigate: (screen: string) => void;
  };
};

const HomeScreen: React.FC<NavigationProp> = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  return (
    <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
      <Text>홈 화면</Text>
      <AuthButtons
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        token={token}
        setToken={setToken}
      />
      <View style={{ marginVertical: 10 }}>
        <Button
          title="프로필로 이동"
          onPress={() => navigation.navigate("Profile")}
        />
      </View>
      <View style={{ marginVertical: 10 }}>
        <Button
          title="설정으로 이동"
          onPress={() => navigation.navigate("Settings")}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

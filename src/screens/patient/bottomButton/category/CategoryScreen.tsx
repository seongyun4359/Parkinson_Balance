import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../navigation/Root";

const categories: { id: string; title: string; screen: keyof RootStackParamList }[] = [
  { id: "1", title: "신장운동", screen: "KidneyExercise" },
  { id: "2", title: "근력 운동", screen: "StrengthExercise" },
  { id: "3", title: "균형/협응 운동", screen: "BalanceExercise" },
  { id: "4", title: "구강/발성 운동", screen: "OralExercise" },
];

const CategoryScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>카테고리</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const imageSource =
            index % 2 === 0
              ? require("../../../../assets/category/category_green.png")
              : require("../../../../assets/category/category_pink.png");

          return (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(item.screen)}>
              <View style={styles.textContainer}>
                <Text style={styles.about}>ABOUT</Text>
                <Text style={styles.title}>{item.title}</Text>
              </View>
              <Image source={imageSource} style={styles.image} />
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 30,
    marginBottom:30,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#68A37F",
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    height: 120,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
    width: "98%",
    alignSelf: "center",
  },
  image: {
    width: 168,
    height: 168,
    resizeMode: "contain",
    position: "absolute",
    right: -20,
    top: "70%",
    transform: [{ translateY: -65 }],
  },
  textContainer: {
    flex: 1,
  },
  about: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#7D6AE8",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
});

export default CategoryScreen;

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';

// 운동 카테고리 데이터
const categories = [
  {
    id: '1',
    title: '신장운동',
    image: require('../../../assets/category/Kidney.png'),
  },
  {
    id: '2',
    title: '근력 운동',
    image: require('../../../assets/category/Muscle.png'),
  },
  {
    id: '3',
    title: '균형/협응 운동',
    image: require('../../../assets/category/Balance.png'),
  },
  {
    id: '4',
    title: '구강/발성 운동',
    image: require('../../../assets/category/Vocal.png'),
  },
];

const { width } = Dimensions.get('window'); // 화면 너비 가져오기

const CategoryScreen = () => {
  const renderItem = ({ item }: { item: (typeof categories)[0] }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>카테고리</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2} // 두 개씩 보여주기
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#76DABF',
    marginBottom: 12,
    textAlign: 'center',
  },
  list: {
    alignItems: 'center',
  },
  card: {
    width: (width / 2) - 16, // 화면 반씩 차지하도록 설정
    margin: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

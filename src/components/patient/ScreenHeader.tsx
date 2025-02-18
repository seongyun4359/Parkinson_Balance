import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface ScreenHeaderProps {
  title?: string;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title = '파킨슨 밸런스',
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logo/app-logo-sub.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#76DABF',
  },
});

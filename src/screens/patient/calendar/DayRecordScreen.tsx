import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CalendarComponent from '../../../components/patient/Calendar';
import ScreenHeader from '../../../components/patient/ScreenHeader';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/Root';

type DayRecordScreenRouteProp = RouteProp<RootStackParamList, 'DayRecord'>;

type Props = {
  route: DayRecordScreenRouteProp;
};

const DayRecordScreen: React.FC<Props> = ({ route }) => {
  const { date } = route.params;

  return (
    <View style={styles.container}>
      <ScreenHeader/>
      <CalendarComponent />
      <ScrollView style={styles.recordContainer}>
        <Text style={styles.dateText}>{date} 기록</Text>
        <View style={styles.recordBox}>
          <Text style={styles.recordLabel}>신장운동(12/12)</Text>
          <Text style={styles.recordResult}>100%</Text>
        </View>
        <View style={styles.recordBox}>
          <Text style={styles.recordLabel}>근력운동(7/14)</Text>
          <Text style={[styles.recordResult, styles.orangeText]}>50.00%</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default DayRecordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  recordContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#76DABF',
    marginBottom: 12,
  },
  recordBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#76DABF',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
  },
  recordLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordResult: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  orangeText: {
    color: 'orange',
  },
});

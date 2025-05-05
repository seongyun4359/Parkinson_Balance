import React from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/Root';
import { useNavigation } from '@react-navigation/native';
import type XDate from 'xdate';

interface CalendarComponentProps {
  completedDates?: string[];
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
}

type DayRecordScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'DayRecord'
>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const FIXED_CALENDAR_HEIGHT = 400;

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  completedDates = [],
  selectedDate,
  onSelectDate,
}) => {
  const navigation = useNavigation<DayRecordScreenNavigationProp>();
  const today = new Date().toISOString().split("T")[0];

  const handleDayPress = (day: DateData) => {
    onSelectDate?.(day.dateString);
    navigation.navigate('DayRecord', { date: day.dateString });
  };

  return (
    <View style={[styles.container, { height: FIXED_CALENDAR_HEIGHT }]}>
      <Calendar
        initialDate={selectedDate || today}
        onDayPress={handleDayPress}
        markedDates={{
          [(selectedDate || today)]: {
            selected: true,
            selectedColor: '#76DABF',
            selectedTextColor: '#FFFFFF',
          },
          ...completedDates.reduce((acc, date) => {
            acc[date] = {
              ...(acc[date] || {}),
              marked: true,
              dotColor: 'pink',
            };
            return acc;
          }, {} as Record<string, any>),
        }}
        hideExtraDays={true}
        disableArrowLeft={false}
        disableArrowRight={false}
        style={{
          height: FIXED_CALENDAR_HEIGHT - 20,
          backgroundColor: '#F5F5F5',
          borderRadius: 12,
        }}
        renderHeader={(date: XDate | undefined) => {
          if (!date) return null;
          const monthNames = [
            'January','February','March','April','May','June','July',
            'August','September','October','November','December',
          ];
          return (
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>{monthNames[date.getMonth()]}</Text>
              <Text style={styles.greenDot}>▴</Text>
              <Text style={styles.headerText}>{date.getFullYear()}</Text>
              <Text style={styles.greenDot}>▴</Text>
            </View>
          );
        }}
        renderArrow={(direction: 'left' | 'right') => (
          <Text style={styles.arrowText}>{direction === 'left' ? '‹' : '›'}</Text>
        )}
        theme={{
          calendarBackground: '#F5F5F5',
          textSectionTitleColor: '#000000',
          textMonthFontSize: 16,
          textMonthFontWeight: 'bold',
          dayTextColor: '#000000',
          textDayFontSize: 14,
          textDayFontWeight: 'bold',
          textDayHeaderFontSize: 14,
          textDisabledColor: '#E5E5E5',
          todayTextColor: '#FFFFFF',
          arrowColor: '#76DABF',
        }}
        dayComponent={({ date }) => {
          const isSelected = selectedDate
            ? date?.dateString === selectedDate
            : date?.dateString === today;
          const isCompleted = completedDates.includes(date?.dateString || '');

          return (
            <TouchableOpacity
              onPress={() => {
                if (date) handleDayPress(date);
              }}
              style={[
                styles.dayContainer,
                isSelected ? styles.selectedDay : styles.defaultDay,
              ]}
            >
              <View style={styles.innerDayContainer}>
                {isCompleted && <Text style={styles.flowerIcon}>🌸</Text>}
                <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
                  {date?.day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default CalendarComponent;

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginHorizontal: 4,
  },
  greenDot: {
    fontSize: 15,
    color: '#76DABF',
    marginHorizontal: 2,
  },
  arrowText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#76DABF',
    marginHorizontal: 20,
  },
  dayContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,  
    margin: -3,
  },
  innerDayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultDay: {
    backgroundColor: '#FFFFFF',
  },
  selectedDay: {
    backgroundColor: '#76DABF',
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  flowerIcon: {
    fontSize: 12,
    color: 'pink',
    lineHeight: 12,
  },
});

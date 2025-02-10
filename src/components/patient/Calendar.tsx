import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import type XDate from 'xdate';

const SCREEN_WIDTH = Dimensions.get('window').width;
const FIXED_CALENDAR_HEIGHT = 400;

const CalendarComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = ('0' + (today.getMonth() + 1)).slice(-2);
    const dd = ('0' + today.getDate()).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  });

  return (
    <View style={[styles.container, { height: FIXED_CALENDAR_HEIGHT }]}>
      <Calendar
        initialDate={selectedDate}
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#76DABF',
            selectedTextColor: '#FFFFFF',
          },
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
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
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
          const isToday = date?.dateString === selectedDate;
          return (
            <View
              style={[
                styles.dayContainer,
                isToday ? styles.selectedDay : styles.defaultDay,
              ]}
            >
              <Text style={[styles.dayText, isToday && styles.selectedDayText]}>
                {date?.day}
              </Text>
            </View>
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
    fontSize: 12,
    color: '#76DABF',
    marginHorizontal: 2,
  },
  arrowText: {
    fontSize: 24,
    color: '#76DABF',
    marginHorizontal: 20,
  },
  dayContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,  
    margin: -3,
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
});

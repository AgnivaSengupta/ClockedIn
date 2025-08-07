import { useAppStore } from '@/store/useAppStore';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {
  CalendarProvider,
  ExpandableCalendar,
  AgendaList,
} from 'react-native-calendars';


const calendarTheme = {
  calendarBackground: '#F5F1ED',
  selectedDayBackgroundColor: '#2C2C2C',
  selectedDayTextColor: '#FFFFFF',
  todayTextColor: '#8B4513',
  dayTextColor: '#2C2C2C',
  textDisabledColor: '#BDBDBD',
  monthTextColor: '#2C2C2C',
  textMonthFontWeight: 'bold',
  textMonthFontSize: 20,
  textSectionTitleColor: '#8A8A8A',
  textDayHeaderFontWeight: 'bold',
  arrowColor: 'transparent',
};

const ScheduleScreen = () => {
  const INITIAL_DATE = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(INITIAL_DATE);

  const subjects = useAppStore((state) => state.subjects);

  const getAgendaForDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // 0 - Sunday, 6 - Saturday

    const todaySubjects = subjects.filter((subject) =>
      subject.classDays.includes(dayOfWeek)
    );

    return [
      {
        title: dateString,
        data: todaySubjects.map((subj) => ({
          hour: subj.name,
          title: subj.name,
        })),
      },
    ];
  };

  const agendaItems = getAgendaForDate(selectedDate);

  const renderItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <Text style={styles.scheduleItemText}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F1ED" />

      <CalendarProvider
        date={INITIAL_DATE}
        onDateChanged={setSelectedDate}
      >
        <Text style={styles.header}>Your Schedule:</Text>

        <ExpandableCalendar
          theme={calendarTheme}
          initialPosition={ExpandableCalendar.positions.CLOSED}
          hideKnob={true}
        />

        {agendaItems[0].data.length > 0 ? (
          <AgendaList
            sections={agendaItems}
            renderItem={renderItem}
            sectionStyle={styles.sectionStyle}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              🎉 No classes scheduled today!
            </Text>
          </View>
        )}
      </CalendarProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1ED',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 10,
    fontFamily: 'sans-serif-medium',
  },
  scheduleItem: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 15,
    marginHorizontal: 20,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scheduleItemText: {
    fontSize: 18,
    color: '#2C2C2C',
    fontFamily: 'sans-serif',
  },
  sectionStyle: {
    height: 0,
    width: 0,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  placeholderText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#8A8A8A',
    textAlign: 'center',
  },
});

export default ScheduleScreen;

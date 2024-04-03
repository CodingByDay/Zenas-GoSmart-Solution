import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';

const TaskTime = ({ label1, label2 }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { t } = useTranslation();

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const newDate = new Date(date);
    newDate.setHours(selectedTime.getHours());
    newDate.setMinutes(selectedTime.getMinutes());
    setShowTimePicker(false);
    setDate(newDate);
  };

  const showDatePickerView = () => {
    setShowDatePicker(true);
    setShowTimePicker(false);
  };

  const showTimePickerView = () => {
    setShowTimePicker(true);
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      {/* First Row: Date and Time */}
      <View style={styles.row}>
        <Text style={styles.label}>{t('planDateTime')}</Text>
        <TouchableOpacity onPress={showDatePickerView} style={styles.item}>
          <Text style={styles.clickableText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showTimePickerView} style={styles.item}>
          <Text style={styles.clickableText}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={onChangeDate}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="spinner"
            onChange={onChangeTime}
          />
        )}
      </View>

      {/* Second Row: Date */}
      <View style={styles.row}>
        <Text style={styles.label}>{t('actualDate')}</Text>
        <TouchableOpacity onPress={showDatePickerView} style={styles.item}>
          <Text style={styles.clickableText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={onChangeDate}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginRight: 10, // Add margin between items
  },
  container: {
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  clickableText: {
    color: 'blue', // Make clickable text look clickable
    textDecorationLine: 'underline', // Underline clickable text
  },
});

export default TaskTime;

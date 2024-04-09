import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTranslation } from 'react-i18next'; 

const TimeComponent = ({ setDateTime }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const { t } = useTranslation(); // Hook to access translations

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();

    setDateTime(mergeDateTime(date, selectedTime));

  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();

    setDateTime(mergeDateTime(selectedDate, time));

  };

  // Function to merge date and time
  const mergeDateTime = (date, time) => {
    const mergedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );
    return mergedDateTime;
  };

  return (
    <View>
    <View style={styles.container}>
      <Text style={styles.labelRow}>{t("implementedTime")}</Text>
      <TouchableOpacity onPress={showDatePicker}>
        <Text style={styles.label}>{selectedDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={showTimePicker}>
      <Text style={styles.label}>{selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={selectedDate}
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        date={selectedTime}
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
    </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
    labelRow: {
      color: "black",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
    },
    label: {
      fontSize: 16,
      color: "#081a45", // Text color
      borderWidth: 1, // Border width
      borderColor: "#081a45", // Border color
      paddingVertical: 8, // Vertical padding
      paddingHorizontal: 12, // Horizontal padding
      borderRadius: 5, // Border radius
    },
  });

export default TimeComponent;

import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTranslation } from 'react-i18next'; 

const TimePlanned = ({ plannedDate }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(plannedDate ? new Date(plannedDate) : new Date());
  const [selectedTime, setSelectedTime] = useState(plannedDate ? new Date(plannedDate) : new Date());
  const { t } = useTranslation(); // Hook to access translations

  useEffect(() => {
    if (plannedDate) {
      setSelectedDate(new Date(plannedDate));
      setSelectedTime(new Date(plannedDate));
    }
  }, [plannedDate]);

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.labelRow}>{t("plannedTime")}</Text>
        <TouchableOpacity>
          <Text style={styles.label}>{selectedDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
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
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 20
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

export default TimePlanned;

import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next'; 

const TimeFields = ({ timeUsageTypes, setHoursForFields, plannedHours }) => {
    
  const { t } = useTranslation(); // Hook to access translations



  useEffect(() => {
    // Call handleInputChange when defaultValue is set
    timeUsageTypes.forEach(field => {
      const defaultValue = getUsedByGUID(field.TimeUsageTypeGuid);
      if (defaultValue !== 0) {
        handleInputChange(defaultValue.toString(), field.TimeUsageTypeGuid);
      }
    });
  }, []); // Empty dependency array means this effect runs only once, after the first render


  const handleInputChange = (text, guid) => {
    // Call the function passed from the parent component

    setHoursForFields(text, guid);
  };

  function getUsedByGUID(guid) {
    const item = plannedHours.find(obj => obj.GUID === guid);
    return item ? item.Used : 0;
  }


  function getBudgetByGUID(guid) {
    const item = plannedHours.find(obj => obj.GUID === guid);
    return item ? item.Budget : 0;
  }

  return (
    <View style={styles.container}>
      {timeUsageTypes.map((field, index) => (
        <View style={styles.row} key={index}>
          <Text style={styles.label}>
            {field.Title} {getBudgetByGUID(field.TimeUsageTypeGuid) > 0 && `(${t("plannedHour")}: ${getBudgetByGUID(field.TimeUsageTypeGuid)})`}
          </Text>
          <TextInput
            style={styles.input} 
            onChangeText={(text) => handleInputChange(text, field.TimeUsageTypeGuid)}
            defaultValue={getUsedByGUID(field.TimeUsageTypeGuid) !== 0 ? getUsedByGUID(field.TimeUsageTypeGuid).toString() : ""}
          />
        </View>
      ))}
    </View>
  );
  
  
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
    fontWeight: 'bold',
    color: 'black',
    width: '70%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    color: 'black',
    borderRadius: 5,
    padding: 0,
  },
});

export default TimeFields;

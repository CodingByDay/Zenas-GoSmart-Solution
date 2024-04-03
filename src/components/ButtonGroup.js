import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next'; 

const ButtonToggle = ({ label, onPress, isActive }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.activeButton]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const ToggleGroup = ( { setDescriptionStates, workDescription, problemDescription, setActiveState, enabled } ) => {
  const { t } = useTranslation(); 
  const [activeButton, setActiveButton] = useState('workDescription'); // Set 'problemDescription' as the initial active button
  const [inputValue, setInputValue] = useState('');

  const handleButtonPress = (label) => {
    if(label === "problemDescription") {
        setInputValue(problemDescription);
        setActiveState("problemDescription");
    } else if(label === "workDescription") {
        setInputValue(workDescription);
        setActiveState("workDescription");
    } 
    setActiveButton(label);
  };

  const handleTextInputChange = (text) => {
    setInputValue(text);
    setDescriptionStates(activeButton, text); // Call the parent function with the text input value
  };


  return (
    <View>
      <View style={styles.buttonsContainer}>


        <ButtonToggle
          label={t('workDescription')}
          onPress={() => handleButtonPress('workDescription')}
          isActive={activeButton === 'workDescription'}
        />

        <ButtonToggle
          label={t('agreementDescription')}
          onPress={() => handleButtonPress('agreementDescription')}
          isActive={activeButton === 'agreementDescription'}
        />

       

        {/* 
       <ButtonToggle
          label={t('problemDescription')}
          onPress={() => handleButtonPress('problemDescription')}
          isActive={activeButton === 'problemDescription'}
        />
        */}


      </View>
      <TextInput
        style={styles.multiLineInput}
        multiline={true}
        numberOfLines={10}
        onChangeText={handleTextInputChange} 
        value={inputValue} 
        editable={enabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#081a45',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 0,
  },
  buttonText: {
    color: 'white',
  },
  activeButton: {
    backgroundColor: 'white',
  },
  activeButtonText: {
    color: '#081a45',
  },
  multiLineInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    color: 'black',
    marginBottom: 20,
    minHeight: 100,
  },
});

export default ToggleGroup;

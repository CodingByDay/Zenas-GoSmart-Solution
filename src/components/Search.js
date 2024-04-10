import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Modal, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next'; 

const Search = ({ cancel, onSearchChange, setDateFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const { t } = useTranslation(); // Hook to access translations

  // Function to handle text input change
  const handleTextChange = (text) => {
    setSearchQuery(text);
    onSearchChange(text); // Call the parent component's function with the updated value
  };

  // Function to handle option selection
  const handleOptionSelect = (option) => {
    if(!cancel) {
    // Handle option selection here
    setDateFilter(option);
    // Close the dialog after option selection
    setShowDialog(false);
    } else {
      setDateFilter("");
      // Reset
      setShowDialog(false);
    } 
  };

  const iconName = cancel ? "cancel" : "date-range";

  return (
    <View style={styles.container}>
      <Icon name="search" size={30} color={'black'} />
      
      <TextInput
        style={styles.input}
        onChangeText={handleTextChange} // Call handleTextChange when text changes
        value={searchQuery}
        placeholderTextColor={'black'}
        placeholder={t('searchPlaceholder')}
      />

      <TouchableOpacity onPress={() => handleOptionSelect('date')}>
        <Icon name={iconName} size={30} color={'black'} />
      </TouchableOpacity>

{/* Currently not neccessary.
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDialog}
        onRequestClose={() => setShowDialog(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDialog(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => handleOptionSelect('date')} style={styles.modalOption}>
                <Icon name="today" size={24} color="black" />
                <Text style={styles.modalText}>{t("timeDialogExactDate")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOptionSelect('dateRange')} style={styles.modalOption}>
                <Icon name="date-range" size={24} color="black" />
                <Text style={styles.modalText}>{t("timeDialogRange")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback> 
      </Modal>
*/}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: 'black'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 18,
    marginLeft: 10,
    color: 'black',
  },
});

export default Search;

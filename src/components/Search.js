import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import { useTranslation } from 'react-i18next'; 

const Search = ({ onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation(); // Hook to access translations

  // Function to handle text input change
  const handleTextChange = (text) => {
    setSearchQuery(text);
    onSearchChange(text); // Call the parent component's function with the updated value
  };

  return (
    <View style={styles.container}>
      <Icon name="magnifying-glass" size={30}  color={'black'} />
      <TextInput
        style={styles.input}
        onChangeText={handleTextChange} // Call handleTextChange when text changes
        value={searchQuery}
        placeholderTextColor={'black'}
        placeholder={t('searchPlaceholder')}
      />
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
});

export default Search;

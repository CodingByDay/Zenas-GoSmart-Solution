import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; 
import { getRootUrl, saveRootUrl } from '../storage/Persistence';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = () => {

  const navigation = useNavigation();
  const [serverUrl, setServerUrl] = useState('');
  const { t } = useTranslation(); // Hook to access translations

  useEffect(() => {
    const fetchRootUrl = async () => {
      try {
        const rootUrl = await getRootUrl();
        setServerUrl(rootUrl);
      } catch (error) {
        return;
      }
    };
    fetchRootUrl();
  }, []); // Call only once on component mount

  
  const handleSaveSettings = async () => {
    // Save settings logic here
    await saveRootUrl(serverUrl);

    // You can navigate back to the previous screen or perform any other action
    navigation.goBack();
  };


  const type = (text) => { 
    setServerUrl(text);
  }
  return (
    <View style={styles.container}>

      <View style={styles.labelContainer}>
        <Text style={styles.label}>{t('serverUrlLabel')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('serverUrlPlaceholder')}
          value={serverUrl}
          placeholderTextColor={'black'}
          onChangeText={text => type(text)} 
          autoCapitalize="none" 
          keyboardType="url"    
        />
      </View>
      <TouchableOpacity
            style={styles.saveButton} 
            onPress={handleSaveSettings}
            >
            <Icon name="save-alt" size={30}  color={'white'} />
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    marginRight: 10,
    color: 'black'
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'black'
  },
  saveButton: {
    backgroundColor: '#081a45',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },

});

export default SettingsScreen;

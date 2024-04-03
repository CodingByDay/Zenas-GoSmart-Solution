import React, {useEffect, useState, useRef} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Animated, ActivityIndicator } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { initializeApp, changeLanguage, getSavedLanguage, saveSessionId } from '../storage/Persistence';
import { checkSessionValidity, login, setInit } from '../api/api';



const LoginScreen = () => {
  const version = require('../../package.json').version;
  const { t, i18n } = useTranslation(); 
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [loader, setLoader] = useState(false);
  useEffect( () => {

    initializeApp(i18n);

    const init = async () => {
      await  setInit();
      const correctSessionId = await checkSessionValidity();
      if(correctSessionId) {
        navigation.navigate('Dashboard');
      }

      const lang = await getSavedLanguage();
      setSelectedLanguage(lang);
    };

    init();   
  }, []); 

  const startShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleLanguageChange = async (language) => {
    // Handle language change logic here
    await changeLanguage(language, i18n);
    setSelectedLanguage(language); // Update the selected language
  };

  const handleLogin = async () => {
    setLoader(true);
    if (username.length === 0 || password.length === 0) {
      startShakeAnimation();
      setTimeout(() => {
        setLoader(false);
      }, 1000); 
    } else {
      const sessionId = await login(username, password);
      if (sessionId) {
        setTimeout(() => {
          setLoader(false);
        }, 1000); 
        // Login successful, do something with the sessionId
        await saveSessionId(sessionId);
        navigation.navigate('Dashboard')
      } else {
        // Login failed
        startShakeAnimation();
        setTimeout(() => {
          setLoader(false);
        }, 1000); 
      }
    }
  };

  
  return (
    
    <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnimation }] }]}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholderTextColor='black' placeholder={t('username')} value={username} onChangeText={text => setUsername(text)}/>
        <TextInput style={styles.input} placeholderTextColor='black' placeholder={t('password')} value={password} secureTextEntry={true} onChangeText={text => setPassword(text)}/>

        <TouchableOpacity style={styles.loginButton} onPress={() => handleLogin()}>
          <Text style={styles.loginButtonText}>{t('loginButton')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.languageSwitcher}>
        <TouchableOpacity onPress={() => handleLanguageChange('sl')}>
          <Image source={require('../../assets/slovenian.png')} style={[styles.flagIcon, selectedLanguage === 'sl' ? { tintColor: 'rgba(8, 26, 69, 0.8)' } : null]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLanguageChange('en')}>
          <Image source={require('../../assets/english.png')} style={[styles.flagIcon, selectedLanguage === 'en' ? { tintColor: 'rgba(8, 26, 69, 0.8)' } : null]} />
        </TouchableOpacity>
      </View>


      <ActivityIndicator style={styles.loader} animating={loader} color={'#081a45'} size={32} />


      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>{t('version')}: {version}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginTop: 10
  },
  versionContainer: {
    position: 'absolute',
    bottom: 20, // Adjust as needed
    alignSelf: 'center',
  },
  versionText: {
    color: '#888',
    fontSize: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'black',
  },
  loginButton: {
    backgroundColor: '#081a45',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  flagIcon: {
    width: 50,
    height: 30,
    resizeMode: 'contain',
  },
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '30%',
  },
});

export default LoginScreen; 
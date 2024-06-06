import  AsyncStorage from '@react-native-async-storage/async-storage';
import { setInit } from '../api/api';

// Function to get the saved language
export const getSavedLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
    return savedLanguage ?? "en";
  } catch (error) {
    return "en";
  }
};

// Function to save the selected language
export const saveLanguage = async (language) => {
  try {
    await AsyncStorage.setItem('selectedLanguage', language);
  } catch (error) {
    return;
  }
};

// Function to get the sessionId
export const getSessionId = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('sessionId');
      return sessionId;
    } catch (error) {
      return "";
    }
  };
  
  // Function to save the sessionId
  export const saveSessionId = async (sessionId) => {
    try {
      await AsyncStorage.setItem('sessionId', sessionId);
      await setInit();
    } catch (error) {
      return;
    }
  };

  // Function to get the username
  export const getUsername = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        return username ? username : null;
      } catch (error) {
        return "";
      }
  };

  // Function to save the username
  export const saveUsername = async (username) => {
      try {
        await AsyncStorage.setItem('username', username);
      } catch (error) {
        return "";
      }
  };

  export const getRootUrl = async () => {
    try {
      const rootUrl = await AsyncStorage.getItem('rootUrl');
      return rootUrl || ""; // Return rootUrl if it exists, otherwise return an empty string
    } catch (error) {
      return ""; // Return an empty string in case of an error
    }
  };
  
  export const saveRootUrl = async (rootUrl) => {
    try {
      if (rootUrl !== undefined) { // Check if rootUrl is defined
        if (rootUrl !== null && rootUrl !== '') { // Check if rootUrl is neither null nor empty string
          await AsyncStorage.setItem('rootUrl', rootUrl.toString()); // Convert to string and save
        } else {
          // If rootUrl is null or empty string, remove the item entirely
          await AsyncStorage.removeItem('rootUrl');
        }
        await setInit();
      }
    } catch (error) {
      console.error("Error saving rootUrl:", error);
    }
  };

// When the app starts, retrieve the saved language (if any) and set it as the default language
export const initializeApp = async (i18n) => {
  const savedLanguage = await getSavedLanguage();
  if (savedLanguage) {
    // Apply the saved language
    i18n.changeLanguage(savedLanguage);
  }
};


// Function to handle language change
export const changeLanguage = async (language, i18n) => {
    try {
      // Save the selected language
      await saveLanguage(language);
      // Apply the new language
      i18n.changeLanguage(language);
    } catch (error) {
      return;
    }
  };

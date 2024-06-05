import { View, Text, TouchableOpacity, React } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import TaskScreen from './screens/TaskScreen';
import { MenuProvider } from 'react-native-popup-menu'; 
import Icon from 'react-native-vector-icons/Foundation';
import { useNavigation } from '@react-navigation/native';
import en from './localization/en.json'
import sl from './localization/sl.json'
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import 'intl-pluralrules';
import { RNSScreen } from 'react-native-screens';
import 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://fd840c73bcb52c0410dd2829de7bbcd7@o4507304617836544.ingest.de.sentry.io/4507373865664592',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // enableSpotlight: __DEV__,
});



const Stack = createStackNavigator();

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sl: { translation: sl }
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });


export default function App() {

  const { t } = useTranslation(); // Hook to access translations



  return (
    <NavigationContainer>
    <MenuProvider>
      
        <Stack.Navigator>

          <Stack.Screen

          name="Login" 
          component={LoginScreen} 
          options={({ navigation }) => ({ 
            headerTitle: 'Zenas GoSmart',
            headerTitleAlign: 'center',
            headerRight: () => (

              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                style={{ marginRight: 15 }}
              >
                <Icon name="widget" size={30}  color={'black'} />
              </TouchableOpacity>
            ),
          })}

          />

          <Stack.Screen 
          name="Dashboard"
          component={DashboardScreen} 
          options={({ navigation }) => ({ 
            title: 'Dashboardwr',
            headerTitle: 'Zenas GoSmart',
            headerTitleAlign: 'center',
          })}
          />
          <Stack.Screen
          name="Settings" 
          component={SettingsScreen}
          options={({ navigation }) => ({ 
            headerTitle: 'Zenas GoSmart',
            headerTitleAlign: 'center',
          })}
          />


          <Stack.Screen
          name="Task" 
          component={TaskScreen}
          options={({ navigation }) => ({ 
            headerTitle: 'Zenas GoSmart',
            headerTitleAlign: 'center',
          })}
          />



        </Stack.Navigator>
 
    </MenuProvider>
    </NavigationContainer>
  );
}


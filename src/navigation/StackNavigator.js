// navigation/StackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { TransitionPresets } from '@react-navigation/stack';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: true, // Enable animations for all screens
        headerShown: false, // Hide the header
        gestureEnabled: true, // Enable gestures for all screens
        ...TransitionPresets.ModalFadeTransition, // Set transition from bottom
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;

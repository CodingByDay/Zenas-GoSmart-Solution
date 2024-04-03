import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Ionicons for icons

const DashboardActions = ({ onCreateTask, onDeleteTask, onFinishTask, onMoveTask }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onCreateTask} style={styles.button}>
        <Ionicons name="add-circle-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDeleteTask} style={styles.button}>
        <Ionicons name="trash-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onFinishTask} style={styles.button}>
        <Ionicons name="checkmark-circle-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onMoveTask} style={styles.button}>
        <Ionicons name="move" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    padding: 10,
  },
});

export default DashboardActions;

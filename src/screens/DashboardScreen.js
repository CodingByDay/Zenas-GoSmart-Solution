import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import DashboardActions from '../components/DashboardActions';
import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { getOwnTasks, getTaskDetails } from '../api/api';
import Search from '../components/Search';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { saveSessionId } from '../storage/Persistence';

const DashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = useCallback(async () => {
    let tasksApi = await getOwnTasks();
    setTasks(tasksApi);
  }, []); // Empty dependency array to ensure it only runs once during component mount

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchTasks);

    return unsubscribe;
  }, [navigation, fetchTasks]);



  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const filteredTasks = tasks.filter((task) =>
    Object.values(task).some((value) =>
      typeof value === 'string' ? value.toLowerCase().includes(searchQuery.toLowerCase()) : false
    )
  );

  const handleTaskSelection = (taskId) => {
    if (taskId === selectedTaskId) {
      navigation.navigate('Task', { taskId: taskId });
    }
    setSelectedTaskId(taskId);
  };


  const logout = async () => {
    await saveSessionId("")
    navigation.navigate('Login');
  }

  // Custom header for DashboardScreen
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => logout()}  style={styles.backButton}>
          <Icon name="logout" size={30} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderTaskItem = ({ item }) => {
    const isSelected = item.Guid === selectedTaskId;
    const plannedDate = new Date(item.PlannedDate);
    const isFuture = plannedDate > new Date();
    const isToday = plannedDate.toDateString() === new Date().toDateString();

    const iconColor = isFuture || isToday ? 'green' : 'red';

    return (
      <TouchableOpacity onPress={() => handleTaskSelection(item.Guid)} style={[styles.taskContainer, isSelected && styles.selectedTask]}>
        <View style={styles.taskInfoRow}>
          <Text style={styles.taskInfoLabel}>{t('clientProperty')}</Text>
          <Text style={styles.taskInfoValue}>{item.Client}</Text>
        </View>
        <View style={styles.taskInfoRow}>
          <Text style={styles.taskInfoLabel}>{t('descriptionProperty')}</Text>
          <Text style={styles.taskInfoValue}>{item.Description}</Text>
        </View>
        <View style={styles.taskInfoRow}>
          <Text style={styles.taskInfoLabel}>{t('plannedDateProperty')}</Text>
          <Text style={styles.taskInfoValue}>{plannedDate.toISOString().split('T')[0]}</Text>
          <Icon name="access-time" size={30}  color={'black'}/>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Search onSearchChange={handleSearchChange} />
      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item, index) => (item && item.Guid) ? item.Guid : index.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={1} // Set to 1 to display one item per row
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    paddingLeft: 5,
  },
  container: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
  },
  taskContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  selectedTask: {
    backgroundColor: 'rgba(8, 26, 69, 0.5)',
  },
  taskInfoRow: {
    flexDirection: 'row',
    color: 'black',
    marginBottom: 5,
  },
  taskInfoLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 16,
    color: 'black',
    flexShrink: 0,
  },
  taskInfoValue: {
    fontSize: 16,
    color: 'black',
    flex: 1,
  },
});

export default DashboardScreen;

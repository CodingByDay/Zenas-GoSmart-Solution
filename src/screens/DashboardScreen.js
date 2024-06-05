import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import DashboardActions from '../components/DashboardActions';
import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { getOwnTasks, getTaskDetails } from '../api/api';
import Search from '../components/Search';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { initializeApp, changeLanguage, getSavedLanguage, saveSessionId, getSessionId, saveUsername } from '../storage/Persistence';


const DashboardScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true); 
  const [dateFilter, setDateFilterMode] = useState('');
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  const [dateFilterValue, setDateFilterValue] = useState(null);

  const fetchTasks = useCallback(async () => {
    let tasksApi = await getOwnTasks();
    setTasks(tasksApi);
    setIsLoading(false); // Once all data is fetched, set loading state to false
  }, []); // Empty dependency array to ensure it only runs once during component mount

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchTasks);
    return unsubscribe;
  }, [navigation, fetchTasks]);
  


  const setDateFilter = async (filter) => {
    if(filter != "") {
    setDateFilterMode(filter);
    } else {
      setDateFilterValue(null)
      setIsLoading(true);
      let tasksApi = await getOwnTasks();
      setTasks(tasksApi);
      setIsLoading(false);
      setIsDateFilterActive(false);
    }
  }

  const handleSearchChange = (query) => {
    filterTasks(query)
  };


  const filterTasks = async (query) => {

    setIsLoading(true);

    let tasksApi = await getOwnTasks();

    let filteredTasks = tasksApi.filter(task =>
      Object.values(task).some(value =>
          typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())
      )
    ); 
    
    setTasks(filteredTasks);

    if(dateFilterValue !=null) {
      filterTasksByDate(dateFilterValue, filteredTasks)
    }

    setIsLoading(false);
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTaskId(taskId);
    navigation.navigate('Task', { taskId: taskId }); 
    setSelectedTaskId(taskId);
  };


  const logout = async () => {
    await saveUsername("");
    await saveSessionId("")
    navigation.navigate('Login');
  }


  const saveQuit = async () => {
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
      headerRight: () => (
        <TouchableOpacity onPress={() => saveQuit()} style={styles.saveButton}>
          <Icon name="co-present" size={30} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  
  const renderTaskItem = ({ item }) => {

    const plannedDate = new Date(item.PlannedDate);
    const plannedDateWithoutTime = new Date(plannedDate.getFullYear(), plannedDate.getMonth(), plannedDate.getDate());
    const currentDateWithoutTime = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const isFuture = plannedDateWithoutTime > currentDateWithoutTime;
    const isToday = plannedDate.toDateString() === new Date().toDateString();

    let iconColor, textColor;
    
    if (isFuture) {
        iconColor = 'gray'; // Gray for tasks planned for one week ahead
        textColor = 'white';
    } else if (isToday) {
        iconColor = 'black'; // Black for tasks planned for today
        textColor = 'white'; // Font color is white for black background
    } else {
        iconColor = 'red'; // Red for tasks planned in the past
        textColor = 'white'; // Font color is white for red background
    }

    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Use 24-hour format
    };

    const formattedDate = plannedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const timeString = plannedDate.getHours() === 0 && plannedDate.getMinutes() === 0 ? '' : plannedDate.toLocaleTimeString('sl-SI', options);

    return (
        <TouchableOpacity onPress={() => handleTaskSelection(item.Guid)} style={[styles.taskContainer, { backgroundColor: iconColor }]}>
            <View style={styles.taskInfoRow}>
                <Text style={[styles.taskInfoLabel, { color: textColor }]}>{t('clientProperty')}</Text>
                <Text style={[styles.taskInfoValue, { color: textColor }]}>{item.Client}</Text>
            </View>
            <View style={styles.taskInfoRow}>
                <Text style={[styles.taskInfoLabel, { color: textColor }]}>{t('descriptionProperty')}</Text>
                <Text style={[styles.taskInfoValue, { color: textColor }]}>{item.Description}</Text>
            </View>
            <View style={styles.taskInfoRow}>
                <Text style={[styles.taskInfoLabel, { color: textColor }]}>{t('plannedDateProperty')}</Text>
                <Text style={[styles.taskInfoValue, { color: textColor }]}>
                    {formattedDate} {timeString && timeString}
                </Text>
                <Icon name="access-time" size={30} color={textColor} />
            </View>
        </TouchableOpacity>
    );
};
const hideDatePicker = () => {
  setDateFilterMode("")
};

const filterTasksByDate = (date, filtered) => {

    // Convert selectedDate to ISO string format for comparison
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

    // Filter tasks based on the selected date
    const filteredTasks = filtered.filter(task => {
      // Convert task PlannedDate to ISO string format for comparison
      const taskDateString = new Date(task.PlannedDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      
      // Return true if task PlannedDate matches selected date
      return taskDateString == formattedDate;
    });
    setTasks(filteredTasks);
}

const handleDateConfirm = (date) => {
  setDateFilterValue(date)
  filterTasksByDate(date, tasks)
  setDateFilterMode("")
  setIsDateFilterActive(true); // Set date filter active

};

  return (
    <View style={styles.container}>

            {dateFilter == 'date' && (
              <DateTimePickerModal
                isVisible={true}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
              />
            )}
      
      <Search cancel = {isDateFilterActive} setDateFilter={setDateFilter} onSearchChange={handleSearchChange} />

      {isLoading ? ( // Show loader if still loading
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={'#081a45'} size={32} />
        </View>
      ) : (
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item, index) => (item && item.Guid) ? item.Guid : index.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={1} // Set to 1 to display one item per row
      />

      )}


    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    paddingLeft: 5,
  },
  saveButton: {
    paddingRight: 5,
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
    borderWidth: 2, // Change the width of the border as needed
    borderColor: '#081a45', // Change the color of the border as needed
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

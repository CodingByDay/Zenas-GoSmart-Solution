import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'; 
import { getRootUrl, saveRootUrl } from '../storage/Persistence';
import { getTaskDetails, getTimeUsage, finishTaskCall } from '../api/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ButtonGroup from '../components/ButtonGroup';
import TimeFields from '../components/TimeFields';
import TimeComponent from '../components/TimeComponent';
import TimePlanned from '../components/TimePlanned';


const TaskScreen = ({ route }) => {
  const navigation = useNavigation();
  const [task, setTask] = useState('');
  const { t } = useTranslation(); // Hook to access translations
  const { taskId } = route.params;
  const [date, setDate] = useState(new Date());
  const [enabled, setEnabled] = useState(true);
  const [problemDescription, setProblemDescription] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [agreementDescription, setAgreementDescription] = useState('');
  const [timeFields, setTimeFields] = useState([]);
  const [implementedTime, setImplementedTime] = useState(null);

  useEffect(() => {

    const fetchTask = async () => {
      try {
        const task = await getTaskDetails(taskId);
        setTask(task);
        console.log(task)
        setProblemDescription(task.Description)
        const timeFields = await getTimeUsage();
        setTimeFields(timeFields);
      } catch (error) {
        return;
      }
    };
    fetchTask();
  }, []); 

  const setHoursForFields = (text, guid) => {
 
    const fields = timeFields.map(field => {
      if (field.TimeUsageTypeGuid === guid) {
        return { ...field, Used: text };
      } else {
        return field;
      }
    });

    setTimeFields(fields);

  };
  
  const finishTask = async () => {

    let toUpdate = [];
    let defined = 0;
    timeFields.forEach(field => {
      if (field.Used !== undefined && field.Used !== '') {
        const used = field.Used;
        const decimalValue = parseFloat(used);     
        if (isNaN(decimalValue)) {
            Alert.alert(t('alert'), t('wrongInput'));
            return; 
        } else {
            defined += 1;
            toUpdate.push(field);
        }
      } 
    });

    if(defined === 0) {
      Alert.alert(t('alert'), t('wrongInput'));
      return;
    }

    let usedHours = [];
    toUpdate.forEach(field => {
      usedHours.push({TimeUsageTypeGuid: field.TimeUsageTypeGuid, UsedHours: field.Used})
    });
    const response = await finishTaskCall(task.TaskGuid, workDescription, usedHours);
    if (response == "OK") {
      navigation.navigate("Dashboard");
    } else {
      Alert.alert(t('alert'), t('error'));
    }
  }

  const setActiveState = (activeButton) => {
    if(activeButton === "workDescription") {
      setEnabled(true);
    } else if(activeButton === "problemDescription") {
      setEnabled(false);
    } 
  }

  const setDescriptionStates = (activeButton, text) => {
    if(activeButton === "problemDescription") {
      setProblemDescription(text);
    } else if(activeButton === "workDescription") {
      setWorkDescription(text);
    } else if(activeButton === "agreementDescription") {
      setAgreementDescription(text);
    }
  }


  const setDateTime = (date) => {
    setImplementedTime(date);
  }



  return (

    <KeyboardAvoidingView 
    style={styles.container} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? -100 : 20} 
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>



      <TimeFields
      timeUsageTypes={timeFields}
      setHoursForFields = {setHoursForFields}
      plannedHours={task.PlannedAndUsedHoursWithBillingInfo}
      />


        <View style={styles.divider}></View>

        <ButtonGroup 
          setDescriptionStates={setDescriptionStates} 
          problemDescription={problemDescription} 
          workDescription={workDescription} 
          setActiveState={setActiveState}
          enabled={enabled}
        />

      {
      /* For the first version this is not needeed.
        <TaskTime />
      */
      }
        <TimePlanned plannedDate = {task.PlannedAt} />
        <TimeComponent setDateTime={setDateTime} />

        <View style={styles.bottomButtonsContainer}>
          <View style={styles.row}>

            {/* For the first version this is not needeed.
                       
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="save-outline" size={24} color="white" />
            </TouchableOpacity>

            */}

            <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {finishTask()}}
            >


            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Text style={styles.buttonText}>{t("finishTask")}</Text>
              <Icon name="send-and-archive" size={30}  color={'white'} />
            </View>

            </TouchableOpacity>

            <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {finishTask()}}
            >


            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Text style={styles.buttonText}>{t("saveTask")}</Text>
              <Icon name="save-alt" size={30}  color={'white'} />
            </View>
          
            </TouchableOpacity>
        
          </View>
        </View>

        
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({

  iconButton: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5, // You can adjust the spacing between the icon and text
  },
  container: {
    flex: 1,
    color: 'black',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowFirst: {
    marginBottom:10,
    flexDirection: 'row',
    justifyContent: 'flex-end', 
  },
  label: {
    marginRight: 10,
    fontWeight: 'bold',
    width: '70%',
    color: 'black'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 0,
  },
  smallInput: {
    flex: 0.5, 
    marginRight: 10, 
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#081a45',
    color: 'white', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white', 
  },
  iconButton: {
    width: 100, 
    height: 40, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#081a45',        
    borderRadius: 5,
    marginLeft: 10,
    marginTop: 30
  },
  bottomButtonsContainer: {
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    marginBottom: 20, 
  },
  taskName: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 18,
    textDecorationLine: 'underline',
  }
});

export default TaskScreen;

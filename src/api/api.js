  import axios from 'axios';
  import { AsyncStorage } from '@react-native-async-storage/async-storage';
  import { getRootUrl, getSessionId} from '../storage/Persistence';



  // Define tha variables 
  let baseURL = '';
  let sessionId = '' 






  // Also call this for refreshing purposes
    const setInit = async () => {
   
    const rootUrl = await getRootUrl();
    if (rootUrl) {
      baseURL = rootUrl;
    } else {
      baseURL = "";
    }
    const sessionIdResolved = await getSessionId();
    if (sessionIdResolved) {
      sessionId = sessionIdResolved;
    }
  };
  




  const checkSessionValidity = async () => {
    try {
      const response = await axios.get(`${baseURL}/nfxapi/user/check/${sessionId}`);
      return response.data.Success;
    } catch (error) {
      return false;
    }
  };

  // Function to log in and get a new session ID
  const login = async (username, password) => {
    try {
      const response = await axios.post(`${baseURL}/nfxapi/user/login`, {
        Username: username,
        Password: password
      });
      if (response.data.Success) {
        return response.data.SessionID;
      } else {
        return null;
        
      }
    } catch (error) {

      return null;
    }
  };

  // Function to get a list of own tasks
  const getOwnTasks = async () => {
    try {
      const response = await axios.get(`${baseURL}/nfxapi/task/listOwn/${sessionId}`);

      if (response.data.Success) {
        return response.data.Tasks;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  };

  // Function to get details of a specific task
  const getTaskDetails = async (taskGuid) => {
  
    try {
      const response = await axios.get(`${baseURL}/nfxapi/task/get/${sessionId}/${taskGuid}`);
      if (response.data.Success) {
        return response.data.Task;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

// Function to get details about which time fields to include and what not to include
const getTimeUsage = async () => {
  try {
    const response = await axios.get(`${baseURL}/nfxapi/timeUsageType/list`);
    if (response.data) {
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};
const finishTaskCall = async (taskGuid, notes, usedHours) => {
  try {
    const sessionId = await getSessionId();
    const response = await axios.post(
      `${baseURL}/nfxapi/task/finish`,
      {
        TaskGuid: taskGuid,
        Notes: notes,
        UsedHours: usedHours
      },
      {
        headers: {
          Authorization: sessionId // Assuming you need to send the session ID as Authorization header
        }
      }
    );
    if (response.data === 'OK') {
      return 'OK';
    } else {
      return 'Error'; 
    }
  } catch (error) {
    return 'Error'; 
  }
};


  export { checkSessionValidity, login, getOwnTasks, getTaskDetails, getTimeUsage, finishTaskCall, setInit};
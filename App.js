import React from 'react';
import { View } from 'react-native';
import Settings from './Screens/Settings'
import Test_Code from './TestCodes/TemporaryCode'
import CameraScreen from './TestCodes/CameraCode'
import Login from './Screens/Login'
import Signup from './Screens/Signup'
import {Start,TabNav} from './Screens/AppStart'
import serverURL from './SensitiveData'

const App=()=>{
  global.url=serverURL
  console.log("Server url is: ");
  console.log(url);
  
  return(
    <Start/>
  );
}
export default App;
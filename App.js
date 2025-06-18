import React from 'react';
import {Start} from './Screens/AppStart'
import serverURL from './SensitiveData'
import StartStack from './TestCodes/TestCode03StackNav'

const App=()=>{
  global.url=serverURL
  console.log("Server url is: ");
  console.log(url);
  
  return(
    <Start/>
    // <StartStack/>
  );
}
export default App;
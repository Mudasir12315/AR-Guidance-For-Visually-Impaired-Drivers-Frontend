import React from 'react';
import {Start} from './Screens/AppStart'
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
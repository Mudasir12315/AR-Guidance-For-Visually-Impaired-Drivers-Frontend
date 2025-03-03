// import React, {useEffect, useState} from 'react';
// import {View} from 'react-native';
// import Tts from 'react-native-tts';

// const Test_Code = () => {
//   const [hasSpoken, setHasSpoken] = useState(false); // Track if speech has occurred

//   useEffect(() => {
//     if (!hasSpoken) {
//       // Speak only if it hasn't spoken before
//       Tts.speak('Rawalpindi?');
//       setHasSpoken(true); // Update state so it doesn't speak again
//     }
//   }, [hasSpoken]); // Dependency ensures it only runs once

//   return <View />;
// };

// export default Test_Code;

// import React, { useState } from "react";
// import { View, Text } from "react-native";
// import { Checkbox } from "react-native-paper";

// const Test_Code = () => {
//   const [checked, setChecked] = useState(false);

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Checkbox
//         status={checked ? "checked" : "unchecked"}
//         onPress={() => setChecked(!checked)}
//       />
//       <Text>Remember Me</Text>
//     </View>
//   );
// };

// export default Test_Code;

import React, { useState } from 'react';
import { Button, Dialog, Portal, Text,View } from 'react-native-paper';

const MyComponent = () => {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <>
      <Button onPress={showDialog}>Show Alert</Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Text>This is a beautiful alert dialog!</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
export default MyComponent


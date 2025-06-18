import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import HomeMenu from './TestCode04HomeMenu'
import TestMode from "./TestCode05Mode";
import TestCodeARMode from "./TestCode06ARMode";

const StartStack = () => {
    const Stack = createNativeStackNavigator();
    
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="HomeMenu" component={HomeMenu} options={{ headerShown: false }} />
                <Stack.Screen name="TestMode" component={TestMode} options={{ headerShown: false }} />
                <Stack.Screen name="TestCodeARMode" component={TestCodeARMode} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default StartStack;
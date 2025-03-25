import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";
import ResetPasswordSuccess from "./ResetPasswordSuccess";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./Home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Question1 from "./Question1";
import Question2 from "./Question2";
import Question3 from "./Question3";
import Settings from "./Settings";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Image } from "react-native";
import Account from "./Account";
import ChangePassword from "./ChangePassword";
import SimpleMode from "./SimpleMode";
import UserLog from "./UserLog";
import Notifications from "./Notifications";

const TabNav = ({ route }) => {
    const { userID } = route.params || {};
    console.log("TabNav userID:", userID);

    const Tab = createBottomTabNavigator();
    
    return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "Home") {
                        iconName = "home"; 
                    } else if (route.name === "Settings") {
                        iconName = "settings"; 
                    } else if (route.name === "Account") {
                        iconName = "person"; 
                    }
                    else if (route.name === "UserLog") {
                        // Return a custom image for UserLog
                        return (
                            <View 
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: size + 8, 
                                    height: size + 8,
                                    borderRadius: 10,
                                    backgroundColor: focused ? "rgba(84, 84, 84, 0.3)" : "transparent",
                                }}
                            >
                                <Image 
                                    source={require("../Images/userlog.png")} // Path to your image
                                    style={{ width: size, height: size, tintColor: color }}
                                    resizeMode="contain"
                                />
                            </View>
                        );
                    }
                    else if (route.name === "Notifications") {
                        return (
                            <View 
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: size + 8, 
                                    height: size + 8,
                                    borderRadius: 10,
                                    backgroundColor: focused ? "rgba(84, 84, 84, 0.3)" : "transparent",
                                }}
                            >
                                <Image 
                                    source={require("../Images/notification.png")} // Path to your image
                                    style={{ width: size, height: size, tintColor: color }}
                                    resizeMode="contain"
                                />
                            </View>
                        );
                    }

                    return (
                        <View 
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                width: size + 8,
                                height: size + 8,
                                borderRadius: 10,
                                backgroundColor: focused ? "rgba(84, 84, 84, 0.3)" : "transparent",
                            }}
                        >
                            <Icon name={iconName} size={size} color={color} />
                        </View>
                    );              
                },
                tabBarActiveTintColor: "black",
                tabBarInactiveTintColor: "gray",
                tabBarStyle: { backgroundColor: "white", paddingBottom: 5 },
                headerShown: false
            })}
        >
            <Tab.Screen name="Home" component={Home} initialParams={{ userID }} />
            <Tab.Screen name="Settings" component={Settings} initialParams={{ userID }} />
            <Tab.Screen name="UserLog" component={UserLog} initialParams={{ userID }} />
            <Tab.Screen name="Notifications" component={Notifications} initialParams={{ userID }} />
            <Tab.Screen name="Account" component={Account} initialParams={{ userID }} />
        </Tab.Navigator>
    );
};

const Start = () => {
    const Stack = createNativeStackNavigator();
    
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="signup" component={Signup} options={{ headerShown: false }} />
                <Stack.Screen name="resetpassword" component={ResetPassword} options={{ headerShown: false }} />
                <Stack.Screen name="resetpasswordsuccess" component={ResetPasswordSuccess} options={{ headerShown: false }} />
                <Stack.Screen name="question1" component={Question1} options={{ headerShown: false }} />
                <Stack.Screen name="question2" component={Question2} options={{ headerShown: false }} />
                <Stack.Screen name="question3" component={Question3} options={{ headerShown: false }} />
                <Stack.Screen name="changepassword" component={ChangePassword} options={{ headerShown: false }} />
                <Stack.Screen name="simplemode" component={SimpleMode} options={{ headerShown: false }} />
                <Stack.Screen name="tab" component={TabNav} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export { Start, TabNav };

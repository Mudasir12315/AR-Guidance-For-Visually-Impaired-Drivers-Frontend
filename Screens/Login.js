import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { Checkbox } from "react-native-paper";

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(true)


    const getPreference = async (userID) => {
        try {
            let response = await fetch(`${url}/get_preferences/${userID}`)
            let data = await response.json()
            if (response.ok) {
                console.log("Response is OK with data:")
                console.log(data)
                console.log("User ID being passed:", data.message.user_id)
                navigation.replace('tab', { userID: data.message.user_id })
            }
            else if (response.status === 404) {
                navigation.navigate('question1', { userID: userID });
            }
            else {
                console.log("Error from the server side: " + data)
            }
        }
        catch (error) {
            console.log("Error sending request to the server: " + error.message);
        }
    }

    const isAlreadyLoggedIn = async () => {
        try {
            let user = await AsyncStorage.getItem('user');
            if (user) {
                console.log("User data in async storage: " + user);
                user = JSON.parse(user);
                if (user.isRemembered) {
                    console.log("Remember me is checked");
                    await getPreference(user.userID)
                }
                else {
                    console.log("Remember Me is not checked");
                }
            }
            else {
                console.log('No data present');
            }
        } catch (error) {
            console.error('Error fetching data from async storage:', error);
        }
    };

    useEffect(() => {
        isAlreadyLoggedIn();
    }, []);


    // useEffect(()=>{
    //     const clearStorage = async () => {
    //         try {
    //           await AsyncStorage.clear();
    //           console.log('AsyncStorage is now empty!');
    //         } catch (error) {
    //           console.error('Error clearing AsyncStorage:', error);
    //         }
    //       };
    //       clearStorage()
    // },[])



    const authenticateUser = async () => {
        if (!email || !password) {
            Alert.alert("All fields are required")
            return
        }
        try {
            const res = await fetch(`${url}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'email': email,
                    'password': password
                })
            })
            let data = await res.json()
            if (res.ok) {
                console.log("User logged in successfully: " + JSON.stringify(data));
                if (rememberMe) {
                    let user = await AsyncStorage.getItem('user')
                    if (user) {
                        user = JSON.parse(user)
                        if (user.userID == data.user_id) {
                            user.isRemembered = true
                            await AsyncStorage.setItem('user', JSON.stringify(user))
                            await getPreference(data.user_id)
                            return
                        }
                        await AsyncStorage.setItem('user', JSON.stringify({ 'isRemembered': true, 'userID': data.user_id }))
                        await getPreference(data.user_id)
                    }
                    else {
                        await AsyncStorage.setItem('user', JSON.stringify({ 'isRemembered': true, 'userID': data.user_id }))
                        await getPreference(data.user_id)
                    }
                }
                else {
                    let user = await AsyncStorage.getItem('user')
                    if (user) {
                        user = JSON.parse(user)
                        if (user.userID == data.user_id) {
                            user.isRemembered = false
                            await AsyncStorage.setItem('user', JSON.stringify(user))
                            await getPreference(data.user_id)
                            return
                        }
                        await AsyncStorage.setItem('user', JSON.stringify({ 'isRemembered': false, 'userID': data.user_id }))
                        await getPreference(data.user_id)
                    }
                    else {
                        await AsyncStorage.setItem('user', JSON.stringify({ 'isRemembered': false, 'userID': data.user_id }))
                        await getPreference(data.user_id)
                    }
                }
            }
            else {
                Alert.alert(data.Error)
            }
        } catch (error) {
            console.log("Error sending request to the server: " + error.message)
        }
    }


    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#102C57' }}>
            <View>
                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <Text style={styles.heading}>AR Guidance App</Text>
                    <Image source={require('../Images/login.png')} resizeMode="stretch" style={{ alignSelf: 'center', margin: 50 }}></Image>

                    {/* Email */}
                    <Text style={styles.email_heading}>Email</Text>
                    <View style={styles.container}>
                        <TextInput placeholder="Enter your email" placeholderTextColor='black'
                            style={styles.text_input}
                            multiline={false} // Ensures single-line input
                            numberOfLines={1} // Keeps it in one line
                            scrollEnabled={true} // Allows horizontal scrolling
                            onChangeText={(val) => { setEmail(val) }}
                            value={email}
                            keyboardType="email-address" // This makes the keyboard suitable for entering emails
                            autoCapitalize="none" // Prevents automatic capitalization
                        ></TextInput>
                        <Image source={require('../Images/mail.png')} style={styles.icon} resizeMode="center"></Image>
                    </View>

                    {/* Password */}
                    <Text style={styles.email_heading}>Password</Text>
                    <View style={styles.container}>
                        <TextInput placeholder="Enter your password" placeholderTextColor='black'
                            style={styles.text_input}
                            multiline={false} // Ensures single-line input
                            numberOfLines={1} // Keeps it in one line
                            scrollEnabled={true} // Allows horizontal scrolling
                            secureTextEntry={passwordVisible}
                            onChangeText={(val) => { setPassword(val) }}
                            value={password}
                            autoCapitalize="none"
                        ></TextInput>
                        <TouchableOpacity onPress={() => {
                            setPasswordVisible(!passwordVisible)
                        }}>
                            <Image source={passwordVisible ? require('../Images/passwordhide.png') : require('../Images/passwordshow.png')} style={styles.icon} resizeMode="center"></Image>
                        </TouchableOpacity>


                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                            <Checkbox
                                status={rememberMe ? 'checked' : 'unchecked'}
                                onPress={() => { setRememberMe(!rememberMe) }}
                                color="white" // Sets the tick (checkmark) color when checked
                                uncheckedColor="white" // Sets the border color when unchecked
                            />
                            <Text style={{ color: 'white', fontSize: 12 }}>Remember Me</Text>
                        </View>
                        <View style={{ marginRight: 20 }}>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('resetpassword')
                            }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    <TouchableOpacity style={styles.btn} onPress={() => {
                        console.log("Login Button Pressed")
                        authenticateUser()
                    }
                    }>
                        <Text style={{ alignSelf: 'center', fontWeight: 900, fontSize: 20, marginTop: 5 }}>Login</Text>
                    </TouchableOpacity>


                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 12 }}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('signup')
                        }}>
                            <Text style={{ color: 'white', fontSize: 12, color: '#DAC0A3', textDecorationLine: 'underline', fontWeight: '900' }}>SignUp</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    heading: {
        color: 'white', marginTop: 30, textAlign: 'center', fontSize: 25, fontWeight: '900'
    },
    email_heading: {
        color: 'white', marginLeft: 22, fontWeight: '900'
    },
    text_input: {
        backgroundColor: 'white', borderRadius: 30, margin: 15, color: 'black', paddingRight: 40, paddingLeft: 10
    },
    container: {
        position: 'relative',
        width: '100%',
    },
    icon: {
        position: 'absolute',
        right: 30,
        bottom: 25, // Adjust for positioning inside the input
        width: 20,
        height: 20,
        marginLeft: 10
    },
    btn: {
        margin: 30,
        width: '90%',
        height: 40,
        alignSelf: 'center',
        backgroundColor: '#DAC0A3',
        borderRadius: 20,
    }
})
export default Login
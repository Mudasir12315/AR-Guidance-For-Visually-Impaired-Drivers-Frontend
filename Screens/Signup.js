import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const Signup = ({navigation}) => {
    const [fullname, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(true)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true)

    const addUser = async () => {
        if (!fullname || !email || !password || !confirmPassword) {
            Alert.alert("All fields are required")
            return
        }
        else if (password.length > 5) {
            if (confirmPassword != password) {
                Alert.alert("Confirm password didnot match")
                return
            }
        }
        else {
            Alert.alert("Password length should be atleast 6 characters")
            return
        }
        try {
            const res = await fetch(`${url}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'full_name': fullname,
                    'email': email,
                    'password': password,
                    'is_logout': 1
                })
            })
            let data = await res.json()
            if (res.ok) {
                //Alert.alert(data.message)
                console.log(data);
                navigation.navigate('login')
            }
            else {
                Alert.alert(data.Error)
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <ScrollView style={{flex:1,backgroundColor:'#102C57' }}>
            <View style={{ marginLeft: 10, marginRight: 10}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                            navigation.navigate('login')
                        }
                    }>
                        <Image
                            source={require('../Images/backarrow.png')}
                            style={{ width: 20, height: 20, marginRight: 10, marginTop: 30, marginLeft: 10 }}
                        />
                    </TouchableOpacity>
                    <Text style={styles.heading}>AR Guidance App</Text>
                </View>
                <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold', margin: 20, marginTop: 40 }}>Create Account Now!</Text>

                {/* Full name*/}
                <Text style={styles.email_heading}>Full Name</Text>
                <View style={styles.container}>
                    <TextInput placeholder="Enter your full name" placeholderTextColor='black'
                        style={styles.text_input}
                        multiline={false} // Ensures single-line input
                        numberOfLines={1} // Keeps it in one line
                        scrollEnabled={true} // Allows horizontal scrolling
                        onChangeText={(val) => { setFullName(val) }}
                        value={fullname}
                    ></TextInput>
                    <Image source={require('../Images/fullname.png')} style={styles.icon} resizeMode="cover"></Image>
                </View>


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
                    ></TextInput>
                    <TouchableOpacity onPress={() => {
                        setPasswordVisible(!passwordVisible)
                    }}>
                        <Image source={passwordVisible ? require('../Images/passwordhide.png'):require('../Images/passwordshow.png')} style={styles.icon} resizeMode="center"></Image>
                    </TouchableOpacity>
                </View>


                {/* Confirm Password */}
                <Text style={styles.email_heading}>Confirm Password</Text>
                <View style={styles.container}>
                    <TextInput placeholder="Enter your password again" placeholderTextColor='black'
                        style={styles.text_input}
                        multiline={false} // Ensures single-line input
                        numberOfLines={1} // Keeps it in one line
                        scrollEnabled={true} // Allows horizontal scrolling
                        secureTextEntry={confirmPasswordVisible}
                        onChangeText={(val) => { setConfirmPassword(val) }}
                        value={confirmPassword}
                    ></TextInput>
                    <TouchableOpacity onPress={() => {
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                    }}>
                        <Image source={confirmPasswordVisible ? require('../Images/passwordhide.png'):require('../Images/passwordshow.png')} style={styles.icon} resizeMode="center"></Image>
                    </TouchableOpacity>
                </View>


                {/* SignUp Button */}
                <TouchableOpacity style={styles.btn} onPress={() => {
                    console.log("Signup Button Pressed")
                    addUser()
                }
                }>
                    <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 20, marginTop: 5 }}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    heading: {
        color: 'white', marginTop: 30, marginLeft: 52, fontSize: 25, fontWeight: '900'
    },
    email_heading: {
        color: 'white', marginLeft: 22, fontWeight: '900', marginTop: 15
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
export default Signup
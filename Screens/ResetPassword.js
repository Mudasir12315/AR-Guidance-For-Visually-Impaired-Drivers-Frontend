import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const ResetPassword = ({navigation}) => {
    const [email, setEmail] = useState('')  

    const addUser = async () => {
        if (!email) {
            Alert.alert("Email is required")
            return
        }
        try {
            const res = await fetch(`${url}/reset/password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'email': email,
                })
            })
            let data = await res.json()
            if (res.ok) {
                navigation.navigate('resetpasswordsuccess')
            }
            else {
                Alert.alert(data.error)
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
                <Image source={require('../Images/forgotpassword.png')} resizeMode="stretch" style={{ alignSelf: 'center', margin: 50 }}></Image>
                <Text style={{ color: 'white', fontSize: 25, fontWeight: '900', margin: 20}}>Reset Your Password</Text>

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

                {/* SignUp Button */}
                <TouchableOpacity style={styles.btn} onPress={() => {
                    console.log("Reser Button Pressed")
                    addUser()
                }
                }>
                    <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 20, marginTop: 5 }}>Reset</Text>
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
export default ResetPassword
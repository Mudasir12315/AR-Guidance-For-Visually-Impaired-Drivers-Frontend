import React, { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from "react-native";

const ChangePassword = ({ navigation, route }) => {
    const user = route.params

    console.log("--------------------Change Password Screen----------------------");
    console.log(user);

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [currentPasswordVisible, setCurrentPasswordVisible] = useState(true)
    const [newPasswordVisible, setNewPasswordVisible] = useState(true)
    const [confirmNewPasswordVisible, setConfirmNewPasswordVisible] = useState(true)
    const [successMessageVisible,setSuccessMessageVisible]=useState(false)

    const changePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            Alert.alert("All fields are required")
            return
        }
        else if (newPassword.length > 5) {
            if (newPassword != confirmNewPassword) {
                Alert.alert("Confirm password didnot match")
                return
            }
        }
        else {
            Alert.alert("Password length should be atleast 6 characters")
            return
        }
        try {
            const res = await fetch(`${url}/change/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'user_id': user.userID,
                    'current_password': currentPassword,
                    'new_password': newPassword
                })
            })
            let data = await res.json()
            if (res.ok) {
                setSuccessMessageVisible(true)
                console.log(data);
            }
            else {
                Alert.alert(data.Error)
            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <View style={{ flex: 1, backgroundColor: '#102C57' }}>
            <ScrollView contentContainerStyle={{paddingBottom:50}}>
                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            navigation.goBack()
                        }
                        }>
                            <Image
                                source={require('../Images/backarrow.png')}
                                style={{ width: 20, height: 20, marginRight: 10, marginTop: 30, marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                        <Text style={styles.heading}>Change Password</Text>
                    </View>


                    {/* Current Password */}
                    <Text style={[styles.email_heading, { marginTop: 80 }]}>Enter current password</Text>
                    <View style={styles.container}>
                        <TextInput placeholder="Enter current password" placeholderTextColor='black'
                            style={styles.text_input}
                            multiline={false} // Ensures single-line input
                            numberOfLines={1} // Keeps it in one line
                            scrollEnabled={true} // Allows horizontal scrolling
                            secureTextEntry={currentPasswordVisible}
                            onChangeText={(val) => { setCurrentPassword(val) }}
                            value={currentPassword}
                        ></TextInput>
                        <TouchableOpacity onPress={() => {
                            setCurrentPasswordVisible(!currentPasswordVisible)
                        }}>
                            <Image source={currentPasswordVisible ? require('../Images/passwordhide.png') : require('../Images/passwordshow.png')} style={styles.icon} resizeMode="center"></Image>
                        </TouchableOpacity>
                    </View>


                    {/* New Password */}
                    <Text style={styles.email_heading}>Enter new password</Text>
                    <View style={styles.container}>
                        <TextInput placeholder="Enter new password" placeholderTextColor='black'
                            style={styles.text_input}
                            multiline={false} // Ensures single-line input
                            numberOfLines={1} // Keeps it in one line
                            scrollEnabled={true} // Allows horizontal scrolling
                            secureTextEntry={newPasswordVisible}
                            onChangeText={(val) => { setNewPassword(val) }}
                            value={newPassword}
                        ></TextInput>
                        <TouchableOpacity onPress={() => {
                            setNewPasswordVisible(!newPasswordVisible)
                        }}>
                            <Image source={newPasswordVisible ? require('../Images/passwordhide.png') : require('../Images/passwordshow.png')} style={styles.icon} resizeMode="center"></Image>
                        </TouchableOpacity>
                    </View>


                    {/* Confirm New Password */}
                    <Text style={styles.email_heading}>Confirm new password</Text>
                    <View style={styles.container}>
                        <TextInput placeholder="Re-enter new password" placeholderTextColor='black'
                            style={styles.text_input}
                            multiline={false} // Ensures single-line input
                            numberOfLines={1} // Keeps it in one line
                            scrollEnabled={true} // Allows horizontal scrolling
                            secureTextEntry={confirmNewPasswordVisible}
                            onChangeText={(val) => { setConfirmNewPassword(val) }}
                            value={confirmNewPassword}
                        ></TextInput>
                        <TouchableOpacity onPress={() => {
                            setConfirmNewPasswordVisible(!confirmNewPasswordVisible)
                        }}>
                            <Image source={confirmNewPasswordVisible ? require('../Images/passwordhide.png') : require('../Images/passwordshow.png')} style={styles.icon} resizeMode="center"></Image>
                        </TouchableOpacity>
                    </View>


                    {/* Change Button */}
                    <TouchableOpacity style={styles.btn} onPress={() => {
                        console.log("Signup Button Pressed")
                        changePassword()
                    }
                    }>
                        <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 20, marginTop: 5 }}>Change</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/* Success Message */}
            {successMessageVisible && (
                <View style={styles.successContainer}>
                    <Text style={styles.successMessage}>Password sent to your mail</Text>
                    <TouchableOpacity onPress={()=>setSuccessMessageVisible(false)}>
                        <Image
                            source={require('../Images/close.png')}
                            style={styles.closeImage}
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>


    )
}

const styles = StyleSheet.create({
    heading: {
        color: 'white', marginTop: 30, marginLeft: 42, fontSize: 25, fontWeight: '900'
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
    },
    successContainer: {
        flexDirection: 'row', // Align text and image horizontally
        justifyContent: 'space-between', // Text on left, image on right
        alignItems: 'center', // Vertically center both
        width: '100%',
        height: 40,
        backgroundColor: 'green',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    successMessage: {
        color: 'white',
        paddingLeft: 20,
        fontSize: 16,
    },
    closeImage: {
        width: 20,
        height: 20,
        marginRight: 20,
    },
})
export default ChangePassword
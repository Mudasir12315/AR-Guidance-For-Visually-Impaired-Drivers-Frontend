import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Question3 = ({ navigation, route }) => {
    const user = route.params

    console.log("---------Question3 screen-----------");
    console.log(user);

    const goToHomeScreen = async (peripheralStatus) => {
        try {
            console.log("peripheralStatus value is " + (peripheralStatus ? "Yes" : "No"));
            console.log("Sending request to save user preferences.........");
            const response = await fetch(`${url}/save/preferences`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'user_id': user.userID,
                        'peripheral_threshold': 5,
                        'distance_threshold': 5,
                        'distance_status': user.distanceStatus,
                        'peripheral_status': peripheralStatus,   //peripheralStatus is not stored in user object till now
                        'color_status': user.isColorBlind
                    })
                }
            )
            if (response.ok) {
                let data = await response.json()
                console.log(data.message);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'tab', params: { userID:user.userID } }],
                });
            }
            else {
                let data = await response.json()
                console.log(data.Error)
            }
        }
        catch (error) {
            console.log("Error sending request to the server ", error.message);
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: '#102C57' }}>
            <Text style={styles.heading}>AR Guidance App</Text>
            <Text style={styles.question}>Do you have peripheral vision problem?</Text>
            <TouchableOpacity style={styles.btn} onPress={() => {
                goToHomeScreen(true)
            }
            }>
                <Text style={{ alignSelf: 'center', fontWeight: 900, fontSize: 20, marginTop: 5 }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => {
                goToHomeScreen(false)
            }
            }>
                <Text style={{ alignSelf: 'center', fontWeight: 900, fontSize: 20, marginTop: 5 }}>No</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    heading: {
        color: 'white', marginTop: 30, textAlign: 'center', fontSize: 25, fontWeight: '900'
    },
    question: {
        color: 'white', marginTop: 120, marginLeft: 25, fontWeight: '900', fontSize: 25
    },
    btn: {
        marginTop: 30,
        width: '90%',
        height: 40,
        alignSelf: 'center',
        backgroundColor: '#DAC0A3',
        borderRadius: 20,
    }
})
export default Question3
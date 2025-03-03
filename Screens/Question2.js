import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Question2 = ({ navigation, route }) => {
    const user = route.params

    console.log("---------Question2 screen-----------");
    console.log(user);

    const navigateOnQuestion3 = (distanceStatus) => {
        console.log("distanceStatus value is " + (distanceStatus ? "Yes" : "No"));
        navigation.navigate('question3', { ...user, distanceStatus: distanceStatus })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#102C57' }}>
            <Text style={styles.heading}>AR Guidance App</Text>
            <Text style={styles.question}>Do you have distance vision problem?</Text>
            <TouchableOpacity style={styles.btn} onPress={() => {
                navigateOnQuestion3(true)
            }
            }>
                <Text style={{ alignSelf: 'center', fontWeight: 900, fontSize: 20, marginTop: 5 }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => {
                navigateOnQuestion3(false)
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
export default Question2
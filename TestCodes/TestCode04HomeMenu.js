import React from "react";
import { StyleSheet, Text, TouchableOpacity, View,ScrollView } from "react-native";

const HomeMenu = ({navigation}) => {

    console.log("--------------------Welcome to Home Menu---------------------");
    
    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#102C57'}}>
        <View style={{marginBottom:40 }}>
            <Text style={styles.heading}>AR Guidance App</Text>

            {/* Front Mode */}
            <TouchableOpacity style={styles.btn} onPress={() => {
                    console.log("Front Mode selected")
                    navigation.navigate('TestMode',{userID:11,cameraMode:2})
                }
            }>
                <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 30, marginTop: 5 }}>Front Mode</Text>
            </TouchableOpacity>

            {/* Left Mirror Mode */}
            <TouchableOpacity style={styles.btn} onPress={() => {
                    console.log("Left Mirror selected")
                    navigation.navigate('TestMode',{userID:11,cameraMode:0})
                }
            }>
                <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 30, marginTop: 5 }}>Left Mirror Mode</Text>
            </TouchableOpacity>

            {/* Right Mirror Mode */}
            <TouchableOpacity style={styles.btn} onPress={() => {
                    console.log("Right Mirror selected")
                    navigation.navigate('TestMode',{userID:11,cameraMode:1})
                }
            }>
                <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 30, marginTop: 5 }}>Right Mirror Mode</Text>
            </TouchableOpacity>

            {/* AR Mode */}
            <TouchableOpacity style={styles.btn} onPress={() => {
                    console.log("AR Mode selected")
                    navigation.navigate('TestCodeARMode',{userID:11})
                }
            }>
                <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 30, marginTop: 5 }}>AR Mode</Text>
            </TouchableOpacity>
        </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    heading: {
        color: 'white', marginTop: 30, textAlign: 'center', fontSize: 25, fontWeight: '900',marginBottom: 50
    },
    btn: {
        marginTop: 30,
        width: '50%',
        height: 150,
        alignSelf: 'center',
        justifyContent:'center',
        backgroundColor: '#DAC0A3',
        borderRadius: 20,
        
    }
})
export default HomeMenu
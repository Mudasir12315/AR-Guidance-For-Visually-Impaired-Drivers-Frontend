import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native"
import { SelectList } from "react-native-dropdown-select-list";

const Settings = ({navigation,route}) => {
    const user=route.params
    console.log("---------------Settings screen---------: ");
    console.log(user);
    
    
    const [peripheralStatus, setPeripheralStatus] = useState("")
    const [peripheralThreshold, setPeripheralThreshold] = useState("")
    const [distanceVisionStatus, setDistanceVisionStatus] = useState("")
    const [distanceVisionThreshold, setDistanceVisionThreshold] = useState("")
    const [colorBlindStatus, setcolorBlindStatus] = useState("")
    const data = [{ key: 1, value: "Yes" }, { key: 2, value: "No" }]

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Sending request.........");
                const response = await fetch(`${url}/get_preferences/${user.userID}`) //1 is the user id
                if (response.ok) {
                    let data = await response.json()
                    console.log("Data retrieved ", data);
                    setPeripheralStatus(data.message.peripheral_status ? "Yes" : "No")
                    setPeripheralThreshold(String(data.message.peripheral_threshold))
                    setDistanceVisionStatus(data.message.distance_status ? "Yes" : "No")
                    setDistanceVisionThreshold(String(data.message.distance_threshold))
                    setcolorBlindStatus(data.message.color_status ? "Yes" : "No")
                }
                else {
                    let data = await response.json()
                    Alert.alert(data.message)
                }
            }
            catch (error) {
                console.log("Error sending request to the server ", error);
            }
        }
        fetchData()
    }, [])

    const updateData=async()=>{
        try {
            let response=await fetch(`${url}/update/preferences/${user.userID}`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    'peripheral_threshold':peripheralThreshold,
                    'distance_threshold':distanceVisionThreshold,
                    'distance_status':distanceVisionStatus=="Yes"?1:0,
                    'peripheral_status':peripheralStatus=="Yes"?1:0,
                    'color_status':colorBlindStatus=="Yes"?1:0
                })
            })
            if(response.ok){
                let data=await response.json()
                console.log(data);              
                Alert.alert(data.message)
            }
            else{
                let data=await response.json()
                console.log(data);
                Alert.alert(data.message)
            }
        } catch (error) {
            console.warn(error.message)
        }
        
    }

    useEffect(() => {
        console.log("Selected Peripheral Status:", peripheralStatus);
    }, [peripheralStatus]);

    useEffect(() => {
        console.log("Selected Distance Vision Status:", distanceVisionStatus);
    }, [distanceVisionStatus]);

    useEffect(() => {
        console.log("Selected Color Blind Status:", colorBlindStatus);
    }, [colorBlindStatus]);

    return (
        <View style={{ flex: 1, backgroundColor: '#102C57' }}>
            <Text style={styles.header}>Settings</Text>
            <View style={[styles.box, { marginTop: 40 }]}>
                <View style={{ width: '65%', margin: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 900 }}>Do you have peripheral vision problem?</Text>
                </View>
                <View style={{ width: '25%',marginTop: 7,marginLeft: 5 }}>
                    <SelectList data={data} search={false}
                    boxStyles={{
                        borderColor: "black",
                        borderWidth: 3,
                        height: '95%'
                    }} 
                    dropdownStyles={{
                        borderColor: "black",
                        position: "absolute",
                        backgroundColor: "white",
                        zIndex: 1000, // Ensures it appears on top
                        top: 50, // Adjust dropdown position
                        width:'100%'
                    }}
                    setSelected={(val)=>{setPeripheralStatus(val)}}
                    save="value"
                    placeholder={peripheralStatus}
                    ></SelectList>
                </View>
            </View>

            <View style={[styles.box]}>
                <View style={{ width: '65%', margin: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 900 }}>Set peripheral threshold value (in meter)</Text>
                </View>
                <View style={{ width: '25%' }}>
                    <TextInput value={peripheralThreshold} style={styles.box_value} keyboardType="numeric" onChangeText={(val)=>{setPeripheralThreshold(val)}}></TextInput>
                </View>
            </View>
            <View style={[styles.box]}>
                <View style={{ width: '65%', margin: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 900 }}>Do you have distance vision problem?</Text>
                </View>
                <View style={{ width: '25%',marginTop: 7,marginLeft: 5 }}>
                    <SelectList data={data} search={false}
                    boxStyles={{
                        borderColor: "black",
                        borderWidth: 3,
                        height: '95%'
                    }} 
                    dropdownStyles={{
                        borderColor: "black",
                        position: "absolute",
                        backgroundColor: "white",
                        zIndex: 1000, // Ensures it appears on top
                        top: 50, // Adjust dropdown position
                        width:'100%'
                    }}
                    setSelected={(val)=>{setDistanceVisionStatus(val)}}
                    save="value"
                    placeholder={distanceVisionStatus}
                    ></SelectList>
                </View>
            </View>
            <View style={[styles.box]}>
                <View style={{ width: '65%', margin: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 900 }}>Set distance threshold value (in meter)</Text>
                </View>
                <View style={{ width: '25%' }}>
                    <TextInput value={distanceVisionThreshold} style={styles.box_value} keyboardType="numeric" onChangeText={(val)=>{setDistanceVisionThreshold(val)}}></TextInput>
                </View>
            </View>
            <View style={[styles.box]}>
                <View style={{ width: '65%', margin: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 900 }}>Are you color blind?</Text>
                </View>
                <View style={{ width: '25%',marginTop: 7,marginLeft: 5 }}>
                    <SelectList data={data} search={false}
                    boxStyles={{
                        borderColor: "black",
                        borderWidth: 3,
                        height: '95%'
                    }} 
                    dropdownStyles={{
                        borderColor: "black",
                        position: "absolute",
                        backgroundColor: "white",
                        zIndex: 1000, // Ensures it appears on top
                        top: 50, // Adjust dropdown position
                        width:'100%'
                    }}
                    setSelected={(val)=>{setcolorBlindStatus(val)}}
                    save="value"
                    placeholder={colorBlindStatus}
                    ></SelectList>
                </View>
            </View>

            <TouchableOpacity style={styles.btn} onPress={() => {
                 console.log("Save changes button pressed"); 
                 updateData()
                }
            }>
                <Text style={{ alignSelf: 'center', fontWeight: 900, fontSize: 20, marginTop: 5 }}>Save Changes</Text>
            </TouchableOpacity>
        </View>

    );
}
const styles = StyleSheet.create({
    header: {
        color: 'white',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 900,
        fontSize: 30
    },
    box: {
        backgroundColor: '#FFFFFF',
        width: '90%',
        height: 60,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 5,
        flexDirection: 'row'
    },
    box_value: {
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 3,
        width: '100%',
        color: 'black',
        height: '70%',
        marginLeft: 5,
        marginTop: 10,
        textAlign: 'center'
    },
    btn: {
        margin: 30,
        width: '70%',
        height: 40,
        alignSelf: 'center',
        backgroundColor: '#DAC0A3',
        borderRadius: 20,
    }
})
export default Settings;
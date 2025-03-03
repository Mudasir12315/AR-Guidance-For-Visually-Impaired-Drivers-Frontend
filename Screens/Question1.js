import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect} from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Question1 = ({navigation,route}) => {
    const user=route.params

    useEffect(() => {   
        const fetchData = async () => {  
            console.log("---------Question1 screen-----------"); 
            let user = await AsyncStorage.getItem('user');
            console.log("Current User Data in async storage"+user);
        };
        fetchData();
    }, []);

    const navigateOnQuestion2=(isColorBlind)=>{
        console.log("Is color blind value is "+(isColorBlind?"Yes":"No"));
        navigation.navigate('question2',{...user,isColorBlind:isColorBlind})
    }
    
    
    return (
        <View style={{ flex: 1, backgroundColor: '#102C57' }}>
            <Text style={styles.heading}>AR Guidance App</Text>
            <Text style={styles.question}>Are you color blind?</Text>
            <TouchableOpacity style={styles.btn} onPress={() => {
                    navigateOnQuestion2(true)
                }
            }>
                <Text style={{ alignSelf: 'center', fontWeight: 900, fontSize: 20, marginTop: 5 }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => {
                    navigateOnQuestion2(false)
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
    question:{
        color:'white',marginTop:120,marginLeft:25,fontWeight:'900',fontSize:25
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
export default Question1
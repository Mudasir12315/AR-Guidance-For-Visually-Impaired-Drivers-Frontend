import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Home = ({navigation,route}) => {
    const user=route.params

    console.log("--------------------Welcome to home screen----------------------");
    console.log("Data passed from the previous screen:");
    console.log(user);

    const fetchData = async () => {  
        let user = await AsyncStorage.getItem('user');
        console.log("Current User Data in async storage"+user);
    };
    fetchData();

    return (
        <View style={{ flex: 1, backgroundColor: '#102C57' }}>
            <Text style={styles.heading}>AR Guidance App</Text>
            <TouchableOpacity style={styles.btn} onPress={() => {
                    console.log("Simple Mode selected")
                    navigation.navigate('simplemode',user)
                }
            }>
                <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 30, marginTop: 5 }}>Simple Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => {
                    console.log("AR Mode selected")
                }
            }>
                <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 30, marginTop: 5 }}>AR Mode</Text>
            </TouchableOpacity>
        </View>
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
export default Home
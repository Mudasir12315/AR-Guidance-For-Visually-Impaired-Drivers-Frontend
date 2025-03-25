import React from "react";
import { View, Text, StyleSheet, Touchable, TouchableOpacity} from "react-native"

const Notifications = ({navigation,route}) => {
    const user=route.params
    console.log("---------------Notification Screen---------: ");
    console.log(user);
    
    return (
        <View style={{ flex: 1, backgroundColor: '#102C57' }}>
            <Text style={styles.header}>Notifcations</Text>
            <View style={styles.container}>
                <Text style={styles.textColor}>Password Reset Successful!</Text>
                <Text style={styles.textColor}>Your password was successfully updated on Tuesday 29 Sep,2024</Text>  
                <View style={{marginTop:10,flexDirection:'row',justifyContent:'flex-end'}}>
                    <TouchableOpacity style={{width:'22%',padding:5,backgroundColor:'black',borderRadius:5}}>
                        <Text style={{color:'white'}}>Dismiss</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:'40%',padding:5,backgroundColor:'black',borderRadius:5,marginLeft:10}}>
                        <Text style={{color:'white',textAlign:'center'}}>Mark As Read</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.container}>
                <Text style={styles.textColor}>You changed left view thresh value</Text>
                <Text style={styles.textColor}>You can change it anytime in settings</Text>  
                <View style={{marginTop:10,flexDirection:'row',justifyContent:'flex-end'}}>
                    <TouchableOpacity style={{width:'22%',padding:5,backgroundColor:'black',borderRadius:5}}>
                        <Text style={{color:'white'}}>Dismiss</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:'40%',padding:5,backgroundColor:'black',borderRadius:5,marginLeft:10}}>
                        <Text style={{color:'white',textAlign:'center'}}>Mark As Read</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.container}>
                <Text style={styles.textColor}>New Update Available</Text>
                <Text style={styles.textColor}>New settings for color-blind mode</Text>
                <Text style={styles.textColor}>Update your app</Text>
                <View style={{marginTop:10,flexDirection:'row',justifyContent:'flex-end'}}>
                    <TouchableOpacity style={{width:'22%',padding:5,backgroundColor:'black',borderRadius:5}}>
                        <Text style={{color:'white'}}>Dismiss</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:'40%',padding:5,backgroundColor:'black',borderRadius:5,marginLeft:10}}>
                        <Text style={{color:'white',textAlign:'center'}}>Mark As Read</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    header: {
        color: 'white',
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 30,
        fontWeight: 900,
        fontSize: 30
    },
    container:{
        backgroundColor:'#D9D9D9',
        margin:20,
        borderRadius:6,
        padding:20
    },
    textColor:{
        color:'black',
        fontWeight:900
    },
    btn1:{
        color:'white',
        backgroundColor:'black',
        borderRadius:5
    },
    btn2:{
        color:'white',
        backgroundColor:'black',
        width:'40%',
        marginLeft:10,
        paddingLeft:10,
        borderRadius:5
    }
})
export default Notifications;
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Account = ({ navigation,route }) => {
    const user=route.params
    console.log("---------------Accounts screen---------: ");
    console.log(user);

    const logOut = async () => {
        try {
            let user = await AsyncStorage.getItem('user')
            if (user) {
                user=JSON.parse(user)
                if(user.isRemembered==true){
                    user.isRemembered=false
                    await AsyncStorage.setItem('user',JSON.stringify(user))
                    console.log("Remember was checked.User Logged out"); 
                    navigation.navigate('login')
                    return
                }                    
                console.log("Remember was not checked.User Logged out");
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'login'}]
                });      
            }
            else{
                console.log("No data in async storage");
            }
        } catch (error) {
            console.log("Error fetching data from async storage: " + error.message);
        }

    }
    return (
        <View style={{ flex: 1, backgroundColor: '#102C57' }}>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Image
                                source={require('../Images/backarrow.png')}
                                style={{ width: 20, height: 20, marginRight: 10, marginTop: 30, marginLeft: 10 }}
                            />
                        </TouchableOpacity>
                        <Text style={styles.heading}>Account</Text>
                    </View>

                    <Image
                        source={require('../Images/person.png')}
                        resizeMode="stretch"
                        style={{ alignSelf: 'center', margin: 40 }}
                    />

                    {/* Change Password Button */}
                    <View style={styles.container}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => navigation.navigate('changepassword',{'userID':user.userID})}
                        >
                            <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 20, marginTop: 5 }}>
                                Change Password
                            </Text>
                        </TouchableOpacity>
                        <Image source={require('../Images/changepassword.png')} style={styles.icon} resizeMode="cover"></Image>
                    </View>


                    {/* Logout Button */}
                    <View style={[styles.container, { marginTop: 20 }]}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={logOut}
                        >
                            <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 20, marginTop: 5 }}>
                                Logout
                            </Text>
                        </TouchableOpacity>
                        <Image source={require('../Images/logout.png')} style={styles.icon} resizeMode="cover"></Image>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    heading: {
        color: 'white',
        marginTop: 30,
        fontSize: 25,
        fontWeight: '900',
        marginLeft: 90
    },
    btn: {
        marginLeft: 30,
        marginRight: 30,
        width: '90%',
        height: 40,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
    },
    container: {
        position: 'relative',
        width: '100%'
    },
    icon: {
        position: 'absolute',
        left: 30,
        top: 5, // Adjust for positioning inside the input
        width: 30,
        height: 30,
    },
});

export default Account;

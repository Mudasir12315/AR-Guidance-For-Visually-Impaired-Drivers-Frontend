import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ResetPasswordSuccess = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#102C57' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ marginLeft: 10, marginRight: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('resetpassword')}>
              <Image
                source={require('../Images/backarrow.png')}
                style={{ width: 20, height: 20, marginRight: 10, marginTop: 30, marginLeft: 10 }}
              />
            </TouchableOpacity>
            <Text style={styles.heading}>AR Guidance App</Text>
          </View>

          <Image 
            source={require('../Images/success.png')} 
            resizeMode="stretch" 
            style={{ alignSelf: 'center', margin: 40 }} 
          />

          {/* Back to login page Button */}
          <TouchableOpacity 
            style={styles.btn} 
            onPress={() => navigation.navigate('login')}
          >
            <Text style={{ alignSelf: 'center', fontWeight: '900', fontSize: 20, marginTop: 5 }}>
              Back To Login Page
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Message */}
      <Text style={styles.successMessage}>
        Password sent to your mail
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: 'white', 
    marginTop: 30, 
    marginLeft: 52, 
    fontSize: 25, 
    fontWeight: '900'
  },
  btn: {
    marginLeft: 30,
    marginRight: 30,
    width: '90%',
    height: 40,
    alignSelf: 'center',
    backgroundColor: '#DAC0A3',
    borderRadius: 20,
  },
  successMessage: {
    color: 'white',
    width: '100%',
    height: 40,
    backgroundColor: 'green',
    paddingLeft: 40,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    fontSize: 16,
  }
});

export default ResetPasswordSuccess;

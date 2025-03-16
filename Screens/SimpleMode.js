import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';

const SimpleMode = ({ navigation, route }) => {
    const user = route.params;
    const [selectedImage, setSelectedImage] = useState(null);
    const [signboardText, setSignboardText] = useState('');
    const [trafficLightColor, setTrafficLightColor] = useState('white');
    const [trafficLightMsg, setTrafficLightMsg] = useState('');
    const [LeftTurnOrRightTurn, setLeftTurnOrRightTurn] = useState('straight');
    const [carOnLeftSideOrRightSide, setCarOnLeftSideOrRightSide] = useState('neutral');

    console.log("---------Simple Mode screen-----------");
    console.log(user);

    // Use useFocusEffect to handle orientation changes
    useFocusEffect(
        React.useCallback(() => {
            console.log("Locking to landscape mode"); // Debugging
            Orientation.lockToLandscape();

            return () => {
                console.log("Resetting to portrait mode"); // Debugging
                Orientation.lockToPortrait(); // Reset to portrait mode
            };
        }, [])
    );

    // Function to pick an image from the gallery
    const pickImageFromGallery = () => {
        let options = { mediaType: 'photo', quality: 1 };
        launchImageLibrary(options, response => {
            if (response.assets && response.assets.length > 0) {
                const newImageUri = response.assets[0].uri;
                setSelectedImage(newImageUri); // Update the state
                sendFramesToBaackend(newImageUri); // Pass the new image URI directly
            }
        });
    };

    const sendFramesToBaackend = async (imageUri) => {
        try {
            let formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'upload.jpg'
            });
            formData.append('user_id', user.userID);
            formData.append('camera_mode', 0);
            console.log("Sending request to the server...");
            let response = await fetch(`${url}/frontend/frames/detection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: formData,
            });

            if (response.status == 201) {
                response = await response.json();
                setTrafficLightColor('white');
                setTrafficLightMsg('');
                setLeftTurnOrRightTurn('straight');
                setCarOnLeftSideOrRightSide('neutral');
                setSignboardText('');
                console.log("Response from server");
                console.log("Inside 201 Color:");
                console.log(response.detected_objects.length);
                for (let i = 0; i < response.detected_objects.length; i++) {
                    if (response.detected_objects[i].detected_object === 'red') {
                        setTrafficLightColor('red');
                        setTrafficLightMsg('Stop');
                    }
                    else if (response.detected_objects[i].detected_object === 'yellow') {
                        setTrafficLightColor('yellow');
                        setTrafficLightMsg('Ready');
                    } else if (response.detected_objects[i].detected_object === 'green') {
                        setTrafficLightColor('green');
                        setTrafficLightMsg('Go');
                    }
                    if (response.detected_objects[i].detected_object === 'left') {
                        setLeftTurnOrRightTurn('left');
                    } else if (response.detected_objects[0].detected_object === 'right') {
                        setLeftTurnOrRightTurn('right');
                    }
                    if (response.detected_objects[i].detected_object === 'car') {
                        if (response.camera_mode === '0')
                            setCarOnLeftSideOrRightSide('left');
                        else
                            setCarOnLeftSideOrRightSide('right');
                    }
                    if (response.detected_objects[0].detected_object === 'textsignboard') {
                        setSignboardText(response.detected_objects[0].text);
                    }
                }
            } else {
                response = await response.json();
                console.log("Else block");
                setTrafficLightColor('white');
                setTrafficLightMsg('');
                setLeftTurnOrRightTurn('straight');
                setCarOnLeftSideOrRightSide('neutral');
                setSignboardText('');
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#102C57' }}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../Images/backarrow.png')}
                        style={{ width: 20, height: 20, marginRight: 10, marginTop: 10, marginLeft: 10 }}
                    />
                </TouchableOpacity>
                <Text style={styles.heading}>Simple Mode</Text>
            </View>

            {/* Image Picker Section */}
            <TouchableOpacity onPress={pickImageFromGallery} style={styles.img}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: selectedImage }} style={{ width: '100%', height: '100%', resizeMode: 'stretch' }} />
                    {/* Simple AR Area */}
                    <View style={styles.row}>
                        {/* Traffic Light Area */}
                        <View style={{ flexDirection: 'column',marginRight:100 }}>
                            {trafficLightColor === 'white' && <Image source={require('../Images/white.png')} style={{ width: 70, height: 60 }} resizeMode="stretch"></Image>}
                            {trafficLightColor === 'red' && <Image source={require('../Images/red.png')} style={{ width: 70, height: 60 }} resizeMode="stretch"></Image>}
                            {trafficLightColor === 'yellow' && <Image source={require('../Images/yellow.png')} style={{ width: 70, height: 60 }} resizeMode="stretch"></Image>}
                            {trafficLightColor === 'green' && <Image source={require('../Images/green.png')} style={{ width: 70, height: 60 }} resizeMode="stretch"></Image>}
                            <Text style={{ color: 'white',marginLeft:20}}>{trafficLightMsg}</Text>
                        </View>
                        {/* Left Side car Area */}
                        {carOnLeftSideOrRightSide === 'left' && <Image source={require('../Images/red_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch"></Image>}
                        {carOnLeftSideOrRightSide === 'right' && <Image source={require('../Images/fade_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch"></Image>}
                        {carOnLeftSideOrRightSide === 'neutral' && <Image source={require('../Images/fade_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch"></Image>}
                        {/* Car Area */}
                        <Image source={require('../Images/car.png')} style={{ width: 100, height: 100 }} resizeMode="stretch"></Image>
                        {/* Right Side Car Area */}
                        {carOnLeftSideOrRightSide === 'right' && <Image source={require('../Images/red_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch"></Image>}
                        {carOnLeftSideOrRightSide === 'left' && <Image source={require('../Images/fade_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch"></Image>}
                        {carOnLeftSideOrRightSide === 'neutral' && <Image source={require('../Images/fade_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch"></Image>}
                        {/* Turn Left or right Area */}
                        {LeftTurnOrRightTurn === 'left' && <Image source={require('../Images/turn_left.png')} style={{ width: 50, height: 50,marginLeft:40 }} resizeMode="stretch"></Image>}
                        {LeftTurnOrRightTurn === 'right' && <Image source={require('../Images/turn_right.png')} style={{ width: 50, height: 50,marginLeft:40 }} resizeMode="stretch"></Image>}
                        {/* Textboard Area */}
                        <Text style={{ color: 'white',width:'35%',marginLeft:40}}>{signboardText}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center the content horizontally
    },
    heading: {
        color: 'white',
        marginTop: 10,
        fontSize: 25,
        fontWeight: '900',
        flex: 1, // Take up remaining space
        textAlign: 'center', // Center the text within its container
    },
    img: {
        width: '90%',
        height: '85%',
        backgroundColor: 'white',
        alignSelf: 'center'
    },
    imageContainer: {
        flex: 1,
        position: 'relative', // Make the container relative for absolute positioning
    },
    row: {
        position: 'absolute', // Position the AR area absolutely
        bottom: 10, // Adjust this value to position the AR area
        left: 20, // Adjust this value to position the AR area
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        padding: 10,
        borderRadius: 10,
        width:'95%'
    }
});

export default SimpleMode;
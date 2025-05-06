import React, { useEffect, useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera } from 'react-native-vision-camera';
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';

const SimpleMode = ({ navigation, route }) => {
    const user = route.params;
    const [speedText, setSpeedText] = React.useState('');
    const [signboardText, setSignboardText] = React.useState('');
    const [trafficLightColor, setTrafficLightColor] = React.useState('white');
    const [trafficLightMsg, setTrafficLightMsg] = React.useState('');
    const [LeftTurnOrRightTurn, setLeftTurnOrRightTurn] = React.useState('straight');
    const [carOnLeftSideOrRightSide, setCarOnLeftSideOrRightSide] = React.useState('neutral');
    const captureInterval = useRef(null);
    const cameraRef = useRef(null); // Ref for the camera

    console.log("---------Simple Mode screen-----------");
    console.log(user);

    const [device, setDevice] = React.useState(null);
    const [hasPermission, setHasPermission] = React.useState(false); // Track permission status

    useEffect(() => {
        const checkAndRequestPermission = async () => {
            try {
                const permissionStatus = await Camera.getCameraPermissionStatus();
                if (permissionStatus === 'granted') {
                    setHasPermission(true);
                } else {
                    const newPermission = await Camera.requestCameraPermission();
                    setHasPermission(newPermission === 'granted');
                }

                // If permission is granted, initialize the camera
                if (hasPermission) {
                    const devices = Camera.getAvailableCameraDevices();
                    if (devices.length > 0) {
                        setDevice(devices[0]); // Set the first available camera
                    } else {
                        console.log("No available camera devices");
                    }
                }
            } catch (error) {
                console.log("Error checking/requesting permission:", error);
            }
        };

        checkAndRequestPermission();
    }, [hasPermission]);

    useFocusEffect(
        React.useCallback(() => {
            console.log("Locking to landscape mode");
            Orientation.lockToLandscape();

            // Start capturing images every 30 seconds
            captureInterval.current = setInterval(captureFrame, 1000);
            captureFrame(); // Capture first frame immediately

            return () => {
                console.log("Resetting to portrait mode");
                Orientation.lockToPortrait();
                clearInterval(captureInterval.current);
            };
        }, [])
    );

    // Function to capture a frame silently from the camera
    const captureFrame = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePhoto({
                    qualityPrioritization: 'speed', // Prioritize speed over quality
                    flash: 'off', // No flash
                    enableShutterSound: false, // Silent capture
                });
                const imageUri = `file://${photo.path}`;
                sendFramesToBackend(imageUri); // Send to backend
            } catch (error) {
                console.log("Error capturing frame:", error);
            }
        }
    };

    // Function to send frames to the backend
    const sendFramesToBackend = async (imageUri) => {
        try {
            let formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                type: 'image/jpeg',
                name: 'upload.jpg',
            });
            formData.append('user_id', user.userID);
            formData.append('camera_mode', 0);

            console.log("Sending request to the server...");
            let response = await fetch(`${url}/frontend/frames/detection`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (response.status === 201) {
                response = await response.json();
                setTrafficLightColor('white');
                setTrafficLightMsg('');
                setLeftTurnOrRightTurn('straight');
                setCarOnLeftSideOrRightSide('neutral');
                setSpeedText('');

                console.log("Response from server:", response.detected_objects);
                for (let i = 0; i < response.detected_objects.length; i++) {
                    const obj = response.detected_objects[i].detected_object;
                    if (obj === 'red') {
                        setTrafficLightColor('red');
                        setTrafficLightMsg('Stop');
                    } else if (obj === 'yellow') {
                        setTrafficLightColor('yellow');
                        setTrafficLightMsg('Ready');
                    } else if (obj === 'green') {
                        setTrafficLightColor('green');
                        setTrafficLightMsg('Go');
                    }
                    if (obj === 'left') {
                        setLeftTurnOrRightTurn('left');
                    } else if (obj === 'right') {
                        setLeftTurnOrRightTurn('right');
                    }
                    if (obj === 'car' || obj === 'bike' || obj === 'bus' || obj === 'truck') {
                        setCarOnLeftSideOrRightSide(response.camera_mode === '0' ? 'left' : 'right');
                    }
                    if (obj === 'textsignboard' || obj === 'stop') {
                        setTimeout(() => {
                            setSignboardText(response.detected_objects[i].text);
                        }, 5000);
                    }
                    if (obj === 'speed') {
                        setSpeedText(response.detected_objects[i].text);
                    }
                }
            } else {
                console.log("Server returned non-201 status:", response.status);
                setTrafficLightColor('white');
                setTrafficLightMsg('');
                setLeftTurnOrRightTurn('straight');
                setCarOnLeftSideOrRightSide('neutral');
                setSignboardText('');
                setSpeedText('');
            }
        } catch (error) {
            console.log("Error sending frame to backend:", error.message);
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

            {/* Camera Feed and AR Display */}
            <View style={styles.img}>
                {hasPermission && device && (
                    <Camera
                        ref={cameraRef}
                        style={{ width: '100%', height: '100%' }}
                        device={device}
                        isActive={true}
                        photo={true}
                    />
                )}

                {/* AR Overlay */}
                <View style={styles.row}>
                    {/* Traffic Light Area */}
                    <View style={{ flexDirection: 'column', marginTop: 25 }}>
                        {trafficLightColor === 'white' && (
                            <Image source={require('../Images/white.png')} style={{ width: 70, height: 60 }} resizeMode="stretch" />
                        )}
                        {trafficLightColor === 'red' && (
                            <Image source={require('../Images/red.png')} style={{ width: 70, height: 60 }} resizeMode="stretch" />
                        )}
                        {trafficLightColor === 'yellow' && (
                            <Image source={require('../Images/yellow.png')} style={{ width: 70, height: 60 }} resizeMode="stretch" />
                        )}
                        {trafficLightColor === 'green' && (
                            <Image source={require('../Images/green.png')} style={{ width: 70, height: 60 }} resizeMode="stretch" />
                        )}
                        <Text style={{ color: 'white', marginLeft: 20 }}>{trafficLightMsg}</Text>
                    </View>
                    {/* Speed Area */}
                    {true && (
                        <View style={styles.speedText}>
                            <Text style={{ color: 'white', textAlign: 'center' }}>{speedText}</Text>
                        </View>
                    )}

                    {/* Left Side Car Area */}
                    {carOnLeftSideOrRightSide === 'left' && (
                        <Image source={require('../Images/red_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch" />
                    )}
                    {carOnLeftSideOrRightSide === 'right' && (
                        <Image source={require('../Images/fade_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch" />
                    )}
                    {carOnLeftSideOrRightSide === 'neutral' && (
                        <Image source={require('../Images/fade_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch" />
                    )}
                    {/* Car Area */}
                    <Image source={require('../Images/car.png')} style={{ width: 100, height: 100 }} resizeMode="stretch" />
                    {/* Right Side Car Area */}
                    {carOnLeftSideOrRightSide === 'right' && (
                        <Image source={require('../Images/red_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch" />
                    )}
                    {carOnLeftSideOrRightSide === 'left' && (
                        <Image source={require('../Images/fade_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch" />
                    )}
                    {carOnLeftSideOrRightSide === 'neutral' && (
                        <Image source={require('../Images/fade_circle.png')} style={{ width: 50, height: 50 }} resizeMode="stretch" />
                    )}
                    {/* Turn Left or Right Area */}
                    {LeftTurnOrRightTurn === 'left' && (
                        <Image source={require('../Images/turn_left.png')} style={{ width: 50, height: 50, marginLeft: 10, marginRight: 10 }} resizeMode="stretch" />
                    )}
                    {LeftTurnOrRightTurn === 'right' && (
                        <Image source={require('../Images/turn_right.png')} style={{ width: 50, height: 50, marginLeft: 10, marginRight: 10 }} resizeMode="stretch" />
                    )}
                    {/* Textboard Area */}
                    <Text style={{ color: 'white', width: '35%' }}>{signboardText}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    speedText: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderColor: 'white',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    heading: {
        color: 'white',
        marginTop: 10,
        fontSize: 25,
        fontWeight: '900',
        flex: 1,
        textAlign: 'center',
    },
    img: {
        width: '90%',
        height: '85%',
        backgroundColor: 'white',
        alignSelf: 'center',
        position: 'relative',
    },
    row: {
        position: 'absolute',
        bottom: 10,
        left: 20,
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 10,
        width: '95%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SimpleMode;
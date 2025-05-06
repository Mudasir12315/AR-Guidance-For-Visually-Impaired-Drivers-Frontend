import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';

const ARMode = ({ navigation, route }) => {
    const user = route.params;
    const [hudState, setHudState] = useState({
        speedText: '',
        signboardText: '',
        trafficLightColor: 'white',
        trafficLightMsg: '',
        LeftTurnOrRightTurn: 'straight',
        carOnLeftSideOrRightSide: 'neutral',
        showSpeedArea: false,
    });
    const captureInterval = useRef(null);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);

    console.log("---------AR Mode screen-----------");
    console.log(user);

    useFocusEffect(
        React.useCallback(() => {
            console.log("Locking to landscape mode");
            Orientation.lockToLandscape();

            return () => {
                console.log("Resetting to portrait mode");
                Orientation.lockToPortrait();
                clearInterval(captureInterval.current);
            };
        }, [])
    );

    useEffect(() => {
        const GetHUDLog = async () => {
            try {
                console.log("Sending request to the server...");
                let response = await fetch(`${url}/hud_log/${user.userID}`);

                if (response.ok) {
                    response = await response.json();
                    console.log("Response from server:", response);

                    if (response.message === "No data found") {
                        console.log("No new logs available");
                        setHudState({
                            speedText: '',
                            signboardText: '',
                            trafficLightColor: 'white',
                            trafficLightMsg: '',
                            LeftTurnOrRightTurn: 'straight',
                            carOnLeftSideOrRightSide: 'neutral',
                            showSpeedArea: false,
                        });
                        return;
                    }

                    const message = response.message;
                    console.log("Processing log:", message);

                    const newState = {
                        speedText: '',
                        signboardText: '',
                        trafficLightColor: 'white',
                        trafficLightMsg: '',
                        LeftTurnOrRightTurn: 'straight',
                        carOnLeftSideOrRightSide: 'neutral',
                        showSpeedArea: false,
                    };

                    const obj = message.detected_object;

                    if (obj === 'red') {
                        newState.trafficLightColor = 'red';
                        newState.trafficLightMsg = 'Stop';
                    } else if (obj === 'yellow') {
                        newState.trafficLightColor = 'yellow';
                        newState.trafficLightMsg = 'Ready';
                    } else if (obj === 'green') {
                        newState.trafficLightColor = 'green';
                        newState.trafficLightMsg = 'Go';
                    }

                    if (obj === 'left') {
                        newState.LeftTurnOrRightTurn = 'left';
                    } else if (obj === 'right') {
                        newState.LeftTurnOrRightTurn = 'right';
                    }

                    if (obj === 'car' || obj === 'bike' || obj === 'bus' || obj === 'truck') {
                        newState.carOnLeftSideOrRightSide = message.camera_mode === '0' ? 'left' : 'right';
                    }

                    if (obj === 'textsignboard' || obj === 'stop') {
                        newState.signboardText = message.alert;
                    }

                    if (obj === 'speed') {
                        newState.showSpeedArea = true;
                        newState.speedText = message.alert;
                        console.log("Speed shown:", message.alert);
                    }

                    setHudState(newState);
                    console.log("Updated HUD state:", newState);
                } else {
                    console.log("Server returned non-200 status:", response.status);
                    setHudState({
                        speedText: '',
                        signboardText: '',
                        trafficLightColor: 'white',
                        trafficLightMsg: '',
                        LeftTurnOrRightTurn: 'straight',
                        carOnLeftSideOrRightSide: 'neutral',
                        showSpeedArea: false,
                    });
                }
            } catch (error) {
                console.log("Error fetching data from backend:", error.message);
            }
        };

        // Poll the API every 500ms
        captureInterval.current = setInterval(GetHUDLog, 500);

        return () => clearInterval(captureInterval.current);
    }, [user.userID]);

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../Images/backarrow.png')}
                        style={{ width: 20, height: 20, marginLeft: 10, marginTop: 10 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setIsSpeakerOn(prevState => !prevState);
                }}>
                    {isSpeakerOn && <Image
                        source={require('../Images/sound.png')}
                        style={{ width: 30, height: 30, marginRight: 30, marginTop: 10 }}
                    />}
                    {!isSpeakerOn && <Image
                        source={require('../Images/speaker_off.png')}
                        style={{ width: 30, height: 30, marginRight: 30, marginTop: 10 }}
                    />}
                </TouchableOpacity>
            </View>

            {/* Traffic Light Section */}
            <View style={styles.trafficLightContainer}>      
                {hudState.trafficLightColor === 'red' && (
                    <Image source={require('../Images/red_1.png')} style={styles.trafficLightImage} resizeMode="stretch" />
                )}
                {hudState.trafficLightColor === 'yellow' && (
                    <Image source={require('../Images/yellow_1.png')} style={styles.trafficLightImage} resizeMode="stretch" />
                )}
                {hudState.trafficLightColor === 'green' && (
                    <Image source={require('../Images/green_1.png')} style={styles.trafficLightImage} resizeMode="stretch" />
                )}
            </View>
            <View style={styles.trafficLightMsgContainer}>
                <Text style={styles.trafficLightText}>{hudState.trafficLightMsg}</Text>
            </View>

            {/* Left Indicator */}
            <View style={styles.leftIndicatorContainer}>
                {hudState.carOnLeftSideOrRightSide === 'left' && (
                    <Image
                        source={require('../Images/left_indicator.png')}
                        style={styles.indicatorImage}
                        resizeMode="stretch"
                    />
                )}
            </View>

            {/* Right Indicator */}
            <View style={styles.rightIndicatorContainer}>
                {hudState.carOnLeftSideOrRightSide === 'right' && (
                    <Image
                        source={require('../Images/right_indicator.png')}
                        style={styles.indicatorImage}
                        resizeMode="stretch"
                    />
                )}
            </View>

            {/* Text Signboard Area */}
            <View style={styles.signboardContainer}>
                <Text style={styles.signboardText}>{hudState.signboardText}</Text>
            </View>

            {/* Speed Limit (below signboard) */}
            {hudState.showSpeedArea && (
                <View style={styles.speedLimitContainer}>
                    <Text style={styles.speedLimitText}>Speed Limit</Text>
                </View>
            )}

            {/* Speed Area (above speed limit) */}
            {hudState.showSpeedArea && (
                <View style={styles.speedAreaContainer}>
                    <Text style={styles.speedText}>{hudState.speedText}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        transform: [{ scaleX: -1 }], // Flip horizontally for windshield reflection
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        zIndex: 10,
    },
    trafficLightContainer: {
        position: 'absolute',
        top: 50,
        right: 100,
        zIndex: 5,
    },
    trafficLightImage: {
        width: 80,
        height: 80,
    },
    trafficLightMsgContainer: {
        position: 'absolute',
        top: 130,
        right: 40,
        zIndex: 5,
    },
    trafficLightText: {
        color: 'white',
        fontSize: 16,
        right: 80,
        textAlign: 'center',
    },
    leftIndicatorContainer: {
        position: 'absolute',
        top: 160,
        left: 20,
        zIndex: 5,
    },
    rightIndicatorContainer: {
        position: 'absolute',
        top: 160,
        right: 20,
        zIndex: 5,
    },
    indicatorImage: {
        width: 50,
        height: 50,
    },
    signboardContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -20 }],
        width: 200,
        zIndex: 5,
    },
    signboardText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    speedLimitContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: 20 }],
        width: 200,
        zIndex: 5,
    },
    speedLimitText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    speedAreaContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -35 }, { translateY: -60 }],
        width: 70,
        height: 70,
        borderRadius: 35,
        borderColor: 'white',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
    },
    speedText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ARMode;
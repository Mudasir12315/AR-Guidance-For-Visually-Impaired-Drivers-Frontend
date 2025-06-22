import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';
import Tts from 'react-native-tts';

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
    const [showLeftIndicator, setShowLeftIndicator] = useState(true);
    const [showRightIndicator, setShowRightIndicator] = useState(true);
    const previousSideRef = useRef('neutral'); //Track previous side


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
    let blinkInterval;

    const currentSide = hudState.carOnLeftSideOrRightSide;

    if (previousSideRef.current !== currentSide) {
        // Clear any ongoing blink interval
        clearInterval(blinkInterval);

        console.log('Side changed from', previousSideRef.current, 'to', currentSide);
        previousSideRef.current = currentSide;

        // Reset both indicators before blinking
        setShowLeftIndicator(true);
        setShowRightIndicator(true);

        if (currentSide === 'left') {
            blinkInterval = setInterval(() => {
                setShowRightIndicator(prev => !prev);
            }, 500);
        } else if (currentSide === 'right') {
            blinkInterval = setInterval(() => {
                setShowLeftIndicator(prev => !prev);
            }, 500);
        }
    }

    return () => {
        clearInterval(blinkInterval);
    };
}, [hudState.carOnLeftSideOrRightSide]);




useEffect(() => {
    let isSpeaking = false;
    let ttsFinished = true;

    const speakAndWait = (text) => {
        return new Promise((resolve) => {
            Tts.stop(); // stop any current speech
            Tts.speak(text);
            Tts.addEventListener('tts-finish', () => {
                resolve();
            });
        });
    };

    const GetHUDLog = async () => {
        if (!ttsFinished) return; // Don't fetch if previous speech isn't done

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
                const obj = message.detected_object;

                // Update HUD
                const newState = {
                    speedText: '',
                    signboardText: '',
                    trafficLightColor: 'white',
                    trafficLightMsg: '',
                    LeftTurnOrRightTurn: 'straight',
                    carOnLeftSideOrRightSide: 'neutral',
                    showSpeedArea: false,
                };

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

                if (obj === 'left') newState.LeftTurnOrRightTurn = 'left';
                else if (obj === 'right') newState.LeftTurnOrRightTurn = 'right';

                if (['car', 'bike', 'bus', 'truck'].includes(obj)) {
                    if(message.camera_mode === 0)
                        newState.carOnLeftSideOrRightSide = 'left'
                    else if(message.camera_mode === 1)
                        newState.carOnLeftSideOrRightSide = 'right'
                }

                if (obj === 'textsignboard' || obj === 'stop') {
                    newState.signboardText = message.alert;
                }

                if (obj === 'speed') {
                    newState.showSpeedArea = true;
                    newState.speedText = message.alert;
                }

                setHudState(newState);

                // 🔊 Voice feedback
                ttsFinished = false;

                if (obj === 'red') {
                    await speakAndWait('Stop');
                } else if (obj === 'yellow') {
                    await speakAndWait('Get ready');
                } else if (obj === 'green') {
                    await speakAndWait('Go');
                } else if (obj === 'textsignboard' || obj === 'stop') {
                    if (message.alert) await speakAndWait(message.alert);
                } else if (['car', 'bike', 'bus', 'truck'].includes(obj)) {
                    if (message.camera_mode === 0) await speakAndWait('Car is on the left side');
                    else if (message.camera_mode === 1) await speakAndWait('Car is on the right side');
                } else if (obj === 'speed' && message.alert) {
                    await speakAndWait(`Speed limit ${message.alert}`);
                }

                ttsFinished = true;
                console.log("Speech finished.");
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

    // Polling
    captureInterval.current = setInterval(GetHUDLog, 1500);

    return () => clearInterval(captureInterval.current);
}, [user.userID]);




    return (
        <View style={styles.container}>

            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../Images/backarrow.png')}
                        style={{ width: 30, height: 20, marginLeft: 30, marginTop: 15 }}
                    />
                </TouchableOpacity>
            </View>

            {/* Traffic Light Section */}
            <View style={styles.trafficLightWrapper}>
                {hudState.trafficLightColor === 'red' && (
                    <Image source={require('../Images/red_1.png')} style={styles.trafficLightImage} resizeMode="stretch" />
                )}
                {hudState.trafficLightColor === 'yellow' && (
                    <Image source={require('../Images/yellow_1.png')} style={styles.trafficLightImage} resizeMode="stretch" />
                )}
                {hudState.trafficLightColor === 'green' && (
                    <Image source={require('../Images/green_1.png')} style={styles.trafficLightImage} resizeMode="stretch" />
                )}
                <Text style={styles.trafficLightText}>{hudState.trafficLightMsg}</Text>
            </View>


            {/* Left Mirror Camera*/}
            <View style={styles.leftIndicatorContainer}>
                {hudState.carOnLeftSideOrRightSide === 'right' && showLeftIndicator && (
                    <Image
                        source={require('../Images/left_arrow_updated.png')}
                        style={styles.indicatorImage}
                        resizeMode="stretch"
                    />
                )}
            </View>

            {/* Right Mirror Camera*/}
            <View style={styles.rightIndicatorContainer}>
                {hudState.carOnLeftSideOrRightSide === 'left' && showRightIndicator && (
                    <Image
                        source={require('../Images/right_arrow_updated.png')}
                        style={styles.indicatorImage}
                        resizeMode="stretch"
                    />
                )}
            </View>


            {/* Text Signboard Area */}
            <View style={styles.signboardContainer}>
                {hudState.LeftTurnOrRightTurn === 'right' && (
                    <Image
                        source={require('../Images/turn_right.png')}
                        style={styles.signboardImage}
                        resizeMode="stretch"
                    />
                )}
                {hudState.LeftTurnOrRightTurn === 'left' && (
                    <Image
                        source={require('../Images/turn_left.png')}
                        style={styles.signboardImage}
                        resizeMode="stretch"
                    />
                )}
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
    trafficLightWrapper: {
        position: 'absolute',
        top: 50,
        right: 100,
        zIndex: 5,
        alignItems: 'center',
    },
    trafficLightImage: {
        width: 120,
        height: 120,
    },
    trafficLightText: {
        color: 'white',
        fontSize: 40,
        textAlign: 'center',
        fontWeight: '900',
        marginTop: 5,
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
        width: 100,
        height: 100,
    },
    signboardContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -175 }, { translateY: -75 }], // Half of width & height
        width: 350,
        height: 150, // Add height to help vertical centering
        zIndex: 5,
        alignItems: 'center',     // Center children horizontally
        justifyContent: 'center', // Center children vertically
        backgroundColor: 'transparent', // Optional for debugging layout
    },

    signboardImage: {
        width: 100,
        height: 100,
        marginBottom: 5, // Space between image and text
    },

    signboardText: {
        color: 'white',
        fontSize: 40,
        textAlign: 'center',
        fontWeight: '900',
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
        fontSize: 30,
        textAlign: 'center',
        fontWeight: '900'
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
        fontSize: 30,
        textAlign: 'center',
        fontWeight: '900'
    },
});

export default ARMode;
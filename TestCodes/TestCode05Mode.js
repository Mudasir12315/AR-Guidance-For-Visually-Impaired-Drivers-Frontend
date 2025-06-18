import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Camera } from 'react-native-vision-camera';
import Orientation from 'react-native-orientation-locker';
import { useFocusEffect } from '@react-navigation/native';

const TestMode = ({ navigation, route }) => {
  const user = route.params;
  const captureInterval = useRef(null);
  const cameraRef = useRef(null); // Ref for the camera
  const deviceRef = useRef(null); // Ref to store camera device immediately
  const permissionRef = useRef(false); // Ref to store permission status immediately

  console.log("---------Mode screen-----------");
  console.log(user);

  const [device, setDevice] = useState(null); // State for rendering camera device
  const [hasPermission, setHasPermission] = useState(false); // State for rendering permission status
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [isCameraActive, setIsCameraActive] = useState(false); // Track camera activation state
  const [forceRerender, setForceRerender] = useState(false); // Force re-render to ensure layout

  useEffect(() => {
    const checkAndRequestPermission = async () => {
      try {
        setIsLoading(true); // Set loading state to true

        // Check and request camera permission
        let permissionStatus = Camera.getCameraPermissionStatus();
        if (permissionStatus !== 'granted') {
          permissionStatus = await Camera.requestCameraPermission();
        }
        permissionRef.current = permissionStatus === 'granted';
        setHasPermission(permissionRef.current);

        // If permission is granted, fetch camera devices
        if (permissionRef.current) {
          // Add a slight delay to ensure devices are available after permission
          const fetchDevicesWithRetry = async (retries = 3, delay = 500) => {
            for (let i = 0; i < retries; i++) {
              console.log(`Retry ${i + 1}/${retries}: Fetching camera devices...`);
              const devices = Camera.getAvailableCameraDevices();
              if (devices.length > 0) {
                deviceRef.current = devices[0]; // Store in ref for immediate access
                setDevice(devices[0]); // Update state for rendering
                return true;
              }
              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, delay));
            }
            return false;
          };

          const devicesFound = await fetchDevicesWithRetry();
          if (!devicesFound) {
            console.log("No camera devices available after retries");
          } else {
            // Delay camera activation to ensure layout is applied
            setTimeout(() => {
              setIsCameraActive(true);
              setForceRerender(true); // Trigger re-render to apply layout
            }, 200);
          }
        } else {
          console.log("Camera permission denied");
        }
      } catch (error) {
        console.log("Error checking/requesting permission or fetching devices:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after completion
      }
    };

    checkAndRequestPermission();
  }, []); // Empty dependency array to run only on mount

  useFocusEffect(
    React.useCallback(() => {
      console.log("Locking to landscape mode");
      Orientation.lockToLandscape();

      // Start capturing images every 1 second
      captureInterval.current = setInterval(captureFrame, 1000);
      captureFrame(); // Capture first frame immediately

      return () => {
        console.log("Resetting to portrait mode");
        Orientation.lockToPortrait();
        clearInterval(captureInterval.current);
        setIsCameraActive(false); // Deactivate camera when leaving
        setForceRerender(false); // Reset re-render state
      };
    }, [])
  );

  // Function to capture a frame silently from the camera
  const captureFrame = async () => {
    if (cameraRef.current && deviceRef.current) {
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
      formData.append('camera_mode', user.cameraMode);

      console.log("Sending request to the server...");
      let response = await fetch(`${url}/frontend/frames/detection`, {
        method: 'POST',
        body: formData,
      });

      if (response.status === 201) {
        console.log("Response from server:", response.detected_objects);
      } else {
        console.log("Server returned non-201 status:", response.status);
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
      <View
        style={styles.img}
        onLayout={() => console.log("Image container layout applied")}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading Camera...</Text>
          </View>
        ) : hasPermission && device && isCameraActive ? (
          <View
            style={styles.cameraContainer}
            onLayout={() => console.log("Camera container layout applied")}
          >
            {forceRerender && (
              <Camera
                key={forceRerender ? "camera-on" : "camera-off"}
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={isCameraActive}
                photo={true}
              />
            )}
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {hasPermission ? "No camera devices available" : "Camera permission denied"}
            </Text>
          </View>
        )}
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
    overflow: 'hidden', // Ensure camera doesn't overflow
  },
  cameraContainer: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    overflow: 'hidden', // Prevent camera from rendering outside bounds
  },
  camera: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Ensure camera respects container bounds
    top: 0,
    left: 0,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#102C57',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#102C57',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default TestMode;
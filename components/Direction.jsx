import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { WebView } from 'react-native-webview';

const Track = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [email, setEmail] = useState(null); // Store the user's email
  const [isTracking, setIsTracking] = useState(false); // Track if the tracking is active
  const [userDetails, setUserDetails] = useState(null); // Store user details
  const intervalId = useRef(null);  // Store interval ID
  const mapRef = useRef(null); // Reference for WebView

  useEffect(() => {
    requestLocationPermission();
    getEmailFromStorage();  // Fetch the email when the component mounts
  }, []);

  // Request Location Permissions for Android
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "App needs access to your location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission granted");
        } else {
          console.log("Location permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Get the email from AsyncStorage
  const getEmailFromStorage = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        console.log('No email found in storage.');
      }
    } catch (error) {
      console.error('Error retrieving email from storage:', error);
    }
  };

  // Fetch user details from the backend, including the email
  const fetchUserDetails = async () => {
    try {
      const mobile = await AsyncStorage.getItem('mobile'); // Replace with your dynamic mobile number if needed
      
      // First, get the user details
      const userDetailsResponse = await axios.get(`https://backend-gray-three-74.vercel.app/get_user_email?mobile=${mobile}`);
      setUserDetails(userDetailsResponse.data); // Assuming the response contains user details
      console.log('User details fetched:', userDetailsResponse.data);

      // Then, fetch the user's email using the mobile number
      const emailResponse = await axios.get(`https://backend-gray-three-74.vercel.app/get_user_email?mobile=${mobile}`);
      setEmail(emailResponse.data.email); // Assuming the response contains the email field
      console.log('User email fetched:', emailResponse.data.email);

    } catch (error) {
      console.error('Error fetching user details or email:', error);
    }
  };

  // Handle Start/Stop Tracking
  const toggleTracking = () => {
    if (isTracking) {
      stopRealTimeTracking();  // If tracking, stop it
    } else {
      startRealTimeTracking(); // If not tracking, start it
    }
    setIsTracking(!isTracking); // Toggle tracking state
  };

  // Get Location and Send to Backend at regular intervals
  const startRealTimeTracking = () => {
    if (!email) {
      Alert.alert('Error', 'Email not found. Cannot start tracking.');
      return;
    }

    if (intervalId.current) {
      clearInterval(intervalId.current);  // Clear existing interval if button pressed again
    }

    intervalId.current = setInterval(() => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          console.log('Position:', position);

          // Send GPS data and email to backend
          axios.post('https://naturally-evident-peacock.ngrok-free.app/user/api/location', { latitude, longitude, email })
            .then(response => {
              console.log('Location sent to backend:', response.data);
            })
            .catch(error => {
              console.error('Error sending location:', error);
            });
        },
        (error) => {
          setErrorMsg(error.message);
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }, 1000);  // Fetch location and send every second
  };

  // Stop real-time tracking
  const stopRealTimeTracking = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

  const renderMap = () => {
    if (location) {
      return (
        <WebView
          ref={mapRef}
          originWhitelist={['*']}
          style={styles.map}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <title>Leaflet Map</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
                <style>
                  #map { height: 100vh; }
                  body { margin: 0; }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <script>
                  var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 13);
                  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                  }).addTo(map);
                  var marker = L.marker([${location.latitude}, ${location.longitude}]).addTo(map);
                  marker.bindPopup('Your location').openPopup();
                  map.setView([${location.latitude}, ${location.longitude}], 13);
                </script>
              </body>
              </html>
            `,
          }}
        />
      );
    }
    return <Text style={styles.textCenter}>Getting location...</Text>;
  };

  return (
    <View style={styles.container}>
      {errorMsg && <Text style={styles.errorText}>Error: {errorMsg}</Text>}
      
      {/* Single button with dynamic behavior */}
      <TouchableOpacity
        style={[
          styles.button,
          isTracking ? styles.buttonStop : styles.buttonStart
        ]}
        onPress={toggleTracking}
      >
        <Text style={styles.buttonText}>
          {isTracking ? 'Stop Tracking' : 'Start Real-Time Tracking'}
        </Text>
      </TouchableOpacity>

      {/* Button to fetch user details */}
      <TouchableOpacity
        style={styles.button}
        onPress={fetchUserDetails}
      >
        <Text style={styles.buttonTextUser}>Get User Details</Text>
      </TouchableOpacity>

      {userDetails && (
        <View style={styles.userDetails}>
          <Text style={styles.userDetailsText}>User Details:</Text>
          <Text style={styles.userDetailsText}>{JSON.stringify(userDetails)}</Text>
          {email && (
            <Text style={styles.userDetailsText}>Email: {email}</Text>
          )}
        </View>
      )}

      {renderMap()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonStart: {
    backgroundColor: 'blue',
  },
  buttonStop: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextUser:{
    color:'black',
  },
  map: {
    flex: 1,
    marginTop: 20,
  },
  textCenter: {
    textAlign: 'center',
    color: 'black',
  },
  userDetails: {
    marginTop: 20,
  },
  userDetailsText: {
    fontSize: 16,
    color: 'black',
  },
});

export default Track;

import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
    TextInput,
    Modal,
    Animated,
    Easing,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as tf from '@tensorflow/tfjs';
import * as tfjs from '@tensorflow/tfjs-react-native';

const Profile = () => {
    const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
    const [name, setName] = useState('');
    const [stickId, setStickId] = useState('A1B2C3');
    const [status, setStatus] = useState('Active');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const navigation = useNavigation();
    const [isTfReady, setIsTfReady] = useState(false);

    const fetchUserDetails = async () => {
        try {
            const mobile = await AsyncStorage.getItem('mobile');
            const response = await axios.get(`http://192.168.146.206:5000/get_user_details?mobile=${mobile}`);
            const userDetails = response.data;
            if (userDetails) {
                setName(userDetails.name || '');
                setStickId(userDetails.stickId || stickId);
                setProfileImage(userDetails.profileImage || profileImage);
                setStatus(userDetails.status || status);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch user details.');
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    useEffect(() => {
        const initTensorFlow = async () => {
            await tf.ready();
            setIsTfReady(true);
        };
        initTensorFlow();
    }, []);

    const loadModel = async () => {
        const model = await tf.loadGraphModel('path_to_yolov8_model/model.json'); // Replace with actual model path
        return model;
    };

    const detectObjects = async (imageUri) => {
        const model = await loadModel();

        // Load and preprocess the image
        const imgB64 = await fetch(imageUri);
        const imgBlob = await imgB64.blob();
        const imgArrayBuffer = await imgBlob.arrayBuffer();
        const imgTensor = tf.browser.fromPixels(new Uint8Array(imgArrayBuffer));

        // Run inference
        const predictions = await model.executeAsync(imgTensor.expandDims(0));
        // Process predictions (implement your processing logic here)
        console.log(predictions);
    };

    const handleImageUpload = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 1 },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    Alert.alert('Error', 'Error picking image, please try again.');
                } else if (response.assets && response.assets.length > 0) {
                    setProfileImage(response.assets[0].uri);
                }
            }
        );
    };

    const handleEditProfile = () => {
        setIsModalVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    const saveProfile = () => {
        if (!name || !stickId) {
            Alert.alert('Error', 'Name and Stick ID are required!');
            return;
        }
        setIsModalVisible(false);
        Alert.alert('Profile Updated', 'Your profile information has been updated.');
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'You have been logged out.', [
            { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
    };

    const handleCameraPress = () => {
        launchCamera(
            { mediaType: 'photo', quality: 1 },
            async (response) => {
                if (response.didCancel) {
                    console.log('User cancelled camera');
                } else if (response.error) {
                    Alert.alert('Error', 'Error opening camera, please try again.');
                } else if (response.assets && response.assets.length > 0) {
                    const imageUri = response.assets[0].uri;
                    setProfileImage(imageUri); // Set captured image
                    // Call the detectObjects function
                    if (isTfReady) {
                        await detectObjects(imageUri);
                    } else {
                        Alert.alert('TensorFlow not ready', 'Please wait for TensorFlow to load.');
                    }
                }
            }
        );
    };

    const handleNewButtonPress = () => {
        Alert.alert('Button Pressed', 'You pressed the Speak button!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Welcome Back, {name || 'User'}!</Text>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleImageUpload} style={styles.imageContainer}>
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                </TouchableOpacity>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>Name: {name}</Text>
                    <Text style={styles.infoText}>User ID: {stickId}</Text>
                    <Text style={styles.infoText}>Status: {status}</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={handleCameraPress} style={styles.lightBlueButton}>
                <Text style={styles.buttonText}>Camera🎦</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNewButtonPress} style={styles.newButton}>
                <Text style={styles.buttonText}>Speak🎤</Text>
            </TouchableOpacity>
            
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Stick ID"
                            value={stickId}
                            onChangeText={setStickId}
                        />
                        <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Modal>
        </View>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 10,
        backgroundColor: '#E0F7FA',
        elevation: 10,
    },
    imageContainer: {
        marginBottom: 20,
        borderRadius: 60,
        overflow: 'hidden',
        borderColor: '#00796B',
        borderWidth: 5,
        elevation: 10,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    infoContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#f8f8f8',
        borderRadius: 15,
        elevation: 5,
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    editButton: {
        flex: 1,
        backgroundColor: '#00796B',
        padding: 15,
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
    },
    logoutButton: {
        flex: 1,
        backgroundColor: '#F44336',
        padding: 15,
        borderRadius: 10,
        marginLeft: 10,
        alignItems: 'center',
    },
    lightBlueButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    newButton: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

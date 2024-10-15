import React, { useState } from 'react';
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
import { launchImageLibrary } from 'react-native-image-picker';

const Profile = () => {
    const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150'); // Default profile image
    const [name, setName] = useState('John Doe');
    const [userId, setUserId] = useState('12345');
    const [stickId, setStickId] = useState('A1B2C3');
    const [status, setStatus] = useState('Active');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0]; // Animation for modal

    // Function to handle image upload
    const handleImageUpload = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 1, // Full quality image
            },
            (response) => {
                // Check for errors or cancellation
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ', response.error);
                    Alert.alert('Error', 'Error picking image, please try again.');
                } else if (response.assets && response.assets.length > 0) {
                    // Set the selected image
                    setProfileImage(response.assets[0].uri);
                }
            }
        );
    };

    // Function to handle editing profile
    const handleEditProfile = () => {
        setIsModalVisible(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    };

    // Function to save edited profile information
    const saveProfile = () => {
        if (!name || !stickId) {
            Alert.alert('Error', 'Name and Stick ID are required!');
            return;
        }
        setIsModalVisible(false);
        Alert.alert('Profile Updated', 'Your profile information has been updated.');
    };

    // Function to handle logout
    const handleLogout = () => {
        Alert.alert('Logout', 'You have been logged out.', [{ text: 'OK' }]);
    };

    return (
        <View style={styles.container}>
        <Text style={styles.heading}>Welcome Back {name}</Text>
        <View style={styles.header}>
            {/* Profile Image */}
            <TouchableOpacity onPress={handleImageUpload} style={styles.imageContainer}>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
            </TouchableOpacity>

            {/* User Info Container */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Name: {name}</Text>
                <Text style={styles.infoText}>User ID: {userId}</Text>
                <Text style={styles.infoText}>Stick ID: {stickId}</Text>
                <Text style={styles.infoText}>Status: {status}</Text>
            </View>

            {/* Edit and Logout Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            </View>
            {/* Modal for Editing Profile */}
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
        backgroundColor: '#ffffff', // Keep the background color white
    },
    header:{
      // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius:10,
        backgroundColor: '#E0F7FA', 
        elevation:10,// Keep the background color white
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
        backgroundColor: '#f8f8f8', // Light gray background for info section
        borderRadius: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
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
        alignItems: 'center',
        marginRight: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    logoutButton: {
        flex: 1,
        backgroundColor: '#F44336', // Red color for logout
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for modal
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        color: '#00796B',
    },
    input: {
        borderWidth: 1,
        borderColor: '#B0BEC5',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#00796B',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: '#E0E0E0',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    heading:{
      fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        color: '#00796B',
    }
});

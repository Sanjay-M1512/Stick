import React, { useState } from "react";
import { TouchableOpacity, ScrollView, Modal, View } from "react-native";
import { Text, TextInput, StyleSheet } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import Lottie from 'lottie-react-native';
import axios from 'axios';

const Signup = ({ navigation }) => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [isPressed, setIsPressed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [emergencyContacts, setEmergencyContacts] = useState(["", "", ""]);

    const onSubmit = async (data) => {
        setLoading(true);
        setErrorMessage("");

        // Example validation
        if (data.password.length < 8) {
            Toast.show({
                text1: 'Signup Failed',
                text2: 'Password must be at least 8 characters long and contain 1 special character',
                type: 'error',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
            });
            setLoading(false);
            return;
        }

        // Send the data to the backend
        try {
            const response = await axios.post('http://192.168.146.206:5000/register', {
                name: data.name,
                mobile: data.mobileNumber,
                email: data.email,
                stickId: data.stickId,
                emergencyContacts: emergencyContacts.filter(contact => contact.trim() !== ""), // Filter out empty contacts
                password: data.password
            });

            // If successful, show a success message
            Toast.show({
                text1: 'Signup Successful',
                text2: response.data.message,
                type: 'success',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
            });

            // Navigate to Login after a delay
            setTimeout(() => navigation.navigate('Login'), 4000);
        } catch (error) {
            console.error(error);
            if (error.response) {
                Toast.show({
                    text1: 'Signup Failed',
                    text2: error.response.data.error || 'An error occurred during signup',
                    type: 'error',
                    position: 'top',
                    visibilityTime: 3000,
                    autoHide: true,
                });
            } else {
                Toast.show({
                    text1: 'Signup Failed',
                    text2: 'An unexpected error occurred',
                    type: 'error',
                    position: 'top',
                    visibilityTime: 3000,
                    autoHide: true,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmergencyContactChange = (index, value) => {
        const newContacts = [...emergencyContacts];
        newContacts[index] = value;
        setEmergencyContacts(newContacts);
    };

    const toastConfig = {
        success: (internalState) => (
            <View style={styles.toastSuccess}>
                <Text style={styles.toastText}>{internalState.text1}</Text>
                <Text style={styles.toastSubText}>{internalState.text2}</Text>
            </View>
        ),
        error: (internalState) => (
            <View style={styles.toastError}>
                <Text style={styles.toastText}>{internalState.text1}</Text>
                <Text style={styles.toastSubText}>{internalState.text2}</Text>
            </View>
        ),
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Lottie source={require('../assets/login.json')} autoPlay loop style={styles.lottie} />

            <View style={styles.formContainer}>
                <Text style={styles.title}>Create an Account</Text>

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: 'Name is required' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.name && styles.inputError]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Name"
                                placeholderTextColor="#B0BEC5"
                            />
                        )}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="mobileNumber"
                        rules={{ required: 'Mobile number is required' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.mobileNumber && styles.inputError]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Mobile Number"
                                placeholderTextColor="#B0BEC5"
                                keyboardType="phone-pad"
                                autoCapitalize="none"
                            />
                        )}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.email && styles.inputError]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Email (optional)"
                                placeholderTextColor="#B0BEC5"
                                autoCapitalize="none"
                            />
                        )}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: 'Password is required' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.password && styles.inputError]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Password"
                                secureTextEntry
                                placeholderTextColor="#B0BEC5"
                            />
                        )}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="stickId"
                        rules={{ required: 'Stick ID is required' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.stickId && styles.inputError]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Stick ID"
                                placeholderTextColor="#B0BEC5"
                            />
                        )}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, isPressed && styles.buttonPressed]}
                    onPressIn={() => setIsPressed(true)}
                    onPressOut={() => setIsPressed(false)}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.buttonText}>
                        Add Emergency Contacts
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, isPressed && styles.buttonPressed]}
                    onPressIn={() => setIsPressed(true)}
                    onPressOut={() => setIsPressed(false)}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Creating account...' : 'SIGN UP'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        {/* Close button at the top */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Emergency Contacts</Text>
                        {emergencyContacts.map((contact, index) => (
                            <TextInput
                                key={index}
                                style={styles.input}
                                placeholder={`Contact ${index + 1}`}
                                placeholderTextColor="#B0BEC5"
                                value={contact}
                                onChangeText={(value) => handleEmergencyContactChange(index, value)}
                            />
                        ))}

                        <TouchableOpacity
                            style={[styles.button, styles.modalButton]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Save Contacts</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#E0F7FA',
    },
    lottie: {
        width: 200,
        height: 200,
        marginBottom: 30,
    },
    formContainer: {
        width: '90%',
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00796B',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        height: 48,
        borderColor: '#B0BEC5',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        backgroundColor: '#ECEFF1',
        width:'100%',
        color:'black',
    },
    inputError: {
        borderColor: '#D32F2F',
    },
    errorText: {
        color: '#D32F2F',
        marginBottom: 16,
    },
    button: {
        height: 48,
        backgroundColor: '#00796B',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 16,
        width:'100%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonPressed: {
        opacity: 0.7,
    },
    toastSuccess: {
        padding: 16,
        backgroundColor: '#388E3C',
        borderRadius: 8,
    },
    toastError: {
        padding: 16,
        backgroundColor: '#D32F2F',
        borderRadius: 8,
    },
    toastText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    toastSubText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#00796B',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#00796B',
        borderRadius: 50,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalButton: {
        marginTop: 16,
    },
});

export default Signup;

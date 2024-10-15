import React from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { Text, View, TextInput, StyleSheet } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useState } from "react";
import Lottie from 'lottie-react-native';
import axios from 'axios';

const Signup = ({ navigation }) => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [isPressed, setIsPressed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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
            const response = await axios.post('http://192.168.39.154:5000/register', {
                name: data.name,
                mobile: data.mobileNumber,
                email: data.email,
                stickId: data.stickId,
                emergencyContacts: [], // Add your emergency contacts logic here
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
            setTimeout(() => navigation.navigate('Login'), 4000); // Updated to navigate to Login
        } catch (error) {
            console.error(error);
            // Handle the error response
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
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Creating account...' : 'SIGN UP'}
                    </Text>
                </TouchableOpacity>
            </View>

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
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#00796B',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center',
        color: '#00796B',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 16,
    },
    input: {
        width: '100%',
        padding: 10,
        fontSize: 18,
        borderRadius: 8,
        backgroundColor: '#F1F1F1',
        color: '#000',
        borderColor: '#B0BEC5',
        borderWidth: 1,
        textAlign: 'center',
    },
    inputError: {
        borderColor: 'red',
    },
    button: {
        width: '100%',
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#2196F3',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 3,
    },
    buttonPressed: {
        backgroundColor: '#64B5F6',
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '600',
    },
    toastSuccess: {
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    toastError: {
        backgroundColor: '#F44336',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    toastText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    toastSubText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default Signup;

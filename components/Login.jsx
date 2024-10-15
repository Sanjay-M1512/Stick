import React from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { Text, View, TextInput, StyleSheet } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useState } from "react";
import Lottie from 'lottie-react-native';
import axios from 'axios';  // Import axios for API calls
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const Login = () => {
    const navigation = useNavigation(); // Initialize useNavigation hook
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [isPressed, setIsPressed] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        
        try {
            // API call to Flask backend
            const response = await axios.post('http://192.168.39.154:5000/login', {
                mobile: data.mobileNumber,
                stickId: data.stickId,
                password: data.password,
            });

            // If login is successful, navigate to the Main screen
            Toast.show({
                text1: 'Login Successful',
                text2: 'Welcome back!',
                type: 'success',
                position: 'top',
                visibilityTime: 3000,
                autoHide: true,
            });

            setTimeout(() => navigation.navigate('Main'), 4000);
        } catch (error) {
            // Handle error from server
            if (error.response) {
                const { status, data } = error.response;
                if (status === 404) {
                    Toast.show({
                        text1: 'Login Failed',
                        text2: data.error || 'Invalid mobile number or stick ID',
                        type: 'error',
                        position: 'top',
                        visibilityTime: 3000,
                        autoHide: true,
                    });
                } else if (status === 401) {
                    Toast.show({
                        text1: 'Login Failed',
                        text2: data.error || 'Invalid password',
                        type: 'error',
                        position: 'top',
                        visibilityTime: 3000,
                        autoHide: true,
                    });
                }
            } else {
                Toast.show({
                    text1: 'Login Failed',
                    text2: 'An unexpected error occurred. Please try again.',
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
                <Text style={styles.title}>Login with Your Mobile</Text>

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

                <TouchableOpacity
                    style={[styles.button, isPressed && styles.buttonPressed]}
                    onPressIn={() => setIsPressed(true)}
                    onPressOut={() => setIsPressed(false)}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Logging in...' : 'LOGIN'}
                    </Text>
                </TouchableOpacity>

                {/* New User option */}
                <TouchableOpacity
                    style={styles.newUserContainer}
                    onPress={() => navigation.navigate('Signup')} // Navigate to Signup screen
                >
                    <Text style={styles.newUserText}>New User? Sign Up Here</Text>
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
        padding: 16,
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
    newUserContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    newUserText: {
        color: '#00796B',
        fontSize: 16,
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

export default Login;

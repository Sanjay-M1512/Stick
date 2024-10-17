import React, { useState } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { Text, View, TextInput, StyleSheet } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import Lottie from 'lottie-react-native';
import axios from 'axios';  
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Login = () => {
    const navigation = useNavigation();
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.146.206:5000/login', {
                mobile: data.mobileNumber,
                stickId: data.stickId,
                password: data.password,
            });
            await AsyncStorage.setItem('mobile', data.mobileNumber);
            // Store user information here if needed, like token
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
            handleLoginError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginError = (error) => {
        if (error.response) {
            const { status, data } = error.response;
            const errorMessage = data.error || 'Something went wrong, please try again.';
            if (status === 404 || status === 401) {
                showToast('Login Failed', errorMessage, 'error');
            } else {
                showToast('Login Failed', 'An unexpected error occurred. Please try again.', 'error');
            }
        } else {
            showToast('Login Failed', 'Network error. Please check your connection.', 'error');
        }
    };

    const showToast = (title, message, type) => {
        Toast.show({
            text1: title,
            text2: message,
            type: type,
            position: 'top',
            visibilityTime: 3000,
            autoHide: true,
        });
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

                {/* Mobile Number Input */}
                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="mobileNumber"
                        rules={{ 
                            required: 'Mobile number is required', 
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: 'Invalid mobile number'
                            }
                        }}
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
                    {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber.message}</Text>}
                </View>

                {/* Stick ID Input */}
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
                    {errors.stickId && <Text style={styles.errorText}>{errors.stickId.message}</Text>}
                </View>

                {/* Password Input */}
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
                    {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={styles.button}
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
                    onPress={() => navigation.navigate('Signup')}
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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
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

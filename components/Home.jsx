import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const Home = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Walk-Guard</Text>
      <View style={styles.formContainer}>
        <View style={styles.animation}>
          <LottieView 
            source={require('../assets/walk.json')} 
            autoPlay 
            loop 
            style={styles.lottieAnimation}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.login} onPress={()=>navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signup} onPress={()=>navigation.navigate('Signup')}>
            <Text style={styles.buttonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#E0F7FA', // Light cyan background
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00796B', // Teal color for title
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background for the form
    borderRadius: 20,
    elevation: 5,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: '90%',
  },
  animation: {
    width: '100%',
    height: 200,
    marginBottom: 30,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  login: {
    backgroundColor: '#2196F3', // Blue for login button
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    marginHorizontal: 5,
  },
  signup: {
    backgroundColor: '#4CAF50', // Green for signup button
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from './Profile';
import Direction from './Direction'; // Ensure this component exists
// Placeholder images for icons
import person from '../assets/profile.png'; // Placeholder for Profile icon
import personOutline from '../assets/personOutline.png'; // Placeholder for Profile outline icon
import map from '../assets/map.png'; // Placeholder for Map icon
import mapOutline from '../assets/mapoutline.png'; // Placeholder for Map outline icon

const Tab = createBottomTabNavigator();

const BottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar, // Apply styles to tab bar
                tabBarLabelStyle: styles.tabBarLabel, // Label styles
                tabBarIconStyle: styles.tabBarIcon, // Icon styles
                tabBarActiveTintColor: '#00796B', // Color when active
                tabBarInactiveTintColor: '#B0BEC5', // Color when inactive
                tabBarLabel: ({ focused }) => {
                    let label;
                    if (route.name === 'Profile') {
                        label = 'Profile';
                    } else if (route.name === 'Direction') {
                        label = 'Directions';
                    }
                    return <Text style={{ color: focused ? '#00796B' : '#B0BEC5', fontSize: 12, fontWeight: '600' }}>{label}</Text>;
                },
                tabBarIcon: ({ focused }) => {
                    let iconName;
                    if (route.name === 'Profile') {
                        iconName = focused ? person : personOutline; // Use the appropriate icon
                    } else if (route.name === 'Direction') {
                        iconName = focused ? map : mapOutline; // Use the appropriate icon
                    }
                    return (
                        <Image
                            source={iconName}
                            style={styles.icon}
                        />
                    );
                },
            })}
        >
            <Tab.Screen name='Profile' component={Profile} />
            <Tab.Screen name='Direction' component={Direction} />
        </Tab.Navigator>
    );
};

export default BottomTab;

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#E0F7FA', // Light cyan background
        paddingBottom: 10,
        paddingTop: 5,
        borderTopWidth: 0, // Remove border on top of tab bar
        elevation: 10, // Add shadow for elevation
        borderRadius: 20, // Rounded corners
        position: 'absolute', // For positioning at the bottom
        left: 10,
        right: 10,
        bottom: 10,
        height: 70, // Height of the tab bar
        justifyContent: 'center', // Center items vertically
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    tabBarLabel: {
        fontSize: 12,
        marginBottom: 5,
        fontWeight: '600',
    },
    tabBarIcon: {
        marginBottom: 5,
    },
    icon: {
        width: 28, // Slightly larger icon
        height: 28,
        resizeMode: 'contain', // Ensure the icon maintains aspect ratio
    },
});

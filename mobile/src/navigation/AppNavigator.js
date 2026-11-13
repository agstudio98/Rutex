import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import theme from '../theme/theme';
import { HomeIcon, CompassIcon, SettingsIcon } from '../components/SvgIcons';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LandingScreen from '../screens/LandingScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ActiveRouteScreen from '../screens/ActiveRouteScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="LandingTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#262626',
          borderTopWidth: 1.5,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.yellow,
        tabBarInactiveTintColor: '#737373',
        tabBarLabelStyle: {
          fontFamily: theme.fonts.bodyBold,
          fontSize: 10,
          letterSpacing: 1,
          textTransform: 'uppercase',
        },
        tabBarIcon: ({ focused }) => {
          const color = focused ? theme.colors.yellow : '#737373';
          if (route.name === 'LandingTab') {
            return <HomeIcon size={20} color={color} />;
          }
          if (route.name === 'MapTab') {
            return <CompassIcon size={20} color={color} />;
          }
          if (route.name === 'SettingsTab') {
            return <SettingsIcon size={20} color={color} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen
        name="LandingTab"
        component={LandingScreen}
        options={{
          tabBarLabel: 'Inicio',
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Mapa',
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Ajustes',
          title: 'Rutex',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.yellow} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: theme.fonts.h2,
          letterSpacing: 1,
        },
        headerShadowVisible: false,
      }}
    >
      {!isAuthenticated ? (
        // Flujo de autenticación
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              title: 'REGISTRO RUTEX',
              headerTitleStyle: {
                fontFamily: theme.fonts.h2,
                fontSize: 16,
                letterSpacing: 1.5,
              },
            }}
          />
        </>
      ) : (
        // Flujo autenticado principal
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ActiveRoute"
            component={ActiveRouteScreen}
            options={{
              title: 'ACOMPAÑAMIENTO EN VIVO',
              headerBackVisible: false,
              headerTitleStyle: {
                fontFamily: theme.fonts.h2,
                fontSize: 15,
                letterSpacing: 1.5,
              },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;

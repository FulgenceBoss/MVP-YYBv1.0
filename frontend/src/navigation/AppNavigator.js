import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { fetchDashboardData } from "../store/slices/dashboardSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import screens
import SignUpScreen from "../screens/auth/SignUpScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import OtpScreen from "../screens/auth/OtpScreen";
import AmountSelectionScreen from "../screens/savings/AmountSelectionScreen";
import FinalConfigScreen from "../screens/savings/FinalConfigScreen";
import AppLoadingScreen from "../screens/AppLoadingScreen";
import DashboardScreen from "../screens/DashboardScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const {
    isAuthenticated,
    user,
    token,
    status: authStatus,
  } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            {/* Hub and Main App Screens */}
            <Stack.Screen name="AppLoading" component={AppLoadingScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen
              name="AmountSelection"
              component={AmountSelectionScreen}
            />
            <Stack.Screen name="FinalConfig" component={FinalConfigScreen} />
          </>
        ) : (
          <>
            {/* Auth Screens */}
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

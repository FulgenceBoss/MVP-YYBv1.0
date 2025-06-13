import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";

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
  const { isAuthenticated } = useSelector((state) => state.auth);

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

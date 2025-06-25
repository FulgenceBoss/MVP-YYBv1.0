import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import { rehydrateAuth } from "../store/slices/authSlice";
import { ActivityIndicator, View, StyleSheet, Alert } from "react-native";
import { COLORS } from "../constants/theme";

// Import Screens
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import OtpScreen from "../screens/auth/OtpScreen";
// import PinScreen from "../screens/auth/PinScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ManualSavingsScreen from "../screens/savings/ManualSavingsScreen";
import TransactionStatusScreen from "../screens/savings/TransactionStatusScreen";
import HistoryScreen from "../screens/HistoryScreen";
// import SavingsConfigScreen from "../screens/savings/SavingsConfigScreen";
import InitialRouteResolver from "./InitialRouteResolver";
import GoalSelectionScreen from "../screens/savings/GoalSelectionScreen";
import SpeedSelectionScreen from "../screens/savings/SpeedSelectionScreen";
import ConfirmationScreen from "../screens/savings/ConfirmationScreen";
import ProfileScreen from "../screens/user/ProfileScreen";
import SettingsScreen from "../screens/user/SettingsScreen";
import ManualSavingsConfirmationScreen from "../screens/savings/ManualSavingsConfirmationScreen";

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { userToken, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(rehydrateAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated && userToken ? (
          <>
            <AppStack.Screen name="Resolver" component={InitialRouteResolver} />
            <AppStack.Screen name="Dashboard" component={DashboardScreen} />
            <AppStack.Screen
              name="ManualSavings"
              component={ManualSavingsScreen}
            />
            <AppStack.Screen
              name="ManualSavingsConfirmation"
              component={ManualSavingsConfirmationScreen}
            />
            <AppStack.Screen
              name="TransactionStatus"
              component={TransactionStatusScreen}
            />
            <AppStack.Screen name="History" component={HistoryScreen} />
            <AppStack.Screen
              name="GoalSelection"
              component={GoalSelectionScreen}
            />
            <AppStack.Screen
              name="SpeedSelection"
              component={SpeedSelectionScreen}
            />
            <AppStack.Screen
              name="Confirmation"
              component={ConfirmationScreen}
            />
            <AppStack.Screen name="Profile" component={ProfileScreen} />
            <AppStack.Screen name="Settings" component={SettingsScreen} />
            {/* <AppStack.Screen
              name="SavingsConfig"
              component={SavingsConfigScreen}
            /> */}
          </>
        ) : (
          <>
            <AppStack.Screen name="SignUp" component={SignUpScreen} />
            <AppStack.Screen name="Login" component={LoginScreen} />
            <AppStack.Screen name="Otp" component={OtpScreen} />
            {/* <AppStack.Screen name="Pin" component={PinScreen} /> */}
          </>
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});

export default AppNavigator;

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserToken } from "../store/slices/authSlice";
import { ActivityIndicator, View, StyleSheet, Alert } from "react-native";
import { COLORS } from "../constants/theme";

// Import du nouveau service
import { registerForPushNotificationsAsync } from "../services/notificationService";

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
import AmountSelectionScreen from "../screens/savings/AmountSelectionScreen";
import FinalConfigScreen from "../screens/savings/FinalConfigScreen";
import InitialRouteResolver from "./InitialRouteResolver";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.auth);
  const { config: savingsConfig } = useSelector((state) => state.savingsConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem("userToken");
      } catch (_e) {
        // Restoring token failed
      }

      if (token) {
        dispatch(setUserToken(token));
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, [dispatch]);

  // Nouveau useEffect pour les notifications
  useEffect(() => {
    const registerAndShowToken = async () => {
      if (userToken) {
        const result = await registerForPushNotificationsAsync();
        if (result.error) {
          Alert.alert("Erreur de Notification", result.error);
        } else if (result.token) {
          // Pour le test, nous affichons le token. Plus tard, nous l'enverrons au serveur.
          Alert.alert("Token de Notification Obtenu", result.token);
        }
      }
    };
    registerAndShowToken();
  }, [userToken]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={userToken ? "Resolver" : "SignUp"}
      >
        {userToken ? (
          <>
            <Stack.Screen name="Resolver" component={InitialRouteResolver} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen
              name="AmountSelection"
              component={AmountSelectionScreen}
            />
            <Stack.Screen name="FinalConfig" component={FinalConfigScreen} />
            <Stack.Screen
              name="ManualSavings"
              component={ManualSavingsScreen}
            />
            <Stack.Screen
              name="TransactionStatus"
              component={TransactionStatusScreen}
            />
            <Stack.Screen name="History" component={HistoryScreen} />
            {/* <Stack.Screen
              name="SavingsConfig"
              component={SavingsConfigScreen}
            /> */}
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />
            {/* <Stack.Screen name="Pin" component={PinScreen} /> */}
          </>
        )}
      </Stack.Navigator>
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

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import api from "../../api/api";
import {
  setUserToken,
  setLoading,
  setError,
} from "../../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async () => {
    if (!phoneNumber || !pin) {
      Alert.alert("Erreur", "Veuillez saisir votre numéro et votre PIN.");
      return;
    }

    dispatch(setLoading(true));
    try {
      const response = await api.post("/auth/login", { phoneNumber, pin });

      if (response.data.success) {
        const { token } = response.data;
        await AsyncStorage.setItem("userToken", token);
        dispatch(setUserToken(token));
      } else {
        dispatch(setError(response.data.message));
        Alert.alert("Erreur de connexion", response.data.message);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Une erreur est survenue.";
      dispatch(setError(message));
      Alert.alert("Erreur", message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Content de vous revoir !</Text>
      <Text style={styles.subtitle}>
        Connectez-vous pour accéder à votre épargne
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Votre numéro de téléphone</Text>
        <View style={styles.phoneInputGroup}>
          <Text style={styles.countryPrefix}>🇬🇦 +241</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="06 12 34 56"
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
            maxLength={10}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Votre PIN à 4 chiffres</Text>
        <TextInput
          style={styles.pinInput}
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry
          onChangeText={setPin}
          value={pin}
        />
      </View>

      <TouchableOpacity style={styles.ctaButton} onPress={handleLogin}>
        <Text style={styles.ctaText}>Se Connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.loginLink}>
          Pas encore de compte ? S&apos;inscrire
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    textAlign: "center",
    marginBottom: SIZES.sm,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SIZES["3xl"],
  },
  inputContainer: {
    marginBottom: SIZES.xl,
  },
  inputLabel: {
    ...FONTS.h4,
    marginBottom: SIZES.base * 1.5,
  },
  phoneInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius_lg,
    paddingHorizontal: SIZES.padding / 2,
    height: 56,
  },
  countryPrefix: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginRight: SIZES.base,
  },
  phoneInput: {
    flex: 1,
    ...FONTS.h4,
  },
  pinInput: {
    ...FONTS.h1,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius_lg,
    height: 60,
    textAlign: "center",
    letterSpacing: 20,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius_lg,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.padding,
  },
  ctaText: {
    ...FONTS.h4,
    color: COLORS.surface,
  },
  loginLink: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;

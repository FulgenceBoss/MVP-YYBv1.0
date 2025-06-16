import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
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

const OtpScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const dispatch = useDispatch();

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [pin, setPin] = useState(new Array(4).fill(""));
  const [pinConfirm, setPinConfirm] = useState(new Array(4).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  const otpInputs = useRef([]);
  const pinInputs = useRef([]);
  const pinConfirmInputs = useRef([]);

  const handleOtpChange = (text, index) => {
    if (isNaN(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handlePinChange = (text, index) => {
    if (isNaN(text)) return;
    const newPin = [...pin];
    newPin[index] = text;
    setPin(newPin);

    if (text && index < 3) {
      pinInputs.current[index + 1].focus();
    }
  };

  const handlePinConfirmChange = (text, index) => {
    if (isNaN(text)) return;
    const newPinConfirm = [...pinConfirm];
    newPinConfirm[index] = text;
    setPinConfirm(newPinConfirm);

    if (text && index < 3) {
      pinConfirmInputs.current[index + 1].focus();
    }
  };

  const handleSecureAccount = async () => {
    const otpCode = otp.join("");
    const pinCode = pin.join("");
    const pinConfirmCode = pinConfirm.join("");

    if (otpCode.length !== 6) {
      Alert.alert("Erreur", "Veuillez saisir le code OTP à 6 chiffres.");
      return;
    }
    if (pinCode.length !== 4) {
      Alert.alert("Erreur", "Veuillez saisir un PIN à 4 chiffres.");
      return;
    }
    if (pinCode !== pinConfirmCode) {
      Alert.alert("Erreur", "Les PIN ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));
    try {
      const response = await api.post("/auth/verify", {
        phoneNumber,
        otpCode,
        pin: pinCode,
      });

      if (response.data.success) {
        const { token } = response.data;
        await AsyncStorage.setItem("userToken", token);
        dispatch(setUserToken(response.data));
      } else {
        dispatch(setError(response.data.message));
        Alert.alert("Erreur de vérification", response.data.message);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Une erreur est survenue.";
      dispatch(setError(message));
      Alert.alert("Erreur", message);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vérifiez votre téléphone</Text>
      <Text style={styles.subtitle}>Code envoyé au {phoneNumber}</Text>

      <Text style={styles.inputLabel}>Code de vérification (OTP)</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => handleOtpChange(text, index)}
            value={digit}
            ref={(ref) => (otpInputs.current[index] = ref)}
          />
        ))}
      </View>

      <Text style={styles.inputLabel}>Créez votre PIN sécurisé</Text>
      <View style={styles.otpContainer}>
        {pin.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry
            onChangeText={(text) => handlePinChange(text, index)}
            value={digit}
            ref={(ref) => (pinInputs.current[index] = ref)}
          />
        ))}
      </View>

      <Text style={styles.inputLabel}>Confirmez votre PIN</Text>
      <View style={styles.otpContainer}>
        {pinConfirm.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            secureTextEntry
            onChangeText={(text) => handlePinConfirmChange(text, index)}
            value={digit}
            ref={(ref) => (pinConfirmInputs.current[index] = ref)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.ctaButton, isLoading && styles.disabledButton]}
        onPress={handleSecureAccount}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={COLORS.surface} />
        ) : (
          <Text style={styles.ctaText}>🔐 Sécuriser mon compte</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...FONTS.h2,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    marginBottom: SIZES["3xl"],
  },
  inputLabel: {
    ...FONTS.h4,
    alignSelf: "flex-start",
    marginBottom: SIZES.md,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: SIZES.xl,
  },
  otpInput: {
    ...FONTS.h2,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius_lg,
    width: 50,
    height: 60,
    textAlign: "center",
    backgroundColor: COLORS.surface,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius_lg,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: SIZES.lg,
  },
  ctaText: {
    ...FONTS.h4,
    color: COLORS.surface,
  },
  disabledButton: {
    backgroundColor: COLORS.primary_dark,
  },
});

export default OtpScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import api from "../../api/api";
import { setLoading, setError } from "../../store/slices/authSlice";

const SignUpScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const validateGabonPhone = (phone) => {
    const gabonPattern = /^0[12567]\d{7}$/;
    return gabonPattern.test(phone.replace(/\s/g, ""));
  };

  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    setIsValid(validateGabonPhone(text));
  };

  const handleReceiveCode = async () => {
    if (!isValid) return;

    dispatch(setLoading(true));
    try {
      const response = await api.post("/auth/register", { phoneNumber });
      if (response.data.success) {
        navigation.navigate("Otp", { phoneNumber });
      } else {
        Alert.alert(
          "Erreur",
          response.data.message || "Une erreur est survenue."
        );
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Impossible de contacter le serveur.";
      Alert.alert("Erreur", message);
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>
          Rejoignez <Text style={styles.highlight}>10 000+</Text> épargnants
          gabonais
        </Text>
        <Text style={styles.subtitle}>
          Commencez votre parcours vers l&apos;indépendance financière
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Votre numéro de téléphone</Text>
          <View
            style={[styles.phoneInputGroup, isValid ? styles.validInput : {}]}
          >
            <Text style={styles.countryPrefix}>🇬🇦 +241</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="06 12 34 56"
              keyboardType="phone-pad"
              onChangeText={handlePhoneChange}
              value={phoneNumber}
              maxLength={10}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.ctaButton, !isValid && styles.ctaDisabled]}
          onPress={handleReceiveCode}
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.surface} />
          ) : (
            <Text style={styles.ctaText}>📨 Recevoir mon code</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          disabled={isLoading}
        >
          <Text style={styles.loginLink}>Déjà membre ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    textAlign: "center",
    marginBottom: SIZES.base,
  },
  highlight: {
    color: COLORS.primary,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SIZES.padding * 2,
  },
  inputContainer: {
    marginBottom: SIZES.padding,
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
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding / 2,
    height: 56,
  },
  validInput: {
    borderColor: COLORS.success,
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
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.padding,
  },
  ctaDisabled: {
    backgroundColor: COLORS.textSecondary,
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

export default SignUpScreen;

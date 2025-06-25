import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import { loginUser } from "../../store/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const LoginScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [loginError, setLoginError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLoginError(null);
    }, [])
  );

  useEffect(() => {
    if (route.params?.phoneNumber) {
      setPhoneNumber(route.params.phoneNumber);
    }
  }, [route.params?.phoneNumber]);

  const handleLogin = () => {
    if (!phoneNumber || !pin) {
      setLoginError("Veuillez remplir tous les champs.");
      setTimeout(() => setLoginError(null), 5000);
      return;
    }
    dispatch(loginUser({ phoneNumber, pin }))
      .unwrap()
      .catch((err) => {
        setLoginError(err);
        setTimeout(() => setLoginError(null), 5000);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <Text style={styles.title}>
                Content de vous <Text style={styles.highlight}>revoir !</Text>
              </Text>
              <Text style={styles.subtitle}>
                Connectez-vous pour accéder à votre épargne
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Votre numéro de téléphone</Text>
                <View style={styles.phoneInputGroup}>
                  <Text style={styles.countryPrefix}>GA +241</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="07 72 12 12"
                    keyboardType="phone-pad"
                    onChangeText={setPhoneNumber}
                    value={phoneNumber}
                    maxLength={9}
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
                  placeholder="••••"
                />
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.ctaButton, isLoading && styles.ctaDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.surface} />
              ) : (
                <Text style={styles.ctaText}>Se Connecter</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => (isLoading ? null : navigation.navigate("SignUp"))}
              disabled={isLoading}
            >
              <Text style={styles.navLink}>
                Pas encore de compte ? S&apos;inscrire
              </Text>
            </TouchableOpacity>
          </View>

          {loginError && (
            <View style={styles.toastContainer}>
              <Ionicons name="alert-circle" size={24} color="white" />
              <Text style={styles.toastText}>{loginError}</Text>
              <TouchableOpacity onPress={() => setLoginError(null)}>
                <Ionicons name="close-circle" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SIZES.padding * 2.5,
  },
  mainContent: {
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: SIZES.padding * 7,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.textPrimary,
    marginBottom: SIZES.base,
  },
  highlight: {
    color: COLORS.primary,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: "center",
    maxWidth: "80%",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: SIZES.xl,
  },
  inputLabel: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
  },
  phoneInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius_lg,
    paddingHorizontal: SIZES.padding,
    height: 56,
  },
  countryPrefix: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginRight: SIZES.base,
    fontWeight: "bold",
  },
  phoneInput: {
    flex: 1,
    ...FONTS.h4,
    color: COLORS.textPrimary,
  },
  pinInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius_lg,
    height: 56,
    textAlign: "center",
    color: COLORS.textPrimary,
    fontSize: 24,
    letterSpacing: Platform.OS === "ios" ? 15 : 10,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    marginTop: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius_lg,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: SIZES.lg,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  ctaDisabled: {
    backgroundColor: "#D1D1D6",
    elevation: 0,
  },
  ctaText: {
    ...FONTS.h4,
    color: COLORS.surface,
    fontWeight: "bold",
  },
  navLink: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: "600",
    padding: SIZES.base,
  },
  toastContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "#323232",
    borderRadius: SIZES.radius_lg,
    padding: SIZES.padding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toastText: {
    color: "white",
    flex: 1,
    marginHorizontal: 10,
    ...FONTS.body3,
  },
});

export default LoginScreen;

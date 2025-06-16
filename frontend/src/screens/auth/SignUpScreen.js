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
  ScrollView,
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
    // Regex for Gabon phone numbers (06, 07) followed by 7 digits.
    const gabonPattern = /^(06|07)\d{7}$/;
    return gabonPattern.test(phone.replace(/\s/g, ""));
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length > 9) {
      return numbers.substr(0, 9);
    }
    return numbers;
  };

  const handlePhoneChange = (text) => {
    const formattedText = formatPhoneNumber(text);
    setPhoneNumber(formattedText);
    const valid = validateGabonPhone(formattedText);
    setIsValid(valid);
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
      if (err.response?.data?.errorCode === "USER_ALREADY_EXISTS") {
        Alert.alert("Utilisateur existant", err.response.data.message, [
          {
            text: "Se connecter",
            onPress: () => navigation.navigate("Login", { phoneNumber }),
          },
          { text: "Annuler", style: "cancel" },
        ]);
      } else {
        const message =
          err.response?.data?.message || "Impossible de contacter le serveur.";
        Alert.alert("Erreur", message);
        dispatch(setError(message));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressIndicator}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>Étape 1/3</Text>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={styles.title}>
            Rejoignez <Text style={styles.highlight}>10 000+</Text>
            {"\n"}
            épargnants gabonais
          </Text>
          <Text style={styles.subtitle}>
            Commencez votre parcours vers l&apos;indépendance financière
          </Text>
        </View>

        <View style={styles.counterCard}>
          <View style={styles.counterBadge}>
            <Text style={styles.counterBadgeText}>GA</Text>
          </View>
          <Text style={styles.counterCardText}>
            <Text style={styles.counterCardNumber}>10 639</Text> Gabonais
            épargnent déjà avec nous
          </Text>
        </View>

        <View style={styles.testimonial}>
          <View style={styles.testimonialAvatar}>
            <Text style={styles.testimonialAvatarText}>M</Text>
          </View>
          <View style={styles.testimonialTextContainer}>
            <Text style={styles.testimonialQuote}>
              &quot;J&apos;ai déjà épargné 50 000 FCFA en 3 mois !&quot;
            </Text>
            <Text style={styles.testimonialAuthor}>
              Marie Ondongo, 28 ans, Libreville
            </Text>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>📱 Votre numéro de téléphone</Text>
          <View
            style={[
              styles.phoneInputGroup,
              isValid && styles.validInput,
              !isValid && phoneNumber.length > 0 && styles.invalidInput,
            ]}
          >
            <Text style={styles.countryPrefix}>GA +241</Text>
            <TextInput
              style={styles.phoneInput}
              placeholder="07 72 12 12"
              keyboardType="phone-pad"
              onChangeText={handlePhoneChange}
              value={phoneNumber}
              maxLength={9}
            />
            {isValid && (
              <View style={styles.validationIconContainer}>
                <Text style={styles.validationIcon}>✅</Text>
              </View>
            )}
          </View>
          {isValid && (
            <Text style={[styles.validationMessage, styles.validMessage]}>
              Numéro valide pour le Gabon
            </Text>
          )}
        </View>

        <View style={styles.securityBadges}>
          <View style={styles.securityBadge}>
            <Text style={styles.securityIcon}>🔒</Text>
            <Text style={styles.securityText}>Données{"\n"}protégées</Text>
          </View>
          <View style={styles.securityBadge}>
            <Text style={styles.securityIcon}>🚫</Text>
            <Text style={styles.securityText}>Aucun{"\n"}spam</Text>
          </View>
          <View style={styles.securityBadge}>
            <Text style={styles.securityIcon}>⚡</Text>
            <Text style={styles.securityText}>Déconnexion{"\n"}facile</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.ctaButton,
            (!isValid || isLoading) && styles.ctaDisabled,
          ]}
          onPress={handleReceiveCode}
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.surface} />
          ) : (
            <Text style={styles.ctaText}>📨 Recevoir mon code</Text>
          )}
        </TouchableOpacity>

        <View style={styles.legalSection}>
          <Text style={styles.legalText}>
            En continuant, vous acceptez nos{" "}
            <Text style={styles.legalLink}>Conditions d&apos;utilisation</Text>
            {" et notre "}
            <Text style={styles.legalLink}>Politique de confidentialité</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={styles.loginSection}
          onPress={() => navigation.navigate("Login")}
          disabled={isLoading}
        >
          <Text style={styles.loginLink}>Déjà membre ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    width: "100%",
  },
  backButton: {
    padding: SIZES.sm,
    marginRight: SIZES.sm,
  },
  backButtonText: {
    fontSize: 28,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  progressIndicator: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
  },
  progressFill: {
    width: "33%",
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressText: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: SIZES.padding * 1.5, // Plus d'espace sur les côtés
    paddingBottom: SIZES.padding * 2,
  },
  heroSection: {
    alignItems: "center",
    marginVertical: SIZES.xl, // Plus d'espace vertical
    paddingHorizontal: SIZES.base,
  },
  title: {
    fontSize: 26, // Légèrement réduit
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.textPrimary,
    lineHeight: 34,
    marginBottom: SIZES.base,
  },
  highlight: {
    color: COLORS.primary,
  },
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SIZES.base,
    paddingHorizontal: SIZES.base,
    lineHeight: 22,
  },
  counterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginVertical: 12,
    alignSelf: "center",
    minWidth: 0,
    width: "100%",
    maxWidth: 370,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  counterBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  counterBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  counterCardText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "500",
  },
  counterCardNumber: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  testimonial: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: SIZES.xl * 1.5,
    alignSelf: "center",
    width: "100%",
    maxWidth: 370,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.padding,
  },
  testimonialAvatarText: {
    ...FONTS.h3,
    color: COLORS.surface,
  },
  testimonialTextContainer: {
    flex: 1,
  },
  testimonialQuote: {
    ...FONTS.body3,
    fontStyle: "italic",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  testimonialAuthor: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  inputSection: {
    marginBottom: SIZES.xl * 1.5,
    alignSelf: "center",
    width: "100%",
    maxWidth: 370,
  },
  inputLabel: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
  },
  phoneInputGroup: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius_lg,
    paddingHorizontal: SIZES.padding,
    height: 60,
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
  validationIconContainer: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
  },
  validationIcon: {
    fontSize: 20,
  },
  validInput: {
    borderColor: COLORS.success,
    backgroundColor: "#E8F5E9",
  },
  invalidInput: {
    borderColor: COLORS.danger,
    backgroundColor: "#FFEBEE",
  },
  validationMessage: {
    ...FONTS.body4,
    color: COLORS.danger,
    marginTop: SIZES.base,
    fontWeight: "500",
  },
  validMessage: {
    color: COLORS.success,
  },
  securityBadges: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: SIZES.xl * 1.5,
    alignSelf: "center",
    width: "100%",
    maxWidth: 370,
  },
  securityBadge: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: SIZES.base / 2,
    textAlign: "center",
    fontWeight: "600",
  },
  securityIcon: {
    fontSize: 20,
    marginBottom: SIZES.base / 2,
  },
  securityText: {
    ...FONTS.body5,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontWeight: "600",
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius_lg,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.xl,
    alignSelf: "center",
    width: "100%",
    maxWidth: 370,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  ctaDisabled: {
    backgroundColor: "#D1D1D6",
    elevation: 0,
    fontWeight: "bold",
  },
  ctaText: {
    ...FONTS.h4,
    color: COLORS.surface,
    fontWeight: "bold",
  },
  legalSection: {
    marginBottom: SIZES.lg,
    alignSelf: "center",
    width: "100%",
    maxWidth: 370,
  },
  legalText: {
    ...FONTS.body5,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20, // Plus d'espace entre les lignes
    paddingHorizontal: SIZES.base,
  },
  legalLink: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  loginSection: {
    paddingBottom: SIZES.padding * 2,
    alignSelf: "center",
    width: "100%",
    maxWidth: 370,
  },
  loginLink: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default SignUpScreen;

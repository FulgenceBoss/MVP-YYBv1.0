import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from "react-native-reanimated";
import {
  updateSavingsConfig,
  setDeductionTime,
  setWallet,
  setOperator,
} from "../../store/slices/savingsConfigSlice";

// Ces couleurs sont basées sur le :root de la maquette HTML
const localColors = {
  primary: "#2e7d32",
  secondary: "#1976d2",
  success: "#4caf50",
  bg: "#fafafa",
  surface: "#ffffff",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#e0e0e0",
  lightGreen: "#e8f5e8",
  lightBlue: "#e3f2fd",
  moovOrange: "#ff6b00",
  airtelRed: "#e60012",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FinalConfigScreenV2 = ({ navigation }) => {
  const dispatch = useDispatch();
  const { amount, deductionTime, wallet, operator } = useSelector(
    (state) => state.savingsConfig
  );
  const { user } = useSelector((state) => state.auth);

  // Initialisation de l'état local depuis Redux
  useEffect(() => {
    if (!operator) dispatch(setOperator("Moov")); // Opérateur par défaut
    if (user?.phoneNumber && !wallet) {
      dispatch(setWallet(user.phoneNumber));
    }
  }, [operator, dispatch, user, wallet]);

  const [sliderWidth, setSliderWidth] = useState(0);
  const position = useSharedValue(0);
  const savedPosition = useSharedValue(0);

  const timeContexts = {
    6: "Tôt le matin",
    7: "Début de matinée",
    8: "Avant le travail",
    9: "Matinée",
    10: "Matinée",
    11: "Fin de matinée",
    12: "Midi",
    13: "Début d'après-midi",
    14: "Après-midi",
    15: "Après-midi",
    16: "Fin d'après-midi",
    17: "Fin de journée",
    18: "Après le travail",
    19: "Début de soirée",
    20: "Après votre journée de travail",
    21: "Soirée",
    22: "Soirée",
    23: "Fin de soirée",
  };
  const [time, setTime] = useState(20);
  const [timeContext, setTimeContext] = useState(timeContexts[20]);

  const updateReactState = (newHour) => {
    "worklet";
    runOnJS(setTime)(newHour);
    runOnJS(setTimeContext)(timeContexts[newHour] || "Horaire personnalisé");
  };

  useEffect(() => {
    if (sliderWidth > 0) {
      const initialPercentage = ((20 - 6) / 17) * 100;
      const initialPos = (initialPercentage / 100) * sliderWidth;
      position.value = initialPos;
      savedPosition.value = initialPos;
    }
  }, [sliderWidth]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (sliderWidth === 0) return;
      const newPos = savedPosition.value + e.translationX;
      position.value = Math.max(0, Math.min(newPos, sliderWidth));

      const percentage = (position.value / sliderWidth) * 100;
      const newHour = Math.round(6 + (percentage / 100) * 17);
      updateReactState(newHour);
    })
    .onEnd(() => {
      savedPosition.value = position.value;
    });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: position.value }],
    };
  });

  const animatedTrackStyle = useAnimatedStyle(() => {
    return {
      width: position.value,
    };
  });

  const handleSave = async () => {
    if (!wallet || wallet.length < 8) {
      Alert.alert("Erreur", "Veuillez saisir un numéro de téléphone valide.");
      return;
    }
    try {
      // --- Logique de conversion UTC ---
      const localTime = time; // ex: 20
      const now = new Date();
      // Créer une date avec l'heure locale sélectionnée
      now.setHours(localTime, 0, 0, 0);

      const utcHour = now.getUTCHours();
      const utcMinute = now.getUTCMinutes();

      // Formater en "HH:MM"
      const utcDeductionTime = `${String(utcHour).padStart(2, "0")}:${String(
        utcMinute
      ).padStart(2, "0")}`;
      // --- Fin de la logique de conversion ---

      await dispatch(
        updateSavingsConfig({
          amount,
          operator,
          wallet,
          deductionTime: utcDeductionTime, // Envoyer l'heure UTC
        })
      ).unwrap();
      Alert.alert(
        "Configuration terminée !",
        "Votre épargne est maintenant active."
      );
      navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
    } catch (e) {
      Alert.alert("Erreur", e.message || "Erreur lors de la sauvegarde");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.configScreen}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Navigation */}
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
            <Text style={styles.progressText}>Étape 4/4</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.mainTitle}>
              Finalisons votre épargne automatique
            </Text>
            <Text style={styles.mainSubtitle}>
              Plus que quelques détails et c&apos;est parti !
            </Text>
          </View>

          {/* Time Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prélèvement quotidien à :</Text>
            <Text style={styles.sectionSubtitle}>
              Choisissez l&apos;heure qui vous convient
            </Text>
            <View style={styles.timeSelector}>
              <View style={styles.timeDisplay}>
                <Text style={styles.timeValue}>{`${String(time).padStart(
                  2,
                  "0"
                )}:00`}</Text>
                <Text style={styles.timeContext}>{timeContext}</Text>
              </View>
              <GestureDetector gesture={panGesture}>
                <View
                  onLayout={(e) => {
                    setSliderWidth(e.nativeEvent.layout.width);
                  }}
                  style={styles.timeSlider}
                >
                  <Animated.View
                    style={[styles.timeTrack, animatedTrackStyle]}
                  />
                  <Animated.View
                    style={[styles.timeThumb, animatedThumbStyle]}
                  />
                </View>
              </GestureDetector>
              <View style={styles.timeLabels}>
                <Text>6h</Text>
                <Text>12h</Text>
                <Text>18h</Text>
                <Text>23h</Text>
              </View>
              <View style={styles.popularTime}>
                <Text style={styles.popularText}>
                  ⭐ Horaire populaire : 20h00
                </Text>
              </View>
            </View>
          </View>

          {/* Mobile Money Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Choisissez votre mobile money
            </Text>
            <Text style={styles.sectionSubtitle}>
              Sélectionnez votre opérateur
            </Text>
            <View style={styles.operatorSelection}>
              <TouchableOpacity
                style={[
                  styles.operatorCard,
                  operator === "Moov" && styles.selectedMoovCard,
                ]}
                onPress={() => dispatch(setOperator("Moov"))}
              >
                {operator === "Moov" && (
                  <View style={styles.selectedBadge}>
                    <Text style={{ color: "white" }}>✓</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.operatorLogo,
                    { backgroundColor: localColors.moovOrange },
                  ]}
                >
                  <Text style={styles.logoText}>M</Text>
                </View>
                <Text style={styles.operatorName}>Moov</Text>
                <Text style={styles.operatorSubtitle}>Partenaire officiel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.operatorCard,
                  operator === "Airtel" && styles.selectedAirtelCard,
                ]}
                onPress={() => dispatch(setOperator("Airtel"))}
              >
                {operator === "Airtel" && (
                  <View style={styles.selectedBadge}>
                    <Text style={{ color: "white" }}>✓</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.operatorLogo,
                    { backgroundColor: localColors.airtelRed },
                  ]}
                >
                  <Text style={styles.logoText}>A</Text>
                </View>
                <Text style={styles.operatorName}>Airtel</Text>
                <Text style={styles.operatorSubtitle}>Partenaire officiel</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.phoneInputGroup,
                wallet?.length >= 8 && styles.validInput,
              ]}
            >
              <View style={styles.operatorPrefix}>
                <View
                  style={[
                    styles.prefixLogo,
                    {
                      backgroundColor:
                        operator === "Moov"
                          ? localColors.moovOrange
                          : localColors.airtelRed,
                    },
                  ]}
                >
                  <Text style={styles.logoTextSmall}>
                    {operator === "Moov" ? "M" : "A"}
                  </Text>
                </View>
                <Text style={styles.prefixText}>+241</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="XX XX XX XX"
                value={wallet}
                onChangeText={(text) => dispatch(setWallet(text))}
                maxLength={9}
                keyboardType="phone-pad"
              />
              {wallet?.length >= 8 && (
                <Text style={styles.validationIcon}>✅</Text>
              )}
            </View>
          </View>

          {/* Security Info */}
          <View style={styles.securityInfo}>
            <View style={styles.securityIcon}>
              <Text>🔒</Text>
            </View>
            <View style={styles.securityTextContainer}>
              <Text style={styles.securityTitle}>Connexion sécurisée</Text>
              <Text style={styles.securitySubtitle}>
                Aucun prélèvement sans votre autorisation • Résiliable à tout
                moment
              </Text>
            </View>
          </View>

          {/* Summary Section */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>
              Récapitulatif de votre épargne
            </Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Montant quotidien :</Text>
              <Text style={styles.summaryValue}>
                {amount?.toLocaleString("fr-FR") || 0} FCFA
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Heure de prélèvement :</Text>
              <Text style={styles.summaryValue}>{`${String(time).padStart(
                2,
                "0"
              )}:00`}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Opérateur :</Text>
              <Text style={styles.summaryValue}>{operator}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Objectif annuel :</Text>
              <Text style={[styles.summaryValue, styles.summaryHighlight]}>
                365,000 FCFA
              </Text>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.ctaPrimary} onPress={handleSave}>
            <Text style={styles.ctaText}>🚀 Activer mon épargne auto</Text>
          </TouchableOpacity>

          {/* Help */}
          <View style={styles.helpSection}>
            <Text style={styles.helpText}>
              Besoin d&apos;aide ? Notre support est disponible 24/7
            </Text>
            <Text style={styles.helpLink}>📞 Contacter le support</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: localColors.surface },
  configScreen: { flex: 1, backgroundColor: "#f8f9fa" },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: localColors.primary,
    fontWeight: "bold",
  },
  progressIndicator: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: localColors.border,
    borderRadius: 2,
  },
  progressFill: {
    width: "90%",
    height: "100%",
    backgroundColor: localColors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: localColors.textSecondary,
    fontWeight: "600",
  },
  mainContent: { paddingHorizontal: 24 },
  heroSection: { alignItems: "center", marginVertical: 32 },
  mainTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: localColors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 16,
    color: localColors.textSecondary,
    textAlign: "center",
  },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: localColors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: localColors.textSecondary,
    marginBottom: 16,
  },
  timeSelector: {
    backgroundColor: localColors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: localColors.border,
  },
  timeDisplay: { alignItems: "center", marginBottom: 24 },
  timeValue: {
    fontSize: 36,
    fontWeight: "800",
    color: localColors.primary,
    marginBottom: 8,
  },
  timeContext: {
    fontSize: 14,
    color: localColors.textSecondary,
    fontWeight: "500",
  },
  timeSlider: {
    height: 8,
    backgroundColor: localColors.border,
    borderRadius: 4,
    justifyContent: "center",
  },
  timeTrack: {
    height: "100%",
    backgroundColor: localColors.primary,
    borderRadius: 4,
  },
  timeThumb: {
    position: "absolute",
    top: -8,
    width: 24,
    height: 24,
    backgroundColor: localColors.primary,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 12,
    elevation: 3,
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  popularTime: {
    backgroundColor: localColors.lightGreen,
    padding: 8,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  popularText: { fontSize: 12, color: localColors.primary, fontWeight: "600" },
  operatorSelection: { flexDirection: "row", gap: 16, marginBottom: 24 },
  operatorCard: {
    flex: 1,
    backgroundColor: localColors.surface,
    borderWidth: 3,
    borderColor: localColors.border,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  selectedMoovCard: {
    borderColor: localColors.moovOrange,
    elevation: 4,
    shadowColor: localColors.moovOrange,
    transform: [{ translateY: -2 }],
  },
  selectedAirtelCard: {
    borderColor: localColors.airtelRed,
    elevation: 4,
    shadowColor: localColors.airtelRed,
    transform: [{ translateY: -2 }],
  },
  selectedBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: localColors.success,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  operatorLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: { color: "white", fontSize: 24, fontWeight: "800" },
  operatorName: {
    fontSize: 16,
    fontWeight: "600",
    color: localColors.textPrimary,
  },
  operatorSubtitle: { fontSize: 12, color: localColors.textSecondary },
  phoneInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: localColors.surface,
    borderWidth: 2,
    borderColor: localColors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 60,
  },
  validInput: {
    borderColor: localColors.success,
    backgroundColor: localColors.lightGreen,
  },
  operatorPrefix: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 12,
    marginRight: 12,
    borderRightWidth: 1,
    borderRightColor: localColors.border,
  },
  prefixLogo: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  logoTextSmall: { color: "white", fontSize: 10, fontWeight: "800" },
  prefixText: { fontSize: 16, fontWeight: "600" },
  phoneInput: { flex: 1, fontSize: 16, fontWeight: "600" },
  validationIcon: { fontSize: 20 },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: localColors.lightBlue,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#b3e5fc",
    marginBottom: 24,
  },
  securityIcon: {
    width: 32,
    height: 32,
    backgroundColor: localColors.secondary,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontSize: 16,
  },
  securityTextContainer: { flex: 1 },
  securityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: localColors.textPrimary,
  },
  securitySubtitle: {
    fontSize: 12,
    color: localColors.textSecondary,
    lineHeight: 16,
  },
  summarySection: {
    backgroundColor: localColors.lightGreen,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: localColors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 14, color: localColors.textSecondary },
  summaryValue: {
    fontSize: 14,
    color: localColors.textPrimary,
    fontWeight: "600",
  },
  summaryHighlight: { color: localColors.primary, fontWeight: "700" },
  ctaPrimary: {
    height: 56,
    backgroundColor: localColors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 4,
  },
  ctaText: { color: "white", fontSize: 16, fontWeight: "700" },
  helpSection: { alignItems: "center", paddingBottom: 24 },
  helpText: { fontSize: 12, color: localColors.textSecondary, marginBottom: 8 },
  helpLink: { color: localColors.primary, fontWeight: "600", fontSize: 14 },
});

export default FinalConfigScreenV2;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import CustomAmountModal from "../../components/CustomAmountModal";
import TimeSelector from "../../components/TimeSelector";
import MobileMoneySelector from "../../components/MobileMoneySelector";
import {
  setAmount,
  setDeductionTime,
  setWallet,
  setOperator,
  updateSavingsConfig,
  setGoal,
} from "../../store/slices/savingsConfigSlice";

const localColors = {
  primary: "#2e7d32",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#e0e0e0",
  surface: "#ffffff",
  lightGreen: "#e8f5e8",
  success: "#4CAF50",
};

const speedOptions = [
  {
    rhythm: "Prudent",
    value: 500,
    label: "Café + pain au chocolat",
  },
  {
    rhythm: "Équilibré",
    value: 1000,
    label: "Bière Castel + brochettes",
    popular: true,
  },
  {
    rhythm: "Ambitieux",
    value: 2000,
    label: "Repas restaurant local",
  },
  {
    rhythm: "Déterminé",
    value: 5000,
    label: "Plein essence scooter",
  },
];

const SpeedSelectionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { goal, amount, deductionTime, wallet, operator } = useSelector(
    (state) => state.savingsConfig
  );
  const { user } = useSelector((state) => state.auth);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContext, setModalContext] = useState("speed"); // 'speed' or 'goal'
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    dispatch(setAmount(1000)); // Reset to default when goal changes
  }, [goal, dispatch]);

  useEffect(() => {
    if (user?.phoneNumber && !wallet) {
      dispatch(setWallet(user.phoneNumber));
    }
    if (!operator) {
      dispatch(setOperator("Moov"));
    }
  }, [user, wallet, operator, dispatch]);

  const handleAmountSelection = (selectedAmount) => {
    setIsCustomAmount(false);
    dispatch(setAmount(selectedAmount));
  };

  const handleCustomAmountPress = () => {
    setModalContext("speed");
    setIsModalVisible(true);
  };

  const handleEditGoalAmountPress = () => {
    setModalContext("goal");
    setIsModalVisible(true);
  };

  const handleSaveCustomAmount = (newAmount) => {
    const numericValue = parseInt(newAmount, 10);
    if (!isNaN(numericValue) && numericValue > 0) {
      if (modalContext === "speed") {
        setIsCustomAmount(true);
        dispatch(setAmount(numericValue));
      } else if (modalContext === "goal") {
        const updatedGoal = { ...goal, amount: newAmount };
        dispatch(setGoal(updatedGoal));
      }
    }
    setIsModalVisible(false);
    if (modalContext === "speed") {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 500, animated: true });
      }, 200);
    }
  };

  const handleSaveConfig = async () => {
    if (!wallet || wallet.length < 8) {
      Alert.alert("Erreur", "Veuillez saisir un numéro de téléphone valide.");
      return;
    }
    setIsLoading(true);
    // --- Convert local time to UTC ---
    const localTime = deductionTime || 20; // It's a number, ensure fallback
    const now = new Date();
    now.setHours(localTime, 0, 0, 0);
    const utcDeductionTime = `${String(now.getUTCHours()).padStart(
      2,
      "0"
    )}:${String(now.getUTCMinutes()).padStart(2, "0")}`;

    const configData = {
      goal,
      dailyAmount: amount,
      deductionTime: utcDeductionTime,
      wallet,
      operator,
    };

    try {
      await dispatch(updateSavingsConfig(configData)).unwrap();
      navigation.replace("Confirmation");
    } catch (e) {
      Alert.alert(
        "Erreur",
        e.message || "Erreur lors de la sauvegarde de la configuration."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const calculateGoalTime = () => {
    if (!goal || !amount || parseInt(amount) <= 0) {
      return "";
    }
    const goalAmount = parseInt(goal.amount, 10);
    const dailyAmount = parseInt(amount, 10);

    if (dailyAmount >= goalAmount) {
      return "1 jour";
    }

    const daysNeeded = Math.ceil(goalAmount / dailyAmount);

    if (daysNeeded < 30) {
      return `${daysNeeded} jours`;
    }

    const months = Math.ceil(daysNeeded / 30);

    if (months < 12) {
      return `${months} mois`;
    } else {
      const years = (months / 12).toFixed(1).replace(".0", "");
      return `${years} ans`;
    }
  };

  if (!goal) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Aucun objectif défini. Veuillez retourner en arrière.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Configurez votre plan</Text>
        <Text style={styles.subtitle}>
          Dites-nous à quel rythme vous souhaitez épargner pour votre objectif.
        </Text>
        <View style={styles.goalCard}>
          <Text style={styles.goalIcon}>{goal.icon}</Text>
          <Text style={styles.goalName}>{goal.name}</Text>
          <TouchableOpacity
            style={styles.goalAmountContainer}
            onPress={handleEditGoalAmountPress}
          >
            <Text style={styles.goalAmount}>
              {parseInt(goal.amount, 10).toLocaleString("fr-FR")} FCFA
            </Text>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choisissez votre vitesse</Text>
          <Text style={styles.sectionHelpText}>
            Chaque jour, nous prélèverons ce montant de votre compte Mobile
            Money.
          </Text>
          <View style={styles.amountGrid}>
            {speedOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.amountCard,
                  amount === opt.value &&
                    !isCustomAmount &&
                    styles.selectedCard,
                ]}
                onPress={() => handleAmountSelection(opt.value)}
              >
                <Text style={styles.rhythmLabel}>{opt.rhythm}</Text>
                {opt.popular && <Text style={styles.popularBadge}>⭐</Text>}
                <View style={styles.amountContainer}>
                  <Text
                    style={[
                      styles.amountValue,
                      amount === opt.value &&
                        !isCustomAmount &&
                        styles.selectedText,
                    ]}
                  >
                    {opt.value.toLocaleString("fr-FR")}
                  </Text>
                  <Text
                    style={[
                      styles.amountFrequency,
                      amount === opt.value &&
                        !isCustomAmount &&
                        styles.selectedText,
                    ]}
                  >
                    FCFA/jour
                  </Text>
                </View>
                <Text style={styles.amountLabel}>= {opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.otherAmountCard}>
            <TouchableOpacity
              style={[
                styles.amountCard,
                styles.otherAmountCard,
                isCustomAmount && styles.selectedCard,
              ]}
              onPress={handleCustomAmountPress}
            >
              {isCustomAmount && amount > 0 ? (
                <View style={styles.customAmountTextContainer}>
                  <Text style={[styles.amountValue, styles.selectedText]}>
                    {amount.toLocaleString("fr-FR")} FCFA
                  </Text>
                  <Text style={styles.amountLabel}>Votre montant</Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.amountValue,
                    isCustomAmount && styles.selectedText,
                  ]}
                >
                  ✏️ Autre montant
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TimeSelector
          onTimeChange={(time) => dispatch(setDeductionTime(time))}
        />
        <MobileMoneySelector
          operator={operator}
          wallet={wallet}
          onOperatorChange={(op) => dispatch(setOperator(op))}
          onWalletChange={(num) => dispatch(setWallet(num))}
        />

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
            <Text style={styles.summaryValue}>
              {`${String(deductionTime || "20").padStart(2, "0")}:00`}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Opérateur :</Text>
            <Text style={styles.summaryValue}>{operator}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>
              Temps estimé pour atteindre:
            </Text>
            <Text style={[styles.summaryValue, styles.summaryHighlight]}>
              {calculateGoalTime()}
            </Text>
          </View>
        </View>

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

        <TouchableOpacity
          style={[styles.ctaPrimary, isLoading && styles.ctaDisabled]}
          onPress={handleSaveConfig}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color="white" size="small" />
              <Text style={styles.loaderText}>Activation...</Text>
            </View>
          ) : (
            <Text style={styles.ctaText}>🚀 Activer mon épargne</Text>
          )}
        </TouchableOpacity>

        <View style={styles.helpSection}>
          <Text style={styles.helpText}>
            Besoin d&apos;aide ? Notre support est disponible 24/7
          </Text>
          <Text style={styles.helpLink}>📞 Contacter le support</Text>
        </View>
        <CustomAmountModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSaveCustomAmount}
          modalTitle={
            modalContext === "goal"
              ? "Modifier le montant de l'objectif"
              : "Saisir le montant quotidien"
          }
          inputPlaceholder={
            modalContext === "goal"
              ? "Nouveau montant de l'objectif"
              : "Montant par jour"
          }
          initialValue={
            modalContext === "goal" ? goal.amount : amount ? amount : ""
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: localColors.surface },
  scrollView: { flex: 1 },
  contentContainer: { padding: 24 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: localColors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: localColors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  sectionHelpText: {
    fontSize: 14,
    color: localColors.textSecondary,
    marginBottom: 16,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  goalCard: {
    backgroundColor: localColors.lightGreen,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: localColors.primary,
  },
  goalIcon: { fontSize: 40, marginBottom: 8 },
  goalName: { fontSize: 18, fontWeight: "600", color: localColors.textPrimary },
  goalAmountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goalAmount: { fontSize: 16, fontWeight: "700", color: localColors.primary },
  editIcon: {
    fontSize: 16,
  },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: localColors.textPrimary,
    marginBottom: 16,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  amountCard: {
    backgroundColor: localColors.surface,
    borderWidth: 2,
    borderColor: localColors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    width: "48%", // Two columns
    alignItems: "center",
  },
  otherAmountCard: {
    width: "100%",
  },
  rhythmLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: localColors.textPrimary,
    marginBottom: 8,
  },
  selectedCard: {
    borderColor: localColors.primary,
    backgroundColor: "#e8f5e8",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: localColors.textPrimary,
    marginRight: 8,
  },
  amountFrequency: {
    fontSize: 12,
    color: localColors.textSecondary,
    fontWeight: "600",
  },
  selectedText: {
    color: localColors.primary,
  },
  popularBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    fontSize: 14,
  },
  amountLabel: {
    fontSize: 12,
    color: localColors.textSecondary,
    textAlign: "center",
  },
  customAmountTextContainer: {
    alignItems: "center",
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
  summaryHighlight: {
    color: localColors.primary,
    fontWeight: "700",
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B3E5FC",
    marginBottom: 24,
  },
  securityIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#1976D2",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
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
  helpSection: { alignItems: "center", paddingBottom: 24, marginTop: 16 },
  helpText: { fontSize: 12, color: localColors.textSecondary, marginBottom: 8 },
  helpLink: { color: localColors.primary, fontWeight: "600", fontSize: 14 },
  ctaPrimary: {
    height: 56,
    backgroundColor: localColors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    flexDirection: "row",
  },
  ctaText: { color: "white", fontSize: 16, fontWeight: "700" },
  ctaDisabled: {
    backgroundColor: "#275a29", // Darker green for loading state
  },
  loaderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loaderText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 12,
  },
});

export default SpeedSelectionScreen;

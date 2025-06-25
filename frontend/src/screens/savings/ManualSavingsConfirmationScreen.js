import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { saveManualTransaction } from "../../store/slices/dashboardSlice";
import { LinearGradient } from "expo-linear-gradient";

const localColors = {
  primary: "#2e7d32",
  surface: "#ffffff",
  textPrimary: "#212121",
  textSecondary: "#757575",
  background: "#fafafa",
  lightGreen: "#e8f5e8",
  moovOrange: "#ff6b00",
  airtelRed: "#e60012",
};

const ManualSavingsConfirmationScreen = ({ route, navigation }) => {
  const { amount } = route.params;
  const dispatch = useDispatch();
  const { manualSaveStatus, balance } = useSelector((state) => state.dashboard);
  const { config: savingsConfig } = useSelector((state) => state.savingsConfig);

  const handleConfirm = async () => {
    try {
      const result = await dispatch(saveManualTransaction(amount)).unwrap();
      navigation.replace("TransactionStatus", {
        status: "success",
        title: "Épargne Réussie !",
        message: `Vous avez ajouté ${result.transaction.amount.toLocaleString(
          "fr-FR"
        )} FCFA à votre épargne. Votre nouveau solde est de ${result.newBalance.toLocaleString(
          "fr-FR"
        )} FCFA.`,
      });
    } catch (error) {
      navigation.replace("TransactionStatus", {
        status: "error",
        title: "Échec de l'épargne",
        message: error.message || "Une erreur est survenue lors de l'épargne.",
      });
    }
  };

  const totalAfterSaving = (balance || 0) + (amount || 0);

  const operatorColor =
    savingsConfig?.operator === "Airtel"
      ? localColors.airtelRed
      : localColors.moovOrange;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.navHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Confirmer l'épargne</Text>
        </View>

        <View style={styles.content}>
          <LinearGradient
            colors={["#388E3C", "#2E7D32"]}
            style={[styles.card, styles.amountCard]}
          >
            <Text style={styles.cardTitleWhite}>Montant à épargner</Text>
            <Text style={styles.amountText}>
              {amount.toLocaleString("fr-FR")} FCFA
            </Text>
          </LinearGradient>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Depuis le portefeuille</Text>
            <View style={styles.walletContainer}>
              <View
                style={[
                  styles.operatorLogo,
                  { backgroundColor: operatorColor },
                ]}
              >
                <Text style={styles.operatorLogoText}>
                  {savingsConfig?.operator?.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.walletText}>{savingsConfig?.wallet}</Text>
                <Text style={styles.operatorText}>
                  {savingsConfig?.operator} Money
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Impact sur la cagnotte</Text>
            <View style={styles.impactRow}>
              <Text style={styles.impactLabel}>Total actuel :</Text>
              <Text style={styles.impactValue}>
                {(balance || 0).toLocaleString("fr-FR")} FCFA
              </Text>
            </View>
            <View style={styles.impactRow}>
              <Text style={styles.impactLabel}>Après épargne :</Text>
              <Text style={styles.impactValueHighlight}>
                {totalAfterSaving.toLocaleString("fr-FR")} FCFA
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleConfirm}
            disabled={manualSaveStatus === "loading"}
          >
            {manualSaveStatus === "loading" ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.ctaText}>💰 Confirmer et Épargner</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: localColors.background },
  container: { flex: 1 },
  navHeader: { flexDirection: "row", alignItems: "center", padding: 16 },
  backButton: { fontSize: 24, color: localColors.primary, fontWeight: "bold" },
  navTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: localColors.textPrimary,
    marginRight: 24,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: localColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: localColors.textSecondary,
    marginBottom: 16,
  },
  amountCard: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardTitleWhite: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 16,
  },
  amountText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  operatorLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  operatorLogoText: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
  },
  walletText: {
    fontSize: 22,
    fontWeight: "700",
    color: localColors.textPrimary,
    textAlign: "center",
  },
  operatorText: {
    fontSize: 14,
    color: localColors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  impactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  impactLabel: { fontSize: 16, color: localColors.textSecondary },
  impactValue: {
    fontSize: 16,
    color: localColors.textPrimary,
    fontWeight: "600",
  },
  impactValueHighlight: {
    fontSize: 18,
    color: localColors.primary,
    fontWeight: "700",
  },
  footer: {
    padding: 16,
    backgroundColor: localColors.surface,
  },
  ctaButton: {
    height: 56,
    backgroundColor: localColors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaText: { color: "white", fontSize: 16, fontWeight: "700" },
});

export default ManualSavingsConfirmationScreen;

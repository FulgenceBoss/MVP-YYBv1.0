import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

const localColors = {
  primary: "#2e7d32",
  success: "#4caf50",
  surface: "#ffffff",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#e0e0e0",
  lightGreen: "#e8f5e8",
  background: "#fafafa",
  moovOrange: "#ff6b00",
};

const AmountCard = ({ amount, label, selected, featured, onSelect }) => (
  <TouchableOpacity
    style={[
      styles.amountCard,
      selected
        ? styles.selectedCard
        : featured
        ? styles.featuredCard
        : styles.defaultCard,
    ]}
    onPress={() => onSelect(amount)}
  >
    {featured && (
      <View style={styles.popularBadge}>
        <Text style={{ color: "white", fontSize: 10 }}>⭐</Text>
      </View>
    )}
    <Text style={[styles.amountValue, selected && styles.selectedValueText]}>
      {amount.toLocaleString("fr-FR")} FCFA
    </Text>
    <Text style={styles.amountEquivalent}>{label}</Text>
  </TouchableOpacity>
);

const ManualSavingsScreen = ({ navigation }) => {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [isCustomSelected, setIsCustomSelected] = useState(false);
  const [customAmount, setCustomAmount] = useState("");

  const handleSelectAmount = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setIsCustomSelected(false);
  };

  const handleSelectCustom = () => {
    setIsCustomSelected(true);
    setSelectedAmount(null);
  };

  const handleCustomAmountChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setCustomAmount(numericValue);
    if (numericValue) {
      setSelectedAmount(parseInt(numericValue, 10));
    } else {
      setSelectedAmount(null);
    }
  };

  const handleNext = () => {
    if (!selectedAmount || selectedAmount < 100) {
      Alert.alert(
        "Montant invalide",
        "Veuillez sélectionner ou saisir un montant d'au moins 100 FCFA."
      );
      return;
    }
    // Naviguer vers l'écran de confirmation avec le montant
    navigation.navigate("ManualSavingsConfirmation", {
      amount: selectedAmount,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.navHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>Épargner maintenant</Text>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.sectionTitle}>Combien épargner ?</Text>
          <Text style={styles.sectionSubtitle}>
            Choisissez le montant qui vous convient
          </Text>

          <View style={styles.amountGrid}>
            <AmountCard
              amount={500}
              label="Transport extra"
              selected={!isCustomSelected && selectedAmount === 500}
              onSelect={handleSelectAmount}
            />
            <AmountCard
              amount={1000}
              label="Épargne habituelle"
              selected={!isCustomSelected && selectedAmount === 1000}
              featured={selectedAmount !== 1000}
              onSelect={handleSelectAmount}
            />
            <AmountCard
              amount={2000}
              label="Double effort !"
              selected={!isCustomSelected && selectedAmount === 2000}
              onSelect={handleSelectAmount}
            />
            <AmountCard
              amount={5000}
              label="Boost weekend"
              selected={!isCustomSelected && selectedAmount === 5000}
              onSelect={handleSelectAmount}
            />
            <TouchableOpacity
              style={[
                styles.amountCard,
                styles.customAmount,
                isCustomSelected && styles.selectedCard,
              ]}
              onPress={handleSelectCustom}
            >
              <Text
                style={[
                  styles.amountValue,
                  isCustomSelected && styles.selectedValueText,
                ]}
              >
                Autre montant
              </Text>
              <TextInput
                placeholder="Saisissez..."
                style={styles.customInput}
                keyboardType="numeric"
                value={customAmount}
                onChangeText={handleCustomAmountChange}
                onFocus={handleSelectCustom}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.ctaButton} onPress={handleNext}>
            <Text style={styles.ctaText}>Suivant →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: localColors.background },
  container: { paddingBottom: 40 },
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
  mainContent: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: localColors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
    alignItems: "stretch",
  },
  amountCard: {
    width: "48%",
    backgroundColor: localColors.surface,
    borderWidth: 3,
    borderColor: localColors.border,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  selectedCard: {
    borderColor: localColors.primary,
    backgroundColor: localColors.lightGreen,
  },
  featuredCard: {
    borderColor: localColors.primary,
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: localColors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  amountValue: {
    fontSize: 18,
    fontWeight: "800",
    color: localColors.textPrimary,
    marginBottom: 4,
  },
  selectedValueText: { color: localColors.primary },
  amountEquivalent: { fontSize: 12, color: localColors.textSecondary },
  section: { marginBottom: 32 },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: localColors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: localColors.border,
  },
  prefix: { fontSize: 16, marginRight: 8 },
  phoneInput: { flex: 1, height: 50, fontSize: 16 },
  ctaButton: {
    height: 56,
    backgroundColor: localColors.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  ctaText: { color: "white", fontSize: 16, fontWeight: "700" },
  customAmount: {
    width: "100%",
    borderColor: localColors.primary,
    borderStyle: "dashed",
  },
  customInput: {
    color: localColors.textPrimary,
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  summarySection: {
    backgroundColor: localColors.lightGreen,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: localColors.textPrimary,
    marginBottom: 16,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: localColors.primary,
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 14,
    color: localColors.textSecondary,
    marginBottom: 16,
  },
  impactPreview: {
    backgroundColor: localColors.surface,
    borderRadius: 12,
    padding: 16,
    width: "100%",
  },
  impactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  impactLabel: { color: localColors.textSecondary },
  impactValue: { color: localColors.textPrimary, fontWeight: "600" },
  impactValueHighlight: { color: localColors.primary, fontWeight: "700" },
  defaultCard: {
    borderColor: localColors.border,
  },
});

export default ManualSavingsScreen;

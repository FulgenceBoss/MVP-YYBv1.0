import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  saveSavingsConfig,
  setDeductionTime,
  setWallet,
  setOperator,
} from "../../store/slices/savingsConfigSlice";
import { COLORS, FONTS, SIZES } from "../../constants/theme";
import DateTimePicker from "@react-native-community/datetimepicker";

const OPERATORS = {
  Moov: { name: "Moov", logo: "M", color: "#FF6B00" },
  Airtel: { name: "Airtel", logo: "A", color: "#E60012" },
};

const FinalConfigScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { amount, deductionTime, wallet, operator } = useSelector(
    (state) => state.savingsConfig
  );

  const [localTime, setLocalTime] = useState("20:00");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    // Initialize local state from Redux state
    if (deductionTime) setLocalTime(deductionTime);
    if (!operator) dispatch(setOperator("Moov")); // Default operator
  }, [deductionTime, operator, dispatch]);

  const onTimeChange = (event, selectedDate) => {
    setShowPicker(false);
    if (event.type === "set" && selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      setLocalTime(`${hours}:${minutes}`);
    }
  };

  const handleSave = async () => {
    if (!wallet || wallet.length < 8) {
      Alert.alert("Erreur", "Veuillez saisir un numéro de téléphone valide.");
      return;
    }

    try {
      await dispatch(
        saveSavingsConfig({
          amount,
          operator,
          wallet,
          deductionTime: localTime,
        })
      ).unwrap();
      Alert.alert(
        "Configuration terminée !",
        "Votre épargne est maintenant active."
      );
      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      });
    } catch (e) {
      Alert.alert("Erreur", e.message || "Erreur lors de la sauvegarde");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Finalisez votre épargne</Text>
      <Text style={styles.subtitle}>Plus que quelques détails !</Text>

      {/* Time Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Heure de prélèvement</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.timeText}>{localTime}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour
            display="default"
            onChange={onTimeChange}
          />
        )}
      </View>

      {/* Operator Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choisissez votre mobile money</Text>
        <View style={styles.operatorContainer}>
          {Object.values(OPERATORS).map((op) => (
            <TouchableOpacity
              key={op.name}
              style={[
                styles.operatorCard,
                operator === op.name && styles.selectedOperator,
                { borderColor: op.color },
              ]}
              onPress={() => dispatch(setOperator(op.name))}
            >
              <View style={[styles.logo, { backgroundColor: op.color }]}>
                <Text style={styles.logoText}>{op.logo}</Text>
              </View>
              <Text style={styles.operatorName}>{op.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Phone Number Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Votre numéro de portefeuille</Text>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.prefix}>+241</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="0X XX XX XX"
            keyboardType="phone-pad"
            value={wallet}
            onChangeText={(text) => dispatch(setWallet(text))}
            maxLength={9}
          />
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Récapitulatif</Text>
        <View style={styles.summaryRow}>
          <Text>Montant quotidien :</Text>
          <Text style={styles.summaryValue}>{amount} FCFA</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Heure de prélèvement :</Text>
          <Text style={styles.summaryValue}>{localTime}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Opérateur :</Text>
          <Text style={styles.summaryValue}>{operator}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.ctaButton} onPress={handleSave}>
        <Text style={styles.ctaText}>🚀 Activer mon épargne</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  title: { ...FONTS.h1, textAlign: "center", marginBottom: SIZES.sm },
  subtitle: {
    ...FONTS.body1,
    textAlign: "center",
    color: COLORS.textSecondary,
    marginBottom: SIZES.lg,
  },
  section: { marginBottom: SIZES.xl },
  sectionTitle: { ...FONTS.h3, marginBottom: SIZES.md },
  timeButton: {
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    borderRadius: SIZES.radius,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeText: { ...FONTS.h2, color: COLORS.primary },
  operatorContainer: { flexDirection: "row", justifyContent: "space-around" },
  operatorCard: {
    flex: 1,
    alignItems: "center",
    padding: SIZES.md,
    borderWidth: 2,
    borderRadius: SIZES.radius_lg,
    marginHorizontal: SIZES.base,
  },
  selectedOperator: {
    transform: [{ scale: 1.05 }],
    backgroundColor: COLORS.lightGreen,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.sm,
  },
  logoText: { color: "white", ...FONTS.h3 },
  operatorName: { ...FONTS.h4 },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  prefix: { ...FONTS.body1, marginRight: SIZES.sm },
  phoneInput: { flex: 1, ...FONTS.body1, height: 50 },
  summary: {
    backgroundColor: COLORS.lightGreen,
    padding: SIZES.padding,
    borderRadius: SIZES.radius_lg,
    marginBottom: SIZES.xl,
  },
  summaryTitle: { ...FONTS.h3, textAlign: "center", marginBottom: SIZES.md },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.sm,
  },
  summaryValue: { ...FONTS.h4 },
  ctaButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius_lg,
    alignItems: "center",
  },
  ctaText: { color: "white", ...FONTS.h4 },
});

export default FinalConfigScreen;

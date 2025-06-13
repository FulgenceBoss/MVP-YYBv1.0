import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  setAmount,
  saveSavingsConfig,
  fetchSavingsConfig,
} from "../../store/slices/savingsConfigSlice";
import { logout } from "../../store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS, FONTS } from "../../constants/theme";

const AMOUNTS = [
  { value: 100, label: "Transport urbain court", yearly: 36500 },
  { value: 500, label: "Café + pain au chocolat", yearly: 182500 },
  {
    value: 1000,
    label: "Bière Castel + brochettes",
    yearly: 365000,
    popular: true,
  },
  { value: 2000, label: "Repas restaurant local", yearly: 730000 },
  { value: 5000, label: "Plein essence scooter", yearly: 1825000 },
];

const GOALS = [
  { icon: "📱", name: "Nouveau téléphone", target: 200000 },
  { icon: "🛵", name: "Scooter/Moto", target: 800000 },
  { icon: "🏠", name: "Acompte logement", target: 2000000 },
];

const AmountSelectionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { amount, status, error } = useSelector((state) => state.savingsConfig);

  useEffect(() => {
    dispatch(fetchSavingsConfig());
  }, [dispatch]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    dispatch(logout());
  };

  const handleSelect = (val) => {
    dispatch(setAmount(val));
  };

  const handleValidate = async () => {
    try {
      await dispatch(saveSavingsConfig({ amount })).unwrap();
      Alert.alert("Succès", "Montant enregistré !");
      navigation.navigate("FinalConfig");
    } catch (e) {
      Alert.alert("Erreur", e || "Erreur lors de la sauvegarde");
    }
  };

  const selectedConfig = AMOUNTS.find((a) => a.value === amount) || AMOUNTS[2];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.step}>Étape 3/4</Text>
      <Text style={styles.title}>Combien épargner chaque jour ?</Text>
      <Text style={styles.subtitle}>
        Choisissez un montant qui vous convient
      </Text>

      <View style={styles.amountList}>
        {AMOUNTS.map((a) => (
          <TouchableOpacity
            key={a.value}
            style={[
              styles.amountCard,
              amount === a.value && styles.selectedCard,
              a.popular && styles.popularCard,
            ]}
            onPress={() => handleSelect(a.value)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[
                  styles.amountValue,
                  amount === a.value && styles.selectedText,
                ]}
              >
                {a.value.toLocaleString("fr-FR")} FCFA
              </Text>
              {a.popular && (
                <Text style={styles.popularBadge}>⭐ Populaire</Text>
              )}
            </View>
            <Text style={styles.amountLabel}>= {a.label}</Text>
            <View style={styles.projectionRow}>
              <Text style={styles.projectionLabel}>par an</Text>
              <Text style={styles.projectionValue}>
                {a.yearly.toLocaleString("fr-FR")}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.projectionBox}>
        <Text style={styles.projectionTitle}>Votre épargne projetée</Text>
        <Text style={styles.projectionMain}>
          {selectedConfig.yearly.toLocaleString("fr-FR")} FCFA
        </Text>
        <Text style={styles.projectionPeriod}>en 1 an</Text>
      </View>

      <Text style={styles.goalsTitle}>Vos objectifs à portée de main</Text>
      <View style={styles.goalsList}>
        {GOALS.map((goal) => {
          const months = Math.ceil(goal.target / (amount * 30));
          const progress = Math.min(
            100,
            Math.round((selectedConfig.yearly / goal.target) * 100)
          );
          return (
            <View key={goal.name} style={styles.goalItem}>
              <Text style={styles.goalIcon}>{goal.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalTarget}>
                  {goal.target.toLocaleString("fr-FR")} FCFA
                </Text>
                <View style={styles.goalProgressBar}>
                  <View
                    style={[styles.goalProgressFill, { width: `${progress}%` }]}
                  />
                </View>
              </View>
              <Text
                style={[
                  styles.goalTime,
                  months <= 12
                    ? styles.goalTimeShort
                    : months <= 24
                    ? styles.goalTimeMedium
                    : styles.goalTimeLong,
                ]}
              >
                {months < 12
                  ? `${months} mois`
                  : `${(months / 12).toFixed(1)} ans`}
              </Text>
            </View>
          );
        })}
      </View>

      {status === "loading" ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ marginVertical: 24 }}
        />
      ) : (
        <TouchableOpacity style={styles.ctaButton} onPress={handleValidate}>
          <Text style={styles.ctaText}>💰 Configurer mon épargne</Text>
        </TouchableOpacity>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.info}>
        Vous pourrez modifier ce montant à tout moment
      </Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Déconnexion (Test)</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fafafa",
    flexGrow: 1,
    alignItems: "stretch",
  },
  step: {
    alignSelf: "flex-end",
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  title: {
    ...FONTS.h1,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  amountList: {
    marginBottom: 24,
  },
  amountCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: "#e8f5e8",
  },
  popularCard: {
    borderColor: COLORS.success,
  },
  amountValue: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginRight: 8,
  },
  selectedText: {
    color: COLORS.primary,
  },
  popularBadge: {
    backgroundColor: COLORS.success,
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    marginLeft: 8,
  },
  amountLabel: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  projectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectionLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  projectionValue: {
    fontSize: 16,
    color: COLORS.success,
    fontWeight: "bold",
  },
  projectionBox: {
    backgroundColor: "#e8f5e8",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  projectionTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 8,
    fontWeight: "600",
  },
  projectionMain: {
    fontSize: 32,
    color: COLORS.primary,
    fontWeight: "bold",
    marginBottom: 4,
  },
  projectionPeriod: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  goalsTitle: {
    ...FONTS.h3,
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  goalsList: {
    marginBottom: 24,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 10,
  },
  goalIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  goalName: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
  },
  goalTarget: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  goalProgressBar: {
    width: "100%",
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    marginTop: 4,
    marginBottom: 2,
  },
  goalProgressFill: {
    height: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  goalTime: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 8,
  },
  goalTimeShort: {
    color: COLORS.success,
  },
  goalTimeMedium: {
    color: COLORS.warning,
  },
  goalTimeLong: {
    color: COLORS.textSecondary,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  ctaText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: COLORS.error,
    textAlign: "center",
    marginBottom: 8,
  },
  info: {
    color: COLORS.textSecondary,
    textAlign: "center",
    fontSize: 13,
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: COLORS.error,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default AmountSelectionScreen;

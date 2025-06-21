import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  RefreshControl,
  Alert,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardData,
  fetchTransactions,
  trackAnalyticsEvent,
} from "../store/slices/dashboardSlice";
import {
  fetchSavingsConfig,
  updateSavingsConfig,
} from "../store/slices/savingsConfigSlice";
import CustomAmountModal from "../components/CustomAmountModal";

const localColors = {
  primary: "#2e7d32",
  success: "#4caf50",
  surface: "#ffffff",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#e0e0e0",
  lightGreen: "#e8f5e8",
  background: "#fafafa",
};

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    balance,
    transactions,
    status: balanceStatus,
  } = useSelector((state) => state.dashboard);
  const { config: savingsConfig, status: configStatus } = useSelector(
    (state) => state.savingsConfig
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchTransactions());
    dispatch(fetchSavingsConfig());
  }, [dispatch]);

  const convertUTCToLocalTime = (utcTime) => {
    if (!utcTime || typeof utcTime !== "string" || !utcTime.includes(":")) {
      return "N/A"; // Retourne une valeur par défaut si le format est incorrect
    }
    const [hours, minutes] = utcTime.split(":").map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);

    const localHours = String(date.getHours()).padStart(2, "0");
    const localMinutes = String(date.getMinutes()).padStart(2, "0");

    return `${localHours}:${localMinutes}`;
  };

  const handleRefresh = useCallback(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchTransactions());
    dispatch(fetchSavingsConfig());
  }, [dispatch]);

  const toggleSavings = (value) => {
    if (configStatus === "loading") return;
    dispatch(updateSavingsConfig({ active: value }))
      .unwrap()
      .then(() => {
        const eventName = value ? "savings_toggled_on" : "savings_toggled_off";
        dispatch(trackAnalyticsEvent({ eventName }));
      })
      .catch(() => {
        Alert.alert("Erreur", "Impossible de mettre à jour la configuration.");
      });
  };

  const handleSaveSpeed = (newSpeed) => {
    dispatch(updateSavingsConfig({ dailyAmount: newSpeed }));
    setIsModalVisible(false);
  };

  const goalTarget = savingsConfig?.goal?.amount || 200000;
  const progress = balance && goalTarget ? (balance / goalTarget) * 100 : 0;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  const getNextMilestone = () => {
    if (!goalTarget) return null;
    if (progress < 25) return { label: "25%", value: goalTarget * 0.25 };
    if (progress < 50) return { label: "50%", value: goalTarget * 0.5 };
    if (progress < 75) return { label: "75%", value: goalTarget * 0.75 };
    if (progress < 100) return { label: "100%", value: goalTarget };
    return null;
  };

  const nextMilestone = getNextMilestone();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={
              balanceStatus === "loading" || configStatus === "loading"
            }
            onRefresh={handleRefresh}
          />
        }
      >
        <LinearGradient
          colors={[localColors.primary, localColors.success]}
          style={styles.headerSection}
        >
          <Text style={styles.greeting}>
            Bonjour {user?.firstName || "Utilisateur"} 👋
          </Text>
          <Text style={styles.greetingTime}>Bonne soirée !</Text>
        </LinearGradient>

        <View style={styles.mainContent}>
          <View style={styles.savingsCard}>
            <View style={styles.savingsHeader}>
              <Text style={styles.savingsTitle}>💰 MON ÉPARGNE</Text>
              <TouchableOpacity style={styles.settingsBtn}>
                <Text>⚙️</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.savingsAmount}>
              <Text style={styles.amountValue}>
                {balance ? balance.toLocaleString("fr-FR") : "0"}
              </Text>
              <Text style={styles.amountSubtitle}>FCFA épargnés</Text>
            </View>

            <View style={styles.progressSection}>
              <View style={{ width: radius * 2 + 20, height: radius * 2 + 20 }}>
                <Svg height="100%" width="100%" viewBox="0 0 120 120">
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={localColors.border}
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <Circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={localColors.primary}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </Svg>
                <View style={styles.progressCenter}>
                  <Text style={styles.progressPercentage}>
                    {Math.round(progress)}%
                  </Text>
                </View>
              </View>
              <Text style={styles.progressText}>
                Objectif : {savingsConfig?.goal?.name || "Nouveau téléphone"}
              </Text>
              <Text style={styles.progressTarget}>
                {goalTarget.toLocaleString("fr-FR")} FCFA
              </Text>
            </View>

            <View style={styles.savingsDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📅 Jours d&apos;épargne</Text>
                <Text style={styles.detailValue}>
                  {savingsConfig?.streak || 0} jours
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>💵 Épargne quotidienne</Text>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.detailValue}>
                    {savingsConfig?.dailyAmount
                      ? `${savingsConfig.dailyAmount.toLocaleString(
                          "fr-FR"
                        )} FCFA`
                      : "N/A"}
                  </Text>
                  <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.modifyBtn}>Modifier</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>🎯 Prochain palier</Text>
                {nextMilestone ? (
                  <Text style={styles.detailValue}>
                    {nextMilestone.value.toLocaleString("fr-FR")} FCFA (
                    {nextMilestone.label})
                  </Text>
                ) : (
                  <Text style={styles.detailValue}>Objectif atteint !</Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.autoSaveSection}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Épargne automatique</Text>
              <Text style={styles.toggleSubtitle}>
                Prélèvement quotidien à{" "}
                {convertUTCToLocalTime(savingsConfig?.deductionTime) || "20:00"}
              </Text>
            </View>
            <Switch
              value={savingsConfig?.active || false}
              onValueChange={toggleSavings}
              trackColor={{
                false: localColors.border,
                true: localColors.lightGreen,
              }}
              thumbColor={localColors.primary}
            />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => navigation.navigate("ManualSavings")}
            >
              <Text style={{ color: "white" }}>💰 Épargner maintenant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSecondary}
              onPress={() => navigation.navigate("History")}
            >
              <Text style={{ color: localColors.primary }}>
                📊 Voir historique
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentActivity}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Activité récente</Text>
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <Text style={{ color: localColors.primary }}>Tout voir</Text>
              </TouchableOpacity>
            </View>
            {transactions?.slice(0, 3).map((item) => (
              <View key={item._id} style={styles.activityItem}>
                <Text>
                  {item.status === "completed" ? "✅" : "❌"} {item.type}: +
                  {item.amount.toLocaleString("fr-FR")}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <CustomAmountModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleSaveSpeed}
          modalTitle="Modifier l'épargne quotidienne"
          inputPlaceholder="Nouveau montant par jour"
          initialValue={savingsConfig?.dailyAmount?.toString() || ""}
          goalInfo={
            savingsConfig?.goal
              ? {
                  name: savingsConfig.goal.name,
                  amount: savingsConfig.goal.amount,
                  onEdit: () => {
                    setIsModalVisible(false);
                    navigation.navigate("GoalSelection", {
                      source: "dashboard",
                    });
                  },
                }
              : null
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: localColors.background,
  },
  container: {
    paddingBottom: 40,
  },
  headerSection: {
    padding: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  greetingTime: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
    marginBottom: 16,
  },
  mainContent: {
    padding: 16,
    marginTop: -40,
  },
  savingsCard: {
    backgroundColor: localColors.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 24,
  },
  savingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  savingsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: localColors.textPrimary,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    backgroundColor: localColors.lightGreen,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  savingsAmount: {
    alignItems: "center",
    marginBottom: 24,
  },
  amountValue: {
    fontSize: 42,
    fontWeight: "800",
    color: localColors.primary,
  },
  amountSubtitle: {
    fontSize: 14,
    color: localColors.textSecondary,
  },
  progressSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  progressCenter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: "700",
    color: localColors.primary,
  },
  progressText: {
    marginTop: 16,
    fontSize: 14,
    color: localColors.textSecondary,
  },
  progressTarget: {
    fontSize: 16,
    fontWeight: "600",
    color: localColors.textPrimary,
  },
  autoSaveSection: {
    backgroundColor: localColors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: localColors.border,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: localColors.textPrimary,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: localColors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  btnPrimary: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: localColors.primary,
  },
  btnSecondary: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: localColors.primary,
  },
  recentActivity: {
    backgroundColor: localColors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: localColors.border,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: localColors.textPrimary,
  },
  activityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: localColors.border,
  },
  savingsDetails: {
    backgroundColor: localColors.lightGreen,
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  detailLabel: {
    fontSize: 14,
    color: localColors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: localColors.textPrimary,
  },
  modifyBtn: {
    color: localColors.primary,
    fontSize: 12,
    fontWeight: "700",
    textDecorationLine: "underline",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "white",
    opacity: 0.9,
  },
});

export default DashboardScreen;

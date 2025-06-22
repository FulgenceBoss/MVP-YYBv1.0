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
  ActivityIndicator,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardData,
  fetchTransactions,
  trackAnalyticsEvent,
} from "../store/slices/dashboardSlice";
import { logout } from "../store/slices/authSlice";
import {
  fetchSavingsConfig,
  updateSavingsConfig,
} from "../store/slices/savingsConfigSlice";
import CustomAmountModal from "../components/CustomAmountModal";
import { Ionicons } from "@expo/vector-icons";
import { registerForPushNotificationsAsync } from "../services/notificationService";

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
  const { user, userToken } = useSelector((state) => state.auth);
  const {
    balance,
    transactions,
    status: balanceStatus,
  } = useSelector((state) => state.dashboard);
  const { config: savingsConfig, status: configStatus } = useSelector(
    (state) => state.savingsConfig
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localSwitchState, setLocalSwitchState] = useState(
    savingsConfig?.active || false
  );
  const dashboardData = useSelector((state) => state.dashboard);

  useEffect(() => {
    setLocalSwitchState(savingsConfig?.active || false);
  }, [savingsConfig?.active]);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchTransactions());
    dispatch(fetchSavingsConfig());
  }, [dispatch]);

  // Handle Push Notification registration
  useEffect(() => {
    if (userToken) {
      registerForPushNotificationsAsync();
    }
  }, [userToken]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchTransactions());
    dispatch(fetchSavingsConfig());
  }, [dispatch]);

  const toggleSavings = (value) => {
    // Optimistic UI update
    setLocalSwitchState(value);

    dispatch(updateSavingsConfig({ active: value }))
      .unwrap()
      .then(() => {
        const eventName = value ? "savings_toggled_on" : "savings_toggled_off";
        dispatch(trackAnalyticsEvent({ eventName }));
      })
      .catch(() => {
        Alert.alert("Erreur", "Impossible de mettre à jour la configuration.");
        // Revert UI on failure
        setLocalSwitchState(!value);
      });
  };

  const handleSaveSpeed = (newSpeed) => {
    dispatch(updateSavingsConfig({ dailyAmount: newSpeed }));
    setIsModalVisible(false);
  };

  const goal = savingsConfig?.goal;
  const goalTarget = goal?.amount || 200000;
  const progress = balance && goalTarget ? (balance / goalTarget) * 100 : 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  // Render a loading indicator if essential data is not yet available
  if (configStatus === "loading" || balanceStatus === "loading" || !user) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={localColors.primary} />
      </View>
    );
  }

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
          colors={["#2E7D32", "#4CAF50"]}
          style={styles.headerSection}
        >
          <View style={styles.headerTopRow}>
            <Text style={styles.greeting}>
              Bonjour, {user?.fullName || "Utilisateur"}
            </Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Text style={styles.settingsIcon}>⚙️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => dispatch(logout())}
                style={styles.logoutButton}
              >
                <Text style={styles.logoutText}>Déco</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          <View style={[styles.card, styles.balanceCard]}>
            <Text style={styles.cardTitle}>Ma cagnotte actuelle</Text>
            <Text style={styles.balanceValue}>
              {balance ? balance.toLocaleString("fr-FR") : "0"} FCFA
            </Text>
          </View>

          {goal && (
            <View style={[styles.card, styles.goalCard]}>
              <Text style={styles.cardTitle}>Mon objectif en cours</Text>
              <View style={styles.progressContainer}>
                <Svg
                  height={radius * 2 + 20}
                  width={radius * 2 + 20}
                  viewBox="0 0 140 140"
                >
                  <Circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={localColors.border}
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <Circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={localColors.primary}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                  />
                </Svg>
                <View style={styles.progressCenter}>
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                  <Text style={styles.progressPercentage}>
                    {Math.round(progress)}%
                  </Text>
                </View>
              </View>
              <Text style={styles.goalProgressText}>
                Vous avez fait {Math.round(progress)}% du chemin pour votre{" "}
                <Text style={{ fontWeight: "bold" }}>{goal.name}</Text> !
              </Text>
            </View>
          )}

          <View style={styles.pillsContainer}>
            {/* <View style={styles.pill}>
              <Text style={styles.pillText}>
                🔥 {savingsConfig?.streak || 0} Jours d&apos;affilée
              </Text>
            </View> */}
            <View style={styles.pill}>
              <Text style={styles.pillText}>
                💸{" "}
                {savingsConfig?.dailyAmount?.toLocaleString("fr-FR") || "N/A"} /
                jour
              </Text>
            </View>
          </View>

          <View style={[styles.card, styles.controlCenter]}>
            <Text style={styles.cardTitle}>Centre de contrôle</Text>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Épargne automatique</Text>
              <Switch
                value={localSwitchState}
                onValueChange={toggleSavings}
                trackColor={{
                  false: localColors.border,
                  true: localColors.lightGreen,
                }}
                thumbColor={localColors.primary}
                style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
              />
            </View>
            <TouchableOpacity
              style={styles.mainActionButton}
              onPress={() => navigation.navigate("ManualSavings")}
            >
              <Text style={styles.mainActionButtonText}>
                💰 Épargner maintenant
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryActionButton}
              onPress={() => navigation.navigate("History")}
            >
              <Text style={styles.secondaryActionButtonText}>
                📊 Voir l&apos;historique
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryActionButton}
              onPress={() => setIsModalVisible(true)}
            >
              <Text style={styles.secondaryActionButtonText}>
                ⚙️ Modifier mon rythme
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          <View style={[styles.card, styles.recentActivity]}>
            <View style={styles.activityHeader}>
              <Text style={styles.cardTitle}>Activité Récente</Text>
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <Text style={styles.seeAllText}>Tout voir</Text>
              </TouchableOpacity>
            </View>
            {transactions?.slice(0, 3).map((item) => (
              <View key={item._id} style={styles.activityItem}>
                <Text style={styles.activityEmoji}>
                  {item.status === "completed" ? "✅" : "❌"}
                </Text>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityType}>
                    {item.type === "auto" ? "Épargne auto" : "Épargne manuelle"}
                  </Text>
                  <Text style={styles.activityDate}>
                    {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                  </Text>
                </View>
                <Text style={styles.activityAmount}>
                  +{item.amount.toLocaleString("fr-FR")} FCFA
                </Text>
              </View>
            ))}
            {transactions?.length === 0 && (
              <Text style={styles.noActivityText}>
                Aucune transaction pour le moment.
              </Text>
            )}
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
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingsIcon: {
    fontSize: 24,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  mainContent: {
    padding: 16,
    marginTop: -20,
  },
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: localColors.textPrimary,
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: "#2E7D32",
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: "800",
    color: "white",
  },
  goalCard: {
    // Add appropriate styles for the goal card
  },
  progressContainer: {
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
  goalIcon: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  goalProgressText: {
    marginTop: 16,
    fontSize: 14,
    color: "white",
  },
  pillsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  pill: {
    backgroundColor: localColors.lightGreen,
    borderRadius: 12,
    padding: 12,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    color: localColors.textPrimary,
  },
  controlCenter: {
    // Add appropriate styles for the control center card
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 14,
    color: localColors.textSecondary,
  },
  mainActionButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: localColors.primary,
    marginBottom: 12,
  },
  mainActionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryActionButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: localColors.primary,
    marginBottom: 12,
  },
  secondaryActionButtonText: {
    color: localColors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  recentActivity: {
    // Styles for the recent activity card
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  seeAllText: {
    color: localColors.primary,
    fontWeight: "600",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: localColors.border,
  },
  activityEmoji: {
    fontSize: 16,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontWeight: "600",
    color: localColors.textPrimary,
  },
  activityDate: {
    fontSize: 12,
    color: localColors.textSecondary,
  },
  activityAmount: {
    fontWeight: "bold",
    color: localColors.primary,
  },
  noActivityText: {
    textAlign: "center",
    color: localColors.textSecondary,
    paddingVertical: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: localColors.background,
  },
});

export default DashboardScreen;

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
  StatusBar,
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
  background: "#f8f9fa",
};

const radius = 60;

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
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Bonjour, {user?.fullName || "Utilisateur"}
        </Text>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.headerIconText}>⚙️</Text>
        </TouchableOpacity>
      </View>
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
          colors={["#388E3C", "#2E7D32"]}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceTitle}>Ma cagnotte actuelle</Text>
          <Text style={styles.balanceValue}>
            {balance ? balance.toLocaleString("fr-FR") : "0"} FCFA
          </Text>
        </LinearGradient>

        {goal && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mon objectif en cours</Text>
            <Text style={styles.goalTargetText}>
              Objectif : {goal.amount.toLocaleString("fr-FR")} FCFA
            </Text>
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
                <Text style={styles.goalIcon}>{goal.icon || "🎯"}</Text>
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

        <View style={[styles.card, styles.controlCenter]}>
          <Text style={styles.cardTitle}>Centre de contrôle</Text>
          {savingsConfig?.dailyAmount && (
            <View style={styles.dailyAmountContainer}>
              <Text style={styles.controlLabel}>Épargne quotidienne</Text>
              <Text style={styles.dailyAmountText}>
                {savingsConfig.dailyAmount.toLocaleString("fr-FR")} FCFA
              </Text>
            </View>
          )}
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
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.secondaryActionButtonText}>
              ⚙️ Modifier mon rythme
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
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

        <TouchableOpacity
          onPress={() => dispatch(logout())}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: localColors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: localColors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: localColors.textPrimary,
  },
  headerIcon: {
    padding: 8,
  },
  headerIconText: {
    fontSize: 24,
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
  },
  card: {
    backgroundColor: localColors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: localColors.textPrimary,
    marginBottom: 16,
  },
  goalTargetText: {
    fontSize: 14,
    fontWeight: "500",
    color: localColors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    height: radius * 2 + 20,
  },
  progressCenter: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  goalIcon: {
    fontSize: 28,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: "700",
    color: localColors.textPrimary,
    marginTop: 4,
  },
  goalProgressText: {
    textAlign: "center",
    fontSize: 14,
    color: localColors.textSecondary,
    lineHeight: 20,
  },
  controlCenter: {
    // specific styles for control center if needed
  },
  dailyAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: localColors.border,
    marginBottom: 12,
  },
  dailyAmountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: localColors.textPrimary,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: localColors.textPrimary,
  },
  mainActionButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: localColors.primary,
    marginBottom: 12,
  },
  mainActionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryActionButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: localColors.lightGreen,
  },
  secondaryActionButtonText: {
    color: localColors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAllText: {
    color: localColors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: localColors.border,
  },
  activityEmoji: {
    fontSize: 18,
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontWeight: "600",
    color: localColors.textPrimary,
    fontSize: 15,
  },
  activityDate: {
    fontSize: 13,
    color: localColors.textSecondary,
    marginTop: 2,
  },
  activityAmount: {
    fontWeight: "bold",
    color: localColors.textPrimary,
    fontSize: 15,
  },
  noActivityText: {
    textAlign: "center",
    color: localColors.textSecondary,
    paddingVertical: 20,
  },
  logoutButton: {
    marginTop: 20,
    padding: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#f44336",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default DashboardScreen;

import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Switch,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, FONTS, SIZES } from "../constants/theme";
import {
  fetchDashboardData,
  fetchTransactions,
} from "../store/slices/dashboardSlice";
import {
  fetchSavingsConfig,
  updateSavingsConfig,
  resetConfig,
} from "../store/slices/savingsConfigSlice";
import { logout } from "../store/slices/authSlice";
import Svg, { Circle } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedCircle = ({ progress }) => {
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <View style={styles.progressContainer}>
      <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
        <Circle
          stroke={COLORS.border}
          fill="none"
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={COLORS.primary}
          fill="none"
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius + strokeWidth / 2} ${
            radius + strokeWidth / 2
          })`}
        />
      </Svg>
      <View style={styles.progressCenter}>
        <Text style={styles.progressPercentage}>{`${Math.round(
          progress
        )}%`}</Text>
      </View>
    </View>
  );
};

const TransactionHistory = ({
  balance,
  transactions,
  savingsActive,
  onToggleSavings,
  lastUpdated,
  error,
  navigation,
  streakCount = 5,
}) => {
  const dispatch = useDispatch();
  const { config, status: configStatus } = useSelector(
    (state) => state.savingsConfig
  );
  const [isSavingActive, setIsSavingActive] = useState(savingsActive);

  // Get user from auth state to display name
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchSavingsConfig());
  }, [dispatch]);

  useEffect(() => {
    if (config) {
      setIsSavingActive(config.active);
    }
  }, [config]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchTransactions());
    dispatch(fetchSavingsConfig());
  }, [dispatch]);

  const toggleSavings = (value) => {
    if (configStatus === "loading") return;
    setIsSavingActive(value); // Optimistic update
    dispatch(updateSavingsConfig({ active: value }))
      .unwrap()
      .catch(() => {
        // Revert on failure
        setIsSavingActive(!value);
        Alert.alert("Erreur", "Impossible de mettre à jour la configuration.");
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View
        style={[
          styles.activityIcon,
          item.status === "completed"
            ? styles.activityIconSuccess
            : styles.activityIconPending,
        ]}
      >
        <Text>{item.type === "auto" ? "⚙️" : "💰"}</Text>
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityDescription}>
          {item.type === "auto" ? "Épargne automatique" : "Épargne manuelle"}
        </Text>
        <Text style={styles.activityTime}>
          {new Date(item.createdAt).toLocaleDateString("fr-FR")}
        </Text>
      </View>
      <Text style={styles.activityAmount}>
        {item.amount.toLocaleString("fr-FR")} F
      </Text>
    </View>
  );

  const ListHeader = () => {
    const goalTarget = 200000;
    const progress = balance && goalTarget ? (balance / goalTarget) * 100 : 0;

    return (
      <>
        <LinearGradient
          colors={[COLORS.primary, COLORS.success]}
          style={styles.headerSection}
        >
          <View style={styles.headerTop}>
            <Text style={styles.greeting}>
              Bonjour {user?.firstName || "!"}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          <View style={styles.savingsCard}>
            <View style={styles.savingsHeader}>
              <Text style={styles.savingsTitle}>💰 MON ÉPARGNE</Text>
              <TouchableOpacity>
                <Text style={styles.settingsBtn}>⚙️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.amountValueContainer}>
              <Text style={styles.amountValue}>
                {balance ? `${balance.toLocaleString("fr-FR")}` : "0"}
              </Text>
              <Text style={styles.amountSubtitle}>FCFA épargnés</Text>
            </View>

            <View style={styles.progressSection}>
              <AnimatedCircle progress={progress} />
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                  Objectif: Nouveau téléphone
                </Text>
                <Text style={styles.progressTarget}>
                  {goalTarget.toLocaleString("fr-FR")} FCFA
                </Text>
              </View>
            </View>
          </View>

          {/* Combined Details and Toggle Card */}
          <View style={styles.detailsAndToggleCard}>
            {/* Savings Details */}
            <View style={styles.savingsDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>📅 Jours d&apos;épargne</Text>
                <Text style={styles.detailValue}>15 jours</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>💵 Épargne quotidienne</Text>
                <Text style={styles.detailValue}>1,000 FCFA</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>🎯 Prochain palier</Text>
                <Text style={styles.detailValue}>150,000 FCFA</Text>
              </View>
            </View>

            <View style={styles.toggleContainer}>
              <View style={styles.toggleInfoContainer}>
                <Text style={styles.toggleTitle}>Épargne automatique</Text>
                <Text style={styles.toggleSubtitle}>
                  Prélèvement quotidien à 20:00
                </Text>
              </View>
              <Switch
                trackColor={{ false: COLORS.border, true: COLORS.lightGreen }}
                thumbColor={isSavingActive ? COLORS.primary : COLORS.surface}
                onValueChange={toggleSavings}
                value={isSavingActive}
              />
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionBtnPrimary}
              onPress={() => navigation.navigate("ManualSavings")}
            >
              <Text style={styles.actionBtnText}>💰 Épargner maintenant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtnSecondary}
              onPress={() => navigation.navigate("History")}
            >
              <Text style={styles.actionBtnSecondaryText}>
                📊 Voir historique
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityHeader}>
            <Text style={styles.listHeaderTitle}>Activité Récente</Text>
            <TouchableOpacity onPress={() => navigation.navigate("History")}>
              <Text style={styles.viewAllBtn}>Tout voir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  const ListFooter = () => (
    <TouchableOpacity
      style={styles.logoutButtonContainer}
      onPress={() => {
        dispatch(logout());
        dispatch(resetConfig());
      }}
    >
      <Text style={styles.logoutButton}>Déconnexion</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={
        !transactions?.length ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Aucune transaction pour le moment.
            </Text>
          </View>
        ) : null
      }
      contentContainerStyle={styles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={configStatus === "loading"}
          onRefresh={handleRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingHorizontal: SIZES.padding,
    marginTop: -SIZES.padding * 5,
  },
  headerSection: {
    paddingHorizontal: SIZES.padding * 2,
    paddingTop: SIZES.padding * 5,
    paddingBottom: SIZES.padding * 7,
    borderBottomLeftRadius: SIZES.radius_xl,
    borderBottomRightRadius: SIZES.radius_xl,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { ...FONTS.h1, color: COLORS.surface },
  logoutButton: { ...FONTS.body4, color: COLORS.primary, fontWeight: "600" },
  logoutButtonContainer: {
    alignItems: "center",
    marginTop: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
  },
  greetingTime: {
    ...FONTS.body4,
    color: COLORS.surface,
    opacity: 0.8,
    marginTop: SIZES.base,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SIZES.padding * 2,
  },
  statItem: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    minWidth: 80,
  },
  statValue: { ...FONTS.h3, color: COLORS.surface },
  statLabel: { ...FONTS.caption, color: COLORS.surface, opacity: 0.9 },
  savingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius_xl,
    padding: SIZES.padding * 2,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: SIZES.padding,
  },
  savingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.padding,
  },
  settingsBtn: {
    fontSize: 24,
  },
  savingsTitle: { ...FONTS.h4, color: COLORS.textPrimary, fontWeight: "bold" },
  amountValueContainer: {
    alignItems: "center",
    marginVertical: SIZES.padding,
  },
  amountValue: {
    fontSize: 42,
    fontWeight: "800",
    color: COLORS.primary,
  },
  amountSubtitle: { ...FONTS.body4, color: COLORS.textSecondary },
  progressSection: { alignItems: "center", marginVertical: SIZES.padding },
  progressContainer: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  progressCenter: {
    position: "absolute",
  },
  progressPercentage: { ...FONTS.h3, color: COLORS.primary },
  progressInfo: { alignItems: "center", marginTop: SIZES.base },
  progressText: { ...FONTS.body4, color: COLORS.textSecondary },
  progressTarget: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    fontWeight: "600",
  },
  savingsDetails: {
    marginBottom: SIZES.padding,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  detailLabel: {
    ...FONTS.body4,
    color: COLORS.textSecondary,
  },
  detailValue: {
    ...FONTS.body4,
    fontWeight: "bold",
    color: COLORS.textPrimary,
  },
  detailsAndToggleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius_xl,
    padding: SIZES.padding * 2,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginBottom: SIZES.padding,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SIZES.padding,
    paddingTop: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  toggleInfoContainer: {
    flex: 1,
  },
  toggleTitle: { ...FONTS.body3, fontWeight: "600", color: COLORS.textPrimary },
  toggleSubtitle: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: SIZES.padding,
    paddingHorizontal: SIZES.padding,
    marginTop: SIZES.padding,
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius_lg,
    paddingVertical: SIZES.padding,
    alignItems: "center",
  },
  actionBtnText: { ...FONTS.h4, color: COLORS.surface, fontWeight: "bold" },
  actionBtnSecondary: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius_lg,
    paddingVertical: SIZES.padding,
    alignItems: "center",
  },
  actionBtnSecondaryText: {
    ...FONTS.h4,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.padding,
    marginTop: SIZES.padding,
  },
  listHeaderTitle: { ...FONTS.h3, color: COLORS.textPrimary },
  viewAllBtn: { ...FONTS.body4, color: COLORS.primary, fontWeight: "600" },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.base,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.padding,
  },
  activityIconSuccess: { backgroundColor: COLORS.lightGreen },
  activityIconPending: { backgroundColor: COLORS.lightBlue },
  activityInfo: { flex: 1 },
  activityDescription: { ...FONTS.body4, fontWeight: "600" },
  activityTime: { ...FONTS.caption, color: COLORS.textSecondary },
  activityAmount: { ...FONTS.body3, fontWeight: "bold" },
  emptyContainer: {
    marginTop: SIZES.padding * 2,
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.textSecondary,
    ...FONTS.body3,
  },
});

export default TransactionHistory;

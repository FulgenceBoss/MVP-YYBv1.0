import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../store/slices/dashboardSlice";
import { fetchSavingsConfig } from "../store/slices/savingsConfigSlice";
import { OPERATORS } from "../constants/data";
// Les imports de theme (COLORS, FONTS, SIZES) sont inutilisés car les styles sont définis localement.

// Mock Data - Nous allons le remplacer par les données du store
// const MOCK_TRANSACTIONS = { ... };

const TransactionItem = ({ item, operatorConfig }) => {
  const getIcon = () => {
    // Adapter cette logique si le format de l'API est différent
    if (item.type === "auto-pause") return "⏸️";
    if (item.status === "completed") return "✅";
    if (item.status === "failed") return "❌";
    return "⚙️";
  };

  const getAmountColor = () => {
    if (item.status === "completed") return styles.amountPositive;
    if (item.status === "failed") return styles.amountNegative;
    return styles.amountNeutral;
  };

  const getIconStyle = () => {
    switch (item.status) {
      case "completed":
        return styles.iconSuccess;
      case "failed":
        return styles.iconError;
      default:
        return styles.iconPaused; // Pour 'pending' ou 'paused'
    }
  };

  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={[styles.transactionIcon, getIconStyle()]}>
        <Text>{getIcon()}</Text>
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>
          {item.type === "manual" ? "Épargne manuelle" : "Épargne automatique"}
        </Text>
        <Text style={styles.transactionTime}>
          {new Date(item.createdAt).toLocaleString("fr-FR")}
        </Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text style={[styles.amountValue, getAmountColor()]}>
          {item.status === "completed"
            ? `+${item.amount.toLocaleString("fr-FR")}`
            : "Échec"}
        </Text>
        <Text style={styles.transactionStatus}>
          {item.status === "completed" ? "Réussie" : "Échoué"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const HistoryScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const dispatch = useDispatch();

  const { transactions, transactionsStatus, transactionsError } = useSelector(
    (state) => state.dashboard
  );

  const { config: savingsConfig } = useSelector((state) => state.savingsConfig);
  const operatorConfig =
    OPERATORS[savingsConfig?.operator] || OPERATORS.Default;

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchSavingsConfig());
  }, [dispatch]);

  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    if (activeFilter === "all") {
      return transactions;
    }

    const validTimestamps = transactions
      .map((tx) => new Date(tx.createdAt).getTime())
      .filter((ts) => !isNaN(ts));

    if (validTimestamps.length === 0) {
      return transactions;
    }

    const referenceTimestamp = Math.max(...validTimestamps);
    const referenceDate = new Date(referenceTimestamp);
    referenceDate.setUTCHours(23, 59, 59, 999);

    const filterDate = new Date(referenceTimestamp);
    filterDate.setUTCHours(0, 0, 0, 0);

    if (activeFilter === "7") {
      filterDate.setUTCDate(filterDate.getUTCDate() - 6);
    } else if (activeFilter === "30") {
      filterDate.setUTCDate(filterDate.getUTCDate() - 29);
    }

    return transactions.filter((tx) => {
      const txDate = new Date(tx.createdAt);
      if (isNaN(txDate.getTime())) {
        return false;
      }
      return txDate >= filterDate && txDate <= referenceDate;
    });
  }, [transactions, activeFilter]);

  const summary = useMemo(() => {
    const completedTransactions = filteredTransactions.filter(
      (tx) => tx.status === "completed"
    );
    const total = completedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    return {
      total: total,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const groupedTransactions = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => {
      const date = new Date(tx.createdAt).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(tx);
      return acc;
    }, {});
  }, [filteredTransactions]);

  const renderTransactions = () => {
    if (transactionsStatus === "loading") {
      return (
        <ActivityIndicator
          size="large"
          color={localColors.primary}
          style={{ marginTop: 50 }}
        />
      );
    }

    if (transactionsStatus === "failed") {
      return (
        <Text style={styles.errorText}>
          Erreur de chargement: {transactionsError}
        </Text>
      );
    }

    if (filteredTransactions.length === 0) {
      return (
        <Text style={styles.emptyText}>
          Aucune transaction pour cette période.
        </Text>
      );
    }

    return Object.keys(groupedTransactions).map((date) => (
      <View key={date} style={styles.dateGroup}>
        <Text style={styles.dateHeader}>{date}</Text>
        {groupedTransactions[date].map((item) => (
          <TransactionItem
            key={item._id}
            item={item}
            operatorConfig={operatorConfig}
          />
        ))}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Mon Historique</Text>
        <TouchableOpacity style={styles.downloadBtn}>
          <Text style={styles.downloadBtnText}>📄 Relevé</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "7" && styles.activeTab,
              ]}
              onPress={() => setActiveFilter("7")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === "7" && styles.activeTabText,
                ]}
              >
                7 jours
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "30" && styles.activeTab,
              ]}
              onPress={() => setActiveFilter("30")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === "30" && styles.activeTabText,
                ]}
              >
                30 jours
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilter === "all" && styles.activeTab,
              ]}
              onPress={() => setActiveFilter("all")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === "all" && styles.activeTabText,
                ]}
              >
                Tout
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <View style={styles.summaryMain}>
            <View>
              <Text style={styles.totalLabel}>Total épargné</Text>
              <Text style={styles.totalAmount}>
                {summary.total.toLocaleString("fr-FR")} FCFA
              </Text>
            </View>
            <View>
              <Text style={styles.statLabel}>Transactions</Text>
              <Text style={styles.statValue}>{summary.count}</Text>
            </View>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsSection}>{renderTransactions()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLES ---
// S'inspirant de la maquette, avec des adaptations pour React Native

const localColors = {
  primary: "#2e7d32",
  lightGreen: "#e8f5e8",
  surface: "#ffffff",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#e0e0e0",
  background: "#fafafa",
  error: "#f44336",
  lightRed: "#ffebee",
  warning: "#ff9800",
  lightOrange: "#fff3e0",
  success: "#4caf50",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: localColors.surface,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: localColors.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: localColors.primary,
    fontWeight: "bold",
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: localColors.textPrimary,
  },
  downloadBtn: {
    backgroundColor: localColors.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: localColors.primary,
  },
  downloadBtnText: {
    color: localColors.primary,
    fontWeight: "600",
    fontSize: 12,
  },
  scrollView: {
    backgroundColor: localColors.background,
  },
  filterSection: {
    padding: 16,
    backgroundColor: localColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: localColors.border,
  },
  filterTabs: {
    flexDirection: "row",
    backgroundColor: localColors.background,
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: localColors.primary,
  },
  filterTabText: {
    color: localColors.textSecondary,
    fontWeight: "600",
  },
  activeTabText: {
    color: localColors.surface,
  },
  summarySection: {
    backgroundColor: localColors.lightGreen,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: localColors.border,
  },
  summaryMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: localColors.textSecondary,
    fontSize: 14,
  },
  totalAmount: {
    color: localColors.primary,
    fontSize: 28,
    fontWeight: "800",
  },
  statLabel: {
    color: localColors.textSecondary,
    fontSize: 12,
    textAlign: "right",
  },
  statValue: {
    color: localColors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },
  transactionsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: localColors.textPrimary,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: localColors.border,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: localColors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: localColors.border,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  iconSuccess: {
    backgroundColor: localColors.lightGreen,
  },
  iconError: {
    backgroundColor: localColors.lightRed,
  },
  iconPaused: {
    backgroundColor: localColors.lightOrange,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: localColors.textPrimary,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: localColors.textSecondary,
  },
  transactionAmountContainer: {
    alignItems: "flex-end",
  },
  amountValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  amountPositive: {
    color: localColors.success,
  },
  amountNegative: {
    color: localColors.error,
  },
  amountNeutral: {
    color: localColors.textSecondary,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
    color: localColors.textSecondary,
  },
  errorText: {
    color: localColors.error,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 50,
  },
  emptyText: {
    color: localColors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 50,
  },
  logo: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  logoText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default HistoryScreen;

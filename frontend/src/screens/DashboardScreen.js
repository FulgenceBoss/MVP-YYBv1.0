import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardData,
  fetchTransactions,
} from "../store/slices/dashboardSlice";
import { logout } from "../store/slices/authSlice";
import { resetConfig } from "../store/slices/savingsConfigSlice";
import TransactionHistory from "../components/TransactionHistory";
import { COLORS } from "../constants/theme";

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const {
    balance,
    transactions,
    status,
    error,
    transactionsStatus,
    transactionsError,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // We can dispatch both actions, they will be handled by the slice
    dispatch(fetchDashboardData());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetConfig());
  };

  // We pass all relevant data and status down to the display component
  return (
    <View style={styles.container}>
      <TransactionHistory
        balance={balance}
        transactions={transactions}
        status={status} // Overall status for balance and header
        error={error} // Overall error
      />
      {/* Temporary Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Déconnexion (Provisoire)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DashboardScreen;

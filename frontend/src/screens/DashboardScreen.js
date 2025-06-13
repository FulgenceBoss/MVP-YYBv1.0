import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../store/slices/dashboardSlice";
import StreakCounter from "../components/StreakCounter";

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const { balance, status, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableau de Bord</Text>
      {status === "loading" && <Text>Chargement...</Text>}
      {error && <Text style={styles.errorText}>Erreur: {error}</Text>}
      {status === "succeeded" && (
        <>
          <Text style={styles.balanceText}>Solde: {balance} FCFA</Text>
          <StreakCounter streakCount={5} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  balanceText: {
    fontSize: 22,
    color: "#004d40",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
  },
});

export default DashboardScreen;

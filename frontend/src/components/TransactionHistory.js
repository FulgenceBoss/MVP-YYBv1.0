import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import StreakCounter from "./StreakCounter";

const TransactionHistory = ({
  balance,
  transactions,
  status,
  error,
  streakCount = 5,
}) => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.amount}>
          {item.amount.toLocaleString("fr-FR")} F CFA
        </Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
      <Text
        style={[
          styles.status,
          item.status === "completed" ? styles.completed : styles.failed,
        ]}
      >
        {item.status === "completed" ? "Succès" : "Échec"}
      </Text>
    </View>
  );

  const ListHeader = () => (
    <>
      <Text style={styles.title}>Tableau de Bord</Text>
      {status === "loading" && !balance && (
        <ActivityIndicator size="large" color={Colors.primary} />
      )}
      {error && <Text style={styles.errorText}>Erreur: {error}</Text>}
      {status === "succeeded" && (
        <>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Solde Actuel</Text>
            <Text style={styles.balanceText}>
              {balance.toLocaleString("fr-FR")} FCFA
            </Text>
          </View>
          <StreakCounter streakCount={streakCount} />
        </>
      )}
      <Text style={styles.listHeaderTitle}>Historique des Transactions</Text>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          status === "succeeded" ? (
            <Text style={styles.emptyText}>
              Aucune transaction pour le moment.
            </Text>
          ) : null
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.Bold,
    color: Colors.dark,
    marginBottom: 20,
  },
  balanceContainer: {
    backgroundColor: Colors.primary,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: Fonts.Regular,
    color: "white",
    marginBottom: 5,
  },
  balanceText: {
    fontSize: 32,
    fontFamily: Fonts.Bold,
    color: "white",
  },
  listHeaderTitle: {
    fontSize: 20,
    fontFamily: Fonts.Bold,
    color: Colors.dark,
    marginTop: 20,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  amount: {
    fontSize: 16,
    fontFamily: Fonts.Medium,
    color: Colors.dark,
  },
  date: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.gray,
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    overflow: "hidden",
  },
  completed: {
    backgroundColor: "rgba(40, 167, 69, 0.1)",
    color: Colors.success,
  },
  failed: {
    backgroundColor: "rgba(220, 53, 69, 0.1)",
    color: Colors.danger,
  },
  errorText: {
    textAlign: "center",
    color: Colors.danger,
    marginVertical: 20,
    fontFamily: Fonts.Regular,
  },
  emptyText: {
    textAlign: "center",
    color: Colors.gray,
    marginTop: 20,
    fontFamily: Fonts.Regular,
  },
});

export default TransactionHistory;

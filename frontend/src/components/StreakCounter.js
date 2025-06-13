import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StreakCounter = ({ streakCount }) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="fire" size={28} color="#FF7043" />
      <Text style={styles.text}>{streakCount} jours de suite !</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFD180",
    marginTop: 20,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF7043",
  },
});

export default StreakCounter;

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { LottieAnimation } from "../../components/LottieAnimation"; // Assuming Lottie is in components

const ConfirmationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LottieAnimation
        source={require("../../../assets/animations/success.json")}
        speed={1}
        loop={false}
      />
      <Text style={styles.title}>C&apos;est parti !</Text>
      <Text style={styles.subtitle}>
        Votre plan d&apos;épargne est activé. Votre premier prélèvement aura
        lieu ce soir. Vous êtes sur la bonne voie !
      </Text>
      <TouchableOpacity
        style={styles.cta}
        onPress={() => navigation.replace("Dashboard")}
      >
        <Text style={styles.ctaText}>Aller au tableau de bord</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#212121",
    textAlign: "center",
    marginVertical: 16,
  },
  cta: {
    backgroundColor: "#2E7D32",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 32,
  },
  ctaText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ConfirmationScreen;

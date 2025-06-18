import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import LottieView from "lottie-react-native";

const localColors = {
  primary: "#2e7d32",
  success: "#4caf50",
  error: "#f44336",
  surface: "#ffffff",
  textPrimary: "#212121",
  textSecondary: "#757575",
  background: "#fafafa",
};

const animations = {
  processing: require("../../../assets/animations/loading.json"),
  success: require("../../../assets/animations/success.json"),
  error: require("../../../assets/animations/error.json"),
};

const TransactionStatusScreen = ({ route, navigation }) => {
  const { status, message, title } = route.params; // status can be 'processing', 'success', 'error'
  const animationRef = useRef(null);

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case "success":
        return {
          title: title || "Opération réussie !",
          animation: animations.success,
          color: localColors.success,
        };
      case "error":
        return {
          title: title || "Oups, une erreur...",
          animation: animations.error,
          color: localColors.error,
        };
      default: // 'processing'
        return {
          title: title || "Traitement en cours...",
          animation: animations.loading,
          color: localColors.primary,
        };
    }
  };

  const { title: statusTitle, animation, color } = getStatusInfo();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: color }]}>
      <View style={styles.container}>
        <LottieView
          ref={animationRef}
          source={animation}
          autoPlay
          loop={status === "processing"}
          style={styles.lottie}
        />
        <Text style={styles.title}>{statusTitle}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      {(status === "success" || status === "error") && (
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Text style={styles.ctaText}>Retourner à l&apos;accueil</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  lottie: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  ctaButton: {
    marginHorizontal: 24,
    marginBottom: 32,
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  ctaText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default TransactionStatusScreen;

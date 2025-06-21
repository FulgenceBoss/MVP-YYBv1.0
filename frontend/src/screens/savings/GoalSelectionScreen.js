import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { setGoal } from "../../store/slices/savingsConfigSlice";
import CustomGoalModal from "../../components/CustomGoalModal";

const colors = {
  primary: "#2e7d32",
  secondary: "#1976d2",
  success: "#4caf50",
  bg: "#fafafa",
  surface: "#ffffff",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#e0e0e0",
  lightGreen: "#e8f5e8",
  lightBlue: "#e3f2fd",
  warning: "#ff9800",
  goalBlue: "#E3F2FD",
  goalYellow: "#FFFDE7",
  goalPurple: "#F3E5F5",
  goalRed: "#FFEBEE",
  goalGreen: "#E8F5E9",
};

const popularGoals = [
  {
    icon: "📱",
    name: "Nouveau téléphone",
    amount: "150000",
    key: "phone",
    bgColor: colors.goalBlue,
  },
  {
    icon: "🏠",
    name: "Acompte maison",
    amount: "2000000",
    key: "house",
    bgColor: colors.goalYellow,
  },
  {
    icon: "💼",
    name: "Lancer mon business",
    amount: "1000000",
    key: "business",
    bgColor: colors.goalPurple,
  },
  {
    icon: "🚨",
    name: "Fonds d'urgence",
    amount: "300000",
    key: "emergency",
    bgColor: colors.goalRed,
  },
  {
    icon: "🎓",
    name: "Formation",
    amount: "500000",
    key: "education",
    bgColor: colors.goalYellow,
  },
  {
    icon: "✈️",
    name: "Voyage de rêve",
    amount: "800000",
    key: "travel",
    bgColor: colors.goalGreen,
  },
];

const GoalSelectionScreen = ({ navigation, route }) => {
  const [selectedGoal, setSelectedGoal] = useState(popularGoals[0]);
  const [customGoal, setCustomGoal] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const fromDashboard = route.params?.source === "dashboard";

  const formatNumber = (numStr) => {
    if (!numStr) return "";
    return parseInt(numStr, 10).toLocaleString("fr-FR");
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
  };

  const handleOpenModal = (goalToEdit = null) => {
    setIsModalVisible(true);
  };

  const handleCustomGoalSave = (goalData) => {
    const newGoal = {
      ...goalData,
      key: "custom",
      icon: "💰",
      bgColor: colors.lightGreen,
    };
    setCustomGoal(newGoal);
    setSelectedGoal(newGoal);
  };

  const handleNextStep = () => {
    if (selectedGoal) {
      dispatch(setGoal(selectedGoal));
      navigation.navigate("SpeedSelection");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.screen}>
        <View style={styles.navHeader}>
          {fromDashboard && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Définir mon objectif</Text>
          {!fromDashboard && (
            <Text style={styles.progressIndicator}>Étape 1/2</Text>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <Text style={styles.mainTitle}>
              Définissez votre objectif d&apos;épargne
            </Text>
            <Text style={styles.mainSubtitle}>
              Choisissez ce qui vous motive le plus à épargner
            </Text>
            <LinearGradient
              colors={[colors.lightGreen, "#f1f8e9"]}
              style={styles.motivationCard}
            >
              <Text style={styles.motivationIcon}>🎯</Text>
              <Text style={styles.motivationText}>
                Un objectif clair multiplie vos chances de succès par 10 !
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Objectifs populaires</Text>
            <View style={styles.categoriesGrid}>
              {popularGoals.map((goal) => (
                <TouchableOpacity
                  key={goal.key}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: goal.bgColor },
                    selectedGoal &&
                      selectedGoal.key === goal.key &&
                      styles.selectedCategoryCard,
                  ]}
                  onPress={() => handleGoalSelect(goal)}
                >
                  {selectedGoal && selectedGoal.key === goal.key && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                  <Text style={styles.categoryIcon}>{goal.icon}</Text>
                  <Text style={styles.categoryName}>{goal.name}</Text>
                  <Text style={styles.categoryAmount}>
                    {formatNumber(goal.amount)} FCFA
                  </Text>
                  <Text style={styles.categoryDescription}>
                    {goal.description}
                  </Text>
                </TouchableOpacity>
              ))}
              {customGoal && (
                <TouchableOpacity
                  key={customGoal.key}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: customGoal.bgColor },
                    selectedGoal &&
                      selectedGoal.key === customGoal.key &&
                      styles.selectedCategoryCard,
                  ]}
                  onPress={() => handleOpenModal(customGoal)}
                >
                  {selectedGoal && selectedGoal.key === customGoal.key && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                  <Text style={styles.categoryIcon}>{customGoal.icon}</Text>
                  <Text style={styles.categoryName}>{customGoal.name}</Text>
                  <Text style={styles.categoryAmount}>
                    {formatNumber(customGoal.amount)} FCFA
                  </Text>
                </TouchableOpacity>
              )}
              {!customGoal && (
                <TouchableOpacity
                  style={[styles.categoryCard, { backgroundColor: "#f5f5f5" }]}
                  onPress={() => handleOpenModal()}
                >
                  <Text style={styles.categoryIcon}>💰</Text>
                  <Text style={styles.categoryName}>Autre Objectif</Text>
                  <Text style={styles.categoryDescription}>
                    Définissez le vôtre
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.ctaSection}>
            <TouchableOpacity
              style={[styles.ctaPrimary, !selectedGoal && styles.ctaDisabled]}
              disabled={!selectedGoal}
              onPress={handleNextStep}
            >
              <Text style={styles.ctaPrimaryText}>🎯 Définir mon objectif</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <CustomGoalModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={handleCustomGoalSave}
          initialGoal={customGoal}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: 16,
    position: "absolute",
    left: 24,
    top: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: "bold",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  progressIndicator: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  mainSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 24,
    textAlign: "center",
  },
  motivationCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(46, 125, 50, 0.2)",
    alignItems: "center",
    width: "100%",
  },
  motivationIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "600",
    textAlign: "center",
  },
  categoriesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedCategoryCard: {
    borderColor: colors.primary,
    backgroundColor: colors.lightGreen,
    transform: [{ translateY: -2 }],
    shadowColor: "rgba(46, 125, 50, 0.2)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    backgroundColor: colors.success,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  ctaSection: {
    paddingBottom: 20,
  },
  ctaPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "rgba(46, 125, 50, 0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaDisabled: {
    backgroundColor: "#BDBDBD",
    elevation: 0,
    shadowOpacity: 0,
  },
  ctaPrimaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export default GoalSelectionScreen;

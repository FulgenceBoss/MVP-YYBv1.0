import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSavingsConfig,
  updateSavingsConfig,
} from "../../store/slices/savingsConfigSlice";
import AmountInputModal from "../../components/AmountInputModal";
import TimePickerModal from "../../components/TimePickerModal";

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { config, status } = useSelector((state) => state.savingsConfig);

  // Utiliser un état local pour gérer les modifications avant de les sauvegarder
  const [localConfig, setLocalConfig] = React.useState(config);
  const [isAmountModalVisible, setIsAmountModalVisible] = React.useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = React.useState(false);

  useEffect(() => {
    // Charger la config si elle n'est pas là
    if (!config) {
      dispatch(fetchSavingsConfig());
    }
    // Synchroniser l'état local si la config du store change
    if (config) {
      setLocalConfig(config);
    }
  }, [config, dispatch]);

  const handleUpdate = (field, value) => {
    setLocalConfig((prev) => ({ ...prev, [field]: value }));
  };

  const onSave = () => {
    dispatch(updateSavingsConfig(localConfig));
    navigation.goBack();
  };

  const handleModifyAmount = () => {
    setIsAmountModalVisible(true);
  };

  const handleSaveAmount = (newAmount) => {
    handleUpdate("dailyAmount", newAmount);
    setIsAmountModalVisible(false);
  };

  const handleModifyTime = () => {
    setIsTimePickerVisible(true);
  };

  const handleSelectTime = (newTime) => {
    handleUpdate("deductionTime", newTime);
  };

  if (!localConfig || status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AmountInputModal
        isVisible={isAmountModalVisible}
        onClose={() => setIsAmountModalVisible(false)}
        onSave={handleSaveAmount}
        currentAmount={localConfig.dailyAmount}
      />
      <TimePickerModal
        isVisible={isTimePickerVisible}
        onClose={() => setIsTimePickerVisible(false)}
        onSelect={handleSelectTime}
      />
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Paramètres</Text>
      </View>
      <ScrollView style={styles.content}>
        {/* Épargne Automatique Section */}
        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Épargne automatique</Text>
            <Text style={styles.sectionSubtitle}>
              Gérez vos paramètres d&apos;épargne quotidienne
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Montant quotidien</Text>
                <Text style={styles.settingDescription}>
                  Somme prélevée chaque jour
                </Text>
              </View>
              <View style={styles.settingAction}>
                <Text style={styles.settingValue}>
                  {localConfig.dailyAmount?.toLocaleString("fr-FR")} FCFA
                </Text>
                <TouchableOpacity
                  style={styles.modifyButton}
                  onPress={handleModifyAmount}
                >
                  <Text style={styles.modifyButtonText}>Modifier</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Heure prélèvement</Text>
                <Text style={styles.settingDescription}>
                  Moment du prélèvement quotidien
                </Text>
              </View>
              <View style={styles.settingAction}>
                <Text style={styles.settingValue}>
                  {String(localConfig.deductionTime).padStart(2, "0")}:00
                </Text>
                <TouchableOpacity
                  style={styles.modifyButton}
                  onPress={handleModifyTime}
                >
                  <Text style={styles.modifyButtonText}>Modifier</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>
                  Épargne automatique activée
                </Text>
                <Text style={styles.settingDescription}>
                  Prélèvements automatiques quotidiens
                </Text>
              </View>
              <View style={styles.settingAction}>
                <TouchableOpacity
                  style={[
                    styles.toggleSwitch,
                    localConfig.active && styles.toggleSwitchActive,
                  ]}
                  onPress={() => handleUpdate("active", !localConfig.active)}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      localConfig.active && { transform: [{ translateX: 20 }] },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>
            Sauvegarder les modifications
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: "#2e7d32",
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
  },
  content: {
    flex: 1,
  },
  settingsSection: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    margin: 20,
    overflow: "hidden",
  },
  sectionHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#757575",
  },
  sectionContent: {},
  settingItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#212121",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#757575",
  },
  settingAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
  },
  modifyButton: {
    backgroundColor: "#e8f5e8",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modifyButtonText: {
    color: "#2e7d32",
    fontWeight: "600",
  },
  toggleSwitch: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    padding: 2,
  },
  toggleSwitchActive: {
    backgroundColor: "#4caf50",
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    transform: [{ translateX: 0 }],
  },
  saveButton: {
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    margin: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default SettingsScreen;

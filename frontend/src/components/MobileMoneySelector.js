import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

const localColors = {
  primary: "#2e7d32",
  success: "#4caf50",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#e0e0e0",
  surface: "#ffffff",
  lightGreen: "#e8f5e8",
  moovOrange: "#ff6b00",
  airtelRed: "#e60012",
};

const MobileMoneySelector = ({
  operator,
  wallet,
  onOperatorChange,
  onWalletChange,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Choisissez votre mobile money</Text>
      <Text style={styles.sectionSubtitle}>Sélectionnez votre opérateur</Text>
      <View style={styles.operatorSelection}>
        <TouchableOpacity
          style={[
            styles.operatorCard,
            operator === "Moov" && styles.selectedMoovCard,
          ]}
          onPress={() => onOperatorChange("Moov")}
        >
          {operator === "Moov" && (
            <View style={styles.selectedBadge}>
              <Text style={{ color: "white" }}>✓</Text>
            </View>
          )}
          <View
            style={[
              styles.operatorLogo,
              { backgroundColor: localColors.moovOrange },
            ]}
          >
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text style={styles.operatorName}>Moov</Text>
          <Text style={styles.operatorSubtitle}>Partenaire officiel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.operatorCard,
            operator === "Airtel" && styles.selectedAirtelCard,
          ]}
          onPress={() => onOperatorChange("Airtel")}
        >
          {operator === "Airtel" && (
            <View style={styles.selectedBadge}>
              <Text style={{ color: "white" }}>✓</Text>
            </View>
          )}
          <View
            style={[
              styles.operatorLogo,
              { backgroundColor: localColors.airtelRed },
            ]}
          >
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.operatorName}>Airtel</Text>
          <Text style={styles.operatorSubtitle}>Partenaire officiel</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.phoneInputGroup,
          wallet?.length >= 8 && styles.validInput,
        ]}
      >
        <View style={styles.operatorPrefix}>
          <View
            style={[
              styles.prefixLogo,
              {
                backgroundColor:
                  operator === "Moov"
                    ? localColors.moovOrange
                    : localColors.airtelRed,
              },
            ]}
          >
            <Text style={styles.logoTextSmall}>
              {operator === "Moov" ? "M" : "A"}
            </Text>
          </View>
          <Text style={styles.prefixText}>+241</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder="XX XX XX XX"
          value={wallet}
          onChangeText={onWalletChange}
          maxLength={9}
          keyboardType="phone-pad"
        />
        {wallet?.length >= 8 && <Text style={styles.validationIcon}>✅</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: localColors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: localColors.textSecondary,
    marginBottom: 16,
  },
  operatorSelection: { flexDirection: "row", gap: 16, marginBottom: 24 },
  operatorCard: {
    flex: 1,
    backgroundColor: localColors.surface,
    borderWidth: 3,
    borderColor: localColors.border,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  selectedMoovCard: {
    borderColor: localColors.moovOrange,
    elevation: 4,
    shadowColor: localColors.moovOrange,
    transform: [{ translateY: -2 }],
  },
  selectedAirtelCard: {
    borderColor: localColors.airtelRed,
    elevation: 4,
    shadowColor: localColors.airtelRed,
    transform: [{ translateY: -2 }],
  },
  selectedBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    backgroundColor: localColors.success,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  operatorLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: { color: "white", fontSize: 24, fontWeight: "800" },
  operatorName: {
    fontSize: 16,
    fontWeight: "600",
    color: localColors.textPrimary,
  },
  operatorSubtitle: { fontSize: 12, color: localColors.textSecondary },
  phoneInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: localColors.surface,
    borderWidth: 2,
    borderColor: localColors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 60,
  },
  validInput: {
    borderColor: localColors.success,
    backgroundColor: localColors.lightGreen,
  },
  operatorPrefix: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 12,
    marginRight: 12,
    borderRightWidth: 1,
    borderRightColor: localColors.border,
  },
  prefixLogo: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  logoTextSmall: { color: "white", fontSize: 10, fontWeight: "800" },
  prefixText: { fontSize: 16, fontWeight: "600" },
  phoneInput: { flex: 1, fontSize: 16, fontWeight: "600" },
  validationIcon: { fontSize: 20 },
});

export default MobileMoneySelector;

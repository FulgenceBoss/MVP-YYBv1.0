import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../../store/slices/userSlice";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { userInfo, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (status === "loading") {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (status === "failed") {
    return (
      <Text style={styles.errorText}>
        Erreur: {error.message || "Impossible de charger le profil"}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Profil</Text>
      </View>
      <ScrollView contentContainerStyle={styles.mainContent}>
        {userInfo && (
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarImage}>
                <Text style={styles.avatarText}>
                  {userInfo.fullName
                    ? userInfo.fullName.charAt(0).toUpperCase()
                    : ""}
                </Text>
              </View>
              <TouchableOpacity style={styles.avatarEdit}>
                <Text>✏️</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{userInfo.fullName}</Text>
            <Text style={styles.profilePhone}>
              📱 {userInfo.phoneNumber} ✅
            </Text>
            <Text style={styles.profileMember}>
              Membre depuis :{" "}
              {userInfo.createdAt
                ? new Date(userInfo.createdAt).toLocaleDateString("fr-FR")
                : ""}
            </Text>
          </View>
        )}

        <View style={styles.settingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sécurité</Text>
            <Text style={styles.sectionSubtitle}>
              Protégez votre compte et vos données
            </Text>
          </View>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={[styles.settingIcon, styles.securityIcon]}>
                <Text>🔐</Text>
              </View>
              <View style={styles.settingDetails}>
                <Text style={styles.settingLabel}>Changer mon PIN</Text>
                <Text style={styles.settingDescription}>
                  Code de sécurité à 4 chiffres
                </Text>
              </View>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>⚠️ Zone dangereuse</Text>
          <Text style={styles.dangerDescription}>
            Cette action est irréversible. Toutes vos données d'épargne seront
            définitivement perdues.
          </Text>
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>🗑️ Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    color: "red",
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight || 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
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
  mainContent: {
    padding: 24,
  },
  profileCard: {
    backgroundColor: "#2e7d32",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
  },
  avatarEdit: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    marginBottom: 4,
  },
  profileMember: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  settingsSection: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
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
  settingItem: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  securityIcon: {
    backgroundColor: "#e3f2fd",
  },
  settingDetails: {},
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
  settingArrow: {
    fontSize: 18,
    color: "#757575",
  },
  dangerZone: {
    marginTop: 24,
    backgroundColor: "#ffebee",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(244, 67, 54, 0.2)",
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f44336",
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 16,
    lineHeight: 20,
  },
  dangerButton: {
    backgroundColor: "#f44336",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default ProfileScreen;

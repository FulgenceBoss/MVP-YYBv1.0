import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";

const ChangePinModal = ({ isVisible, onClose, onSave, isLoading = false }) => {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const handleSave = () => {
    if (!oldPin || !newPin || !confirmPin) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      Alert.alert("Erreur", "Le PIN doit contenir exactement 4 chiffres.");
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert("Erreur", "Les nouveaux PINs ne correspondent pas.");
      return;
    }
    onSave({ oldPin, newPin });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Changer votre PIN</Text>

          <TextInput
            style={styles.input}
            placeholder="Ancien PIN"
            placeholderTextColor="#888"
            value={oldPin}
            onChangeText={setOldPin}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Nouveau PIN"
            placeholderTextColor="#888"
            value={newPin}
            onChangeText={setNewPin}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            editable={!isLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmer le nouveau PIN"
            placeholderTextColor="#888"
            value={confirmPin}
            onChangeText={setConfirmPin}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Changer le PIN</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
            disabled={isLoading}
          >
            <Text style={styles.buttonCloseText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  button: {
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    width: "100%",
    backgroundColor: "#2e7d32",
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  buttonClose: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonCloseText: {
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default ChangePinModal;

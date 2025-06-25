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
} from "react-native";

const AmountInputModal = ({ isVisible, onClose, onSave, currentAmount }) => {
  const [amount, setAmount] = useState(String(currentAmount || ""));

  const handleSave = () => {
    const numericAmount = parseInt(amount, 10);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      onSave(numericAmount);
      onClose();
    } else {
      // Optionnel: afficher une alerte si le montant est invalide
      alert("Veuillez entrer un montant valide.");
    }
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
          <Text style={styles.modalTitle}>Modifier le montant</Text>
          <Text style={styles.modalSubtitle}>
            Saisissez votre nouveau montant d&apos;épargne quotidien.
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setAmount}
            value={amount}
            keyboardType="number-pad"
            placeholder="Ex: 1000"
            autoFocus={true}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.textStyle}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={handleSave}
            >
              <Text style={styles.textStyle}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>
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
    padding: 25,
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#212121",
  },
  modalSubtitle: {
    marginBottom: 15,
    textAlign: "center",
    color: "#757575",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    textAlign: "center",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonClose: {
    backgroundColor: "#e0e0e0",
  },
  buttonSave: {
    backgroundColor: "#2e7d32",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AmountInputModal;

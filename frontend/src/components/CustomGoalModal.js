import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const localColors = {
  primary: "#2e7d32",
  textPrimary: "#212121",
  border: "#e0e0e0",
  surface: "#ffffff",
  success: "#4caf50",
};

const CustomGoalModal = ({ isVisible, onClose, onSave, initialGoal }) => {
  const [goalName, setGoalName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (initialGoal) {
      setGoalName(initialGoal.name);
      setAmount(initialGoal.amount);
    } else {
      // Reset when opening for a new goal
      setGoalName("");
      setAmount("");
    }
  }, [initialGoal, isVisible]); // Rerun when modal is opened

  const handleSave = () => {
    if (goalName.trim() && amount && parseInt(amount) > 0) {
      setIsSaved(true);
      setTimeout(() => {
        onSave({ name: goalName.trim(), amount });
        setGoalName("");
        setAmount("");
        setIsSaved(false);
        onClose();
      }, 1000);
    }
  };

  const handleClose = () => {
    setGoalName("");
    setAmount("");
    onClose();
  };

  const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Votre objectif personnalisé</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom de l&apos;objectif</Text>
            <TextInput
              style={styles.input}
              value={goalName}
              onChangeText={setGoalName}
              autoFocus={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Montant nécessaire</Text>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={formatNumber(amount)}
                onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
              />
              <Text style={styles.currencyLabel}>FCFA</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={handleClose}
            >
              <Text style={[styles.textStyle, styles.textClose]}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonSave,
                isSaved && styles.buttonSaved,
              ]}
              onPress={handleSave}
              disabled={isSaved}
            >
              <Text style={styles.textStyle}>
                {isSaved ? "✅ Enregistré" : "Enregistrer"}
              </Text>
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
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
    color: localColors.textPrimary,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: localColors.textSecondary,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: localColors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: localColors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  amountInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    textAlign: "right",
    marginRight: 8,
  },
  currencyLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: localColors.textSecondary,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonClose: {
    backgroundColor: localColors.surface,
    borderWidth: 2,
    borderColor: localColors.primary,
  },
  buttonSave: { backgroundColor: localColors.primary },
  buttonSaved: { backgroundColor: localColors.success },
  textStyle: { color: "white", fontWeight: "bold", textAlign: "center" },
  textClose: { color: localColors.primary },
});

export default CustomGoalModal;

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
  LayoutAnimation,
} from "react-native";

const localColors = {
  primary: "#2e7d32",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#e0e0e0",
  surface: "#ffffff",
  success: "#4caf50",
};

const CustomAmountModal = ({
  isVisible,
  onClose,
  onSave,
  modalTitle = "Saisir un montant",
  inputPlaceholder = "Montant (FCFA)",
  initialValue = "",
  goalInfo,
}) => {
  const [amount, setAmount] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setAmount(initialValue.toString());
    }
  }, [isVisible, initialValue]);

  // Function to format number with spaces
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleAmountChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  const handleSave = () => {
    if (amount && parseInt(amount) > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsSaved(true);
      setTimeout(() => {
        onSave(amount);
        setAmount("");
        setIsSaved(false);
        onClose();
      }, 1200); // Keep it visible a bit longer for the checkmark
    }
  };

  const handleClose = () => {
    setAmount("");
    onClose();
  };

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
          <Text style={styles.modalTitle}>{modalTitle}</Text>

          {goalInfo && (
            <View style={styles.goalInfoContainer}>
              <Text style={styles.goalInfoText}>
                Objectif actuel : {goalInfo.name} (
                {parseInt(goalInfo.amount).toLocaleString("fr-FR")} FCFA)
              </Text>
              <TouchableOpacity onPress={goalInfo.onEdit}>
                <Text style={styles.editGoalButton}>
                  Modifier l&apos;objectif
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={inputPlaceholder}
              keyboardType="numeric"
              onChangeText={handleAmountChange}
              value={formatNumber(amount)}
              autoFocus={true}
            />
            <Text style={styles.currencyLabel}>FCFA</Text>
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
                {isSaved ? "✅ Sauvegardé" : "Sauvegarder"}
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
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: localColors.textPrimary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: localColors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    textAlign: "right",
    fontSize: 22,
    marginRight: 8,
  },
  currencyLabel: {
    fontSize: 18,
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
  buttonSave: {
    backgroundColor: localColors.primary,
  },
  buttonSaved: {
    backgroundColor: localColors.success,
    flex: 0,
    paddingHorizontal: 20,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  textClose: {
    color: localColors.primary,
  },
  goalInfoContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  goalInfoText: {
    fontSize: 14,
    color: localColors.textSecondary,
    textAlign: "center",
  },
  editGoalButton: {
    color: localColors.primary,
    fontWeight: "bold",
    marginTop: 8,
    textDecorationLine: "underline",
  },
});

export default CustomAmountModal;

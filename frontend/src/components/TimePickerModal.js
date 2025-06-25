import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

const TimePickerModal = ({ isVisible, onClose, onSelect }) => {
  // Heures paires de 8h à 22h pour le MVP
  const timeOptions = [8, 10, 12, 14, 16, 18, 20, 22];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.timeOption}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <Text style={styles.timeText}>{String(item).padStart(2, "0")}:00</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Choisir l&apos;heure</Text>
          <FlatList
            data={timeOptions}
            renderItem={renderItem}
            keyExtractor={(item) => String(item)}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: 20,
    color: "#212121",
  },
  listContainer: {
    justifyContent: "center",
    width: "100%",
  },
  timeOption: {
    backgroundColor: "#e8f5e8",
    padding: 20,
    borderRadius: 10,
    margin: 8,
    alignItems: "center",
    flex: 1,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d32",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#212121",
    fontWeight: "bold",
  },
});

export default TimePickerModal;

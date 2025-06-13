import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavingsConfig } from "../store/slices/savingsConfigSlice";

const AppLoadingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { configExists, status } = useSelector((state) => state.savingsConfig);

  useEffect(() => {
    dispatch(fetchSavingsConfig());
  }, [dispatch]);

  useEffect(() => {
    if (status === "success") {
      if (configExists) {
        navigation.replace("Dashboard");
      } else {
        navigation.replace("AmountSelection");
      }
    } else if (status === "error") {
      navigation.replace("AmountSelection");
    }
  }, [configExists, status, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppLoadingScreen;

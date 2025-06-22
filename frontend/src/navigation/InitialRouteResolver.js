import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavingsConfig } from "../store/slices/savingsConfigSlice";
import { COLORS } from "../constants/theme";

const InitialRouteResolver = ({ navigation }) => {
  const dispatch = useDispatch();
  const { config, status } = useSelector((state) => state.savingsConfig);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSavingsConfig());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === "succeeded") {
      // If a config object with an _id exists in the database, the user is fully set up.
      if (config && config._id) {
        navigation.replace("Dashboard");
      } else {
        // No valid config found, user needs to go through the new setup flow.
        navigation.replace("GoalSelection");
      }
    } else if (status === "failed") {
      // If the request fails (e.g., 404 Not Found), it means the user has no config.
      // Redirect them to the setup flow.
      navigation.replace("GoalSelection");
    }
  }, [status, config, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});

export default InitialRouteResolver;

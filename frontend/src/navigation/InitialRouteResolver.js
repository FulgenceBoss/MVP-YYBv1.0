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
        console.log(
          "[InitialRouteResolver] User has a valid savings config. Redirecting to Dashboard."
        );
        navigation.replace("Dashboard");
      } else {
        // No valid config found, user needs to go through the new setup flow.
        console.log(
          "[InitialRouteResolver] No savings config found. Redirecting to GoalSelection."
        );
        navigation.replace("GoalSelection");
      }
    } else if (status === "failed") {
      Alert.alert(
        "Erreur de chargement",
        "Nous n'avons pas pu vérifier votre configuration d'épargne. Vous pourrez la définir plus tard."
      );
      navigation.replace("Dashboard");
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

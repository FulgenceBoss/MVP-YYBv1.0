import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchSavingsConfig } from "../store/slices/savingsConfigSlice";
import { COLORS } from "../constants/theme";

const InitialRouteResolver = ({ navigation }) => {
  const dispatch = useDispatch();
  const { config, status } = useSelector((state) => state.savingsConfig);

  useEffect(() => {
    // On s'assure que le statut est "idle" avant de lancer, pour éviter les doubles appels
    if (status === "idle") {
      dispatch(fetchSavingsConfig());
    }
  }, [dispatch, status]);

  useEffect(() => {
    // On agit SEULEMENT quand le statut est final (succès ou échec)
    if (status === "succeeded") {
      // LA VÉRIFICATION LA PLUS FIABLE : un _id n'existe que si la config est en BDD.
      if (config && config._id) {
        navigation.replace("Dashboard");
      } else {
        navigation.replace("AmountSelection");
      }
    } else if (status === "failed") {
      // En cas d'erreur réseau, on redirige vers le dashboard pour éviter de bloquer l'utilisateur.
      // L'utilisateur pourra configurer manuellement plus tard.
      Alert.alert(
        "Erreur de chargement",
        "Nous n'avons pas pu vérifier votre configuration d'épargne. Vous pourrez la définir plus tard."
      );
      navigation.replace("Dashboard");
    }
  }, [status, config, navigation]);

  return (
    // Écran de chargement pendant la vérification
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

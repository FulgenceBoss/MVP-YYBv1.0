import React from "react";
import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

export const LottieAnimation = ({ source, loop = true, speed = 1, style }) => {
  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={source}
        autoPlay
        loop={loop}
        speed={speed}
        style={styles.lottie}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 250, // Default height, can be overridden by style prop
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});

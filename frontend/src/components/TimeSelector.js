import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

const localColors = {
  primary: "#2e7d32",
  textPrimary: "#212121",
  textSecondary: "#757575",
  border: "#e0e0e0",
  surface: "#ffffff",
  lightGreen: "#e8f5e8",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDER_WIDTH = SCREEN_WIDTH - 48 * 2; // padding * 2

const timeContexts = {
  6: "Tôt le matin",
  7: "Début de matinée",
  8: "Avant le travail",
  9: "Matinée",
  10: "Matinée",
  11: "Fin de matinée",
  12: "Midi",
  13: "Début d'après-midi",
  14: "Après-midi",
  15: "Après-midi",
  16: "Fin d'après-midi",
  17: "Fin de journée",
  18: "Après le travail",
  19: "Début de soirée",
  20: "Après votre journée de travail",
  21: "Soirée",
  22: "Soirée",
  23: "Fin de soirée",
};

const TimeSelector = ({ onTimeChange }) => {
  const [time, setTime] = useState(20);
  const [timeContext, setTimeContext] = useState(timeContexts[20]);

  const position = useSharedValue(0);
  const savedPosition = useSharedValue(0);

  const updateReactState = (newHour) => {
    "worklet";
    runOnJS(setTime)(newHour);
    runOnJS(setTimeContext)(timeContexts[newHour] || "Horaire personnalisé");
    if (onTimeChange) {
      runOnJS(onTimeChange)(newHour);
    }
  };

  useEffect(() => {
    const initialPercentage = ((20 - 6) / 17) * 100;
    const initialPos = (initialPercentage / 100) * SLIDER_WIDTH;
    position.value = initialPos;
    savedPosition.value = initialPos;
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const newPos = savedPosition.value + e.translationX;
      position.value = Math.max(0, Math.min(newPos, SLIDER_WIDTH));

      const percentage = (position.value / SLIDER_WIDTH) * 100;
      const newHour = Math.round(6 + (percentage / 100) * 17);
      updateReactState(newHour);
    })
    .onEnd(() => {
      savedPosition.value = position.value;
    });

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const animatedTrackStyle = useAnimatedStyle(() => ({
    width: position.value,
  }));

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Prélèvement quotidien à :</Text>
      <Text style={styles.sectionSubtitle}>
        Choisissez l&apos;heure qui vous convient
      </Text>
      <View style={styles.timeSelector}>
        <View style={styles.timeDisplay}>
          <Text style={styles.timeValue}>{`${String(time).padStart(
            2,
            "0"
          )}:00`}</Text>
          <Text style={styles.timeContext}>{timeContext}</Text>
        </View>
        <GestureDetector gesture={panGesture}>
          <View style={styles.timeSlider}>
            <Animated.View style={[styles.timeTrack, animatedTrackStyle]} />
            <Animated.View style={[styles.timeThumb, animatedThumbStyle]} />
          </View>
        </GestureDetector>
        <View style={styles.timeLabels}>
          <Text>6h</Text>
          <Text>12h</Text>
          <Text>18h</Text>
          <Text>23h</Text>
        </View>
        <View style={styles.popularTime}>
          <Text style={styles.popularText}>⭐ Horaire populaire : 20h00</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: localColors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: localColors.textSecondary,
    marginBottom: 16,
  },
  timeSelector: {
    backgroundColor: localColors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: localColors.border,
  },
  timeDisplay: { alignItems: "center", marginBottom: 24 },
  timeValue: {
    fontSize: 36,
    fontWeight: "800",
    color: localColors.primary,
    marginBottom: 8,
  },
  timeContext: {
    fontSize: 14,
    color: localColors.textSecondary,
    fontWeight: "500",
  },
  timeSlider: {
    height: 8,
    backgroundColor: localColors.border,
    borderRadius: 4,
    justifyContent: "center",
    width: SLIDER_WIDTH,
    alignSelf: "center",
  },
  timeTrack: {
    height: "100%",
    backgroundColor: localColors.primary,
    borderRadius: 4,
  },
  timeThumb: {
    position: "absolute",
    top: -8,
    width: 24,
    height: 24,
    backgroundColor: localColors.primary,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 12,
    elevation: 3,
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 4,
    width: SLIDER_WIDTH,
    alignSelf: "center",
  },
  popularTime: {
    backgroundColor: localColors.lightGreen,
    padding: 8,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  popularText: { fontSize: 12, color: localColors.primary, fontWeight: "600" },
});

export default TimeSelector;

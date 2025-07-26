import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type Props = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export default function Button({
  title,
  onPress,
  style,
  textStyle,
  disabled,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled, style]}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1db954",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  disabled: {
    backgroundColor: "#b5b5b5",
  },
});

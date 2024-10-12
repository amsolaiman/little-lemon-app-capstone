import * as React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  onClick: VoidFunction;
  isActive: boolean;
  label: string;
};

export default function ToggleButton({
  isActive = false,
  label,
  onClick,
}: Props) {
  return (
    <Pressable
      onPress={onClick}
      style={[
        styles.button,
        {
          backgroundColor: isActive ? "#495E57" : "#EDEFEE",
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: isActive ? "#FFF" : "#495E57",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#",
    borderRadius: 50,
  },
  label: {
    textAlign: "center",
    textTransform: "capitalize",
    fontSize: 16,
    fontFamily: "Karla-Bold",
  },
});

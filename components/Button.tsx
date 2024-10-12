import * as React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  onClick: VoidFunction;
  variant: "contained" | "outlined";
  label: string;
};

export default function Button({ variant, label, onClick }: Props) {
  return (
    <Pressable
      onPress={onClick}
      style={[
        styles.button,
        variant === "contained" ? styles.varContained : styles.varOutlined,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: variant === "contained" ? "#FFF" : "#495E57",
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 100,
    borderRadius: 8,
  },
  varContained: {
    backgroundColor: "#495E57",
  },
  varOutlined: {
    borderWidth: 1,
    borderColor: "#495E57",
  },
  label: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Karla-Bold",
  },
});

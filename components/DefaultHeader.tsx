import * as React from "react";
import { View, StyleSheet, Image } from "react-native";

type Props = {
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
};

export default function DefaultHeader({ leftActions, rightActions }: Props) {
  return (
    <View style={[styles.container, styles.shadow]}>
      <View style={styles.actionLeft}>{leftActions}</View>

      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      <View style={styles.actionRight}>{rightActions}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  logo: {
    flex: 1,
    resizeMode: "contain",
    height: 42,
  },
  actionLeft: {
    width: 64,
    alignItems: "flex-start",
  },
  actionRight: {
    width: 64,
    alignItems: "flex-end",
  },
});

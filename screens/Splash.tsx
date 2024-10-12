import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Little Lemon</Text>

      <Image
        source={require("../assets/images/logo-single.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  title: {
    marginBottom: 32,
    fontSize: 28,
    fontFamily: "MarkaziText-Regular",
  },
  logo: {
    resizeMode: "contain",
    height: 82,
  },
});

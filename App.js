import * as React from "react";
import { StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";

import Onboarding from "./Onboarding";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Onboarding />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

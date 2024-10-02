import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  Keyboard,
  Platform,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";

export default function OnboardingView() {
  const [name, onChangeName] = useState("");

  const [email, onChangeEmail] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={[styles.header, styles.headerShadow]}>
          <Image source={require("../../assets/logo.png")} />
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.caption}>Let us get to know you...</Text>

          <View style={styles.formContainer}>
            <View>
              <Text style={styles.inputLabel}>Enter Firstname</Text>
              <TextInput
                style={styles.inputBox}
                value={name}
                onChangeText={onChangeName}
              />
            </View>

            <View>
              <Text style={styles.inputLabel}>Enter Email</Text>
              <TextInput
                style={styles.inputBox}
                value={email}
                onChangeText={onChangeEmail}
                keyboardType="email-address"
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={() => {}} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    padding: 12,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  headerShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  bodyContainer: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  caption: {
    fontSize: 22,
    fontWeight: "500",
  },
  formContainer: {
    marginTop: 84,
    gap: 18,
  },
  inputLabel: {
    marginBottom: 6,
    textAlign: "center",
    fontSize: 16,
  },
  inputBox: {
    height: 40,
    width: 280,
    padding: 10,
    textAlign: "center",
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
  },
  footer: {
    padding: 12,
    paddingBottom: 24,
    alignItems: "flex-end",
    backgroundColor: "#EDEFEE",
  },
  button: {
    padding: 10,
    width: 100,
    borderRadius: 50,
    backgroundColor: "#495E57",
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
  },
});

import React, { useState } from "react";
import {
  Text,
  View,
  Alert,
  Keyboard,
  Platform,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
//
import validateEmail from "../utils/validateEmail";
//
import { useAuthContext } from "../auth/useAuthContext";
//
import DefaultHeader from "../components/DefaultHeader";

export default function OnboardingScreen() {
  const { onboard } = useAuthContext();

  const [name, onChangeName] = useState("");
  const [email, onChangeEmail] = useState("");

  const handleNext = async () => {
    const isEmailValid = validateEmail(email);

    if (!name || !email) {
      Alert.alert("Error", "Please enter both firstname and email");
      return;
    }

    if (!isEmailValid) {
      Alert.alert("Error", "Invalid email address");
      return;
    }

    onboard(name, email);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <DefaultHeader />

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
                textContentType="emailAddress"
                keyboardType="email-address"
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={handleNext} style={styles.button}>
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
  logo: {
    resizeMode: "contain",
    height: 42,
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

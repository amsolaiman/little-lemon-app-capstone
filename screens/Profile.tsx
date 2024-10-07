import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Platform,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
//
import validateEmail from "../utils/validateEmail";
//
import Avatar from "../components/Avatar";
import Button from "../components/Button";
import DefaultHeader from "../components/DefaultHeader";
//
import { IUserData } from "../types/userData";

type Props = {
  onLogout: VoidFunction;
};

export default function OnboardingScreen({ onLogout }: Props) {
  const [user, setUser] = useState<IUserData>();

  const [firstName, onChangeFirstName] = useState<string | null>(null);
  const [lastName, onChangeLastName] = useState<string | null>(null);
  const [avatar, onChangeAvatar] = useState<string | null>(null);
  const [email, onChangeEmail] = useState<string | null>(null);
  const [phone, onChangePhone] = useState<string | null>(null);

  const [notifications, setNotifications] = useState({
    orderStatus: true,
    passwordChange: true,
    specialOffers: true,
    newsletter: true,
  });

  const checkUserData = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      if (value) {
        const data: IUserData = JSON.parse(value);

        setUser(data);
        onChangeFirstName(data.firstName);
        onChangeLastName(data.lastName);
        onChangeAvatar(data.avatar);
        onChangeEmail(data.email);
        onChangePhone(data.phoneNumber);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkUserData();
  }, []);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onChangeAvatar(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    onChangeAvatar(null);
  };

  const handleCheckboxChange = (name: string) => {
    setNotifications((prevPreferences) => ({
      ...prevPreferences,
      [name]: !prevPreferences[name],
    }));
  };

  const handleSave = async () => {
    const isEmailValid = validateEmail(email);

    if (!firstName || !lastName || !avatar || !email || !phone) {
      Alert.alert("Error", "Please fill in all information");
      return;
    }

    if (!isEmailValid) {
      Alert.alert("Error", "Invalid email address");
      return;
    }

    const data = {
      fullName: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      avatar: avatar,
      email: email,
      phoneNumber: phone,
    };

    await AsyncStorage.setItem("user", JSON.stringify(data));
    Alert.alert("Success", "Changes have been saved");
  };

  const handleDiscard = () => {
    checkUserData();
    Alert.alert("Success", "Changes have been discarded");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <DefaultHeader
        leftActions={
          <Pressable style={styles.backButton}>
            <Ionicons name="arrow-back-outline" size={24} color="#FFF" />
          </Pressable>
        }
        rightActions={
          <Avatar src={avatar} alt={user?.fullName ?? firstName} size={42} />
        }
      />

      <ScrollView style={styles.bodyContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.caption}>Personal information</Text>

          <View>
            <Text style={styles.inputLabel}>Avatar</Text>
            <View style={styles.avatarField}>
              <Avatar
                src={avatar}
                alt={user?.fullName ?? firstName}
                size={72}
              />

              <Button
                variant="contained"
                label="Change"
                onClick={handlePickImage}
              />
              <Button
                variant="outlined"
                label="Remove"
                onClick={handleRemoveImage}
              />
            </View>
          </View>

          <View>
            <Text style={styles.inputLabel}>Firstname</Text>
            <TextInput
              style={styles.inputBox}
              value={firstName}
              onChangeText={onChangeFirstName}
            />
          </View>

          <View>
            <Text style={styles.inputLabel}>Lastname</Text>
            <TextInput
              style={styles.inputBox}
              value={lastName}
              onChangeText={onChangeLastName}
            />
          </View>

          <View>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.inputBox}
              value={email}
              onChangeText={onChangeEmail}
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text style={styles.inputLabel}>Phone number</Text>
            <TextInput
              style={styles.inputBox}
              value={phone}
              onChangeText={onChangePhone}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <View style={styles.checkContainer}>
          <Text style={styles.caption}>Email notifications</Text>

          <View style={styles.checkbox}>
            <Checkbox
              value={notifications.orderStatus}
              onValueChange={() => handleCheckboxChange("orderStatus")}
              color="#495E57"
            />
            <Text style={styles.checkboxText}>Order Status</Text>
          </View>

          <View style={styles.checkbox}>
            <Checkbox
              value={notifications.passwordChange}
              onValueChange={() => handleCheckboxChange("passwordChange")}
              color="#495E57"
            />
            <Text style={styles.checkboxText}>Password Change</Text>
          </View>

          <View style={styles.checkbox}>
            <Checkbox
              value={notifications.specialOffers}
              onValueChange={() => handleCheckboxChange("specialOffers")}
              color="#495E57"
            />
            <Text style={styles.checkboxText}>Special Offers</Text>
          </View>

          <View style={styles.checkbox}>
            <Checkbox
              value={notifications.newsletter}
              onValueChange={() => handleCheckboxChange("newsletter")}
              color="#495E57"
            />
            <Text style={styles.checkboxText}>Newsletter</Text>
          </View>
        </View>

        <Pressable onPress={onLogout} style={styles.button}>
          <Text style={styles.buttonText}>Log out</Text>
        </Pressable>

        <View style={styles.actions}>
          <Button
            variant="outlined"
            label="Discard changes"
            onClick={handleDiscard}
          />

          <Button
            variant="contained"
            label="Save changes"
            onClick={handleSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  backButton: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: "#495E57",
  },
  bodyContainer: {
    flex: 1,
    padding: 12,
  },
  caption: {
    fontSize: 18,
    fontWeight: "700",
  },
  formContainer: {
    marginTop: 6,
    gap: 18,
  },
  inputLabel: {
    marginBottom: 6,
    fontSize: 14,
  },
  inputBox: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#EDEFEE",
    backgroundColor: "#EDEFEE",
  },
  avatarField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkContainer: {
    marginTop: 24,
    gap: 18,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
  },
  actions: {
    padding: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    padding: 10,
    marginTop: 32,
    borderRadius: 8,
    backgroundColor: "#F4CE14",
  },
  buttonText: {
    color: "#333333",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});

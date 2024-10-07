import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
//
import SplashScreen from "./screens/Splash";
import OnboardingScreen from "./screens/Onboarding";
import ProfileScreen from "./screens/Profile";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("isOnboardingCompleted");
        if (value !== null) {
          setIsOnboardingCompleted(value === "true");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleLogin = async () => {
    await AsyncStorage.setItem("isOnboardingCompleted", "true");
    setIsOnboardingCompleted(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setIsOnboardingCompleted(false);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          {isOnboardingCompleted ? (
            <Stack.Screen name="Profile" options={{ headerShown: false }}>
              {(props) => <ProfileScreen {...props} onLogout={handleLogout} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
              {(props) => <OnboardingScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Platform, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
//
import SplashScreen from "./screens/Splash";
import OnboardingScreen from "./screens/Onboarding";
import HomeScreen from "./screens/Home";
import ProfileScreen from "./screens/Profile";

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, setState] = useState({
    isOnboardingCompleted: false,
    isLoading: true,
  });

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem("loginStatus");
      if (value !== null) {
        setState((prev) => ({
          ...prev,
          isOnboardingCompleted: value === "true",
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const handleLogin = async () => {
    await AsyncStorage.setItem("loginStatus", "true");
    checkOnboardingStatus();
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setState({
      isOnboardingCompleted: false,
      isLoading: true,
    });
    checkOnboardingStatus();
  };

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          {state.isOnboardingCompleted ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen name="Profile" options={{ headerShown: false }}>
                {(props) => (
                  <ProfileScreen {...props} onLogout={handleLogout} />
                )}
              </Stack.Screen>
            </>
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

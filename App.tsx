import React, {
  useMemo,
  useState,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import { Alert, SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
//
import { useFonts } from "expo-font";
import * as DefaultSplash from "expo-splash-screen";
//
import { AuthContext } from "./auth/AuthContext";
//
import { IUserType } from "./types/userType";
//
import SplashScreen from "./screens/Splash";
import OnboardingScreen from "./screens/Onboarding";
import HomeScreen from "./screens/Home";
import ProfileScreen from "./screens/Profile";

const Stack = createNativeStackNavigator();

const initialState = {
  isLoading: true,
  isOnboardingCompleted: false,
};

DefaultSplash.preventAutoHideAsync();

export default function App() {
  const [state, dispatch] = useReducer((prevState, action) => {
    if (action.type === "onboard") {
      return {
        ...prevState,
        isLoading: false,
        isOnboardingCompleted: action.isOnboardingCompleted,
      };
    }
  }, initialState);

  const [user, setUser] = useState<IUserType>();

  const checkOnboardingStatus = useCallback(async () => {
    let user = null;

    try {
      const value = await AsyncStorage.getItem("user");

      if (value !== null) {
        const data: IUserType = JSON.parse(value);

        user = value;
        setUser(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (user) {
        dispatch({ type: "onboard", isOnboardingCompleted: true });
      } else {
        dispatch({ type: "onboard", isOnboardingCompleted: false });
      }
    }
  }, []);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const authContextValue = useMemo(
    () => ({
      user: user,
      onboard: async (name: string, email: string) => {
        const data = {
          fullName: name,
          firstName: name,
          email: email,
        };

        try {
          const value = JSON.stringify(data);

          await AsyncStorage.setItem("user", value);
          checkOnboardingStatus();
        } catch (error) {
          console.error(error);
        } finally {
          dispatch({ type: "onboard", isOnboardingCompleted: true });
        }
      },
      update: async (data: IUserType) => {
        try {
          const value = JSON.stringify(data);

          await AsyncStorage.setItem("user", value);
          checkOnboardingStatus();
        } catch (error) {
          console.error(error);
        } finally {
          Alert.alert("Success", "Successfully saved changes!");
        }
      },
      logout: async () => {
        try {
          await AsyncStorage.clear();
        } catch (error) {
          console.error(error);
        } finally {
          setUser(null);
          dispatch({ type: "onboard", isOnboardingCompleted: false });
        }
      },
    }),
    [user]
  );

  const [loaded, error] = useFonts({
    "Karla-Regular": require("./assets/fonts/Karla-Regular.ttf"),
    "Karla-Medium": require("./assets/fonts/Karla-Medium.ttf"),
    "Karla-Bold": require("./assets/fonts/Karla-Bold.ttf"),
    "Karla-ExtraBold": require("./assets/fonts/Karla-ExtraBold.ttf"),
    "MarkaziText-Regular": require("./assets/fonts/MarkaziText-Regular.ttf"),
    "MarkaziText-Medium": require("./assets/fonts/MarkaziText-Medium.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      DefaultSplash.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <AuthContext.Provider value={authContextValue}>
        <NavigationContainer>
          <Stack.Navigator>
            {state.isOnboardingCompleted ? (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="Profile"
                  component={ProfileScreen}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ headerShown: false }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

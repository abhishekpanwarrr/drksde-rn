import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { createContext, useEffect, useState } from "react";
import { Alert, AppState, Pressable, Text, View } from "react-native";

type ContextType = {
  enabled: boolean;
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => Promise<void>;
};

export const BiometricContext = createContext<ContextType>({
  enabled: false,
  enableBiometric: async () => false,
  disableBiometric: async () => {},
});

const STORAGE_KEY = "@DRKSDE_BIOMETRIC_ENABLED";

export const BiometricProvider = ({ children }: any) => {
  const [enabled, setEnabled] = useState(false);
  const [locked, setLocked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  console.log("enabled", enabled);
  console.log("locked", locked);

  useEffect(() => {
    loadSetting();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (!enabled) return;

      if (state === "background" || state === "inactive") {
        setLocked(true); // 🔒 lock immediately
      }

      if (state === "active" && locked && !isAuthenticating) {
        authenticate(); // 🔓 authenticate on return
      }
    });

    return () => sub.remove();
  }, [enabled, locked]);

  const loadSetting = async () => {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value === "true") {
      setEnabled(true);
      setLocked(true);
      authenticate();
    }
  };

  const authenticate = async () => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate",
      disableDeviceFallback: false,
    });

    if (result.success) {
      setLocked(false);
    } else {
      setLocked(true);
    }
    setIsAuthenticating(false);
  };

  const enableBiometric = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirm to enable biometric",
    });

    console.log("Enable biometric result:", result);
    if (result?.error === "not_enrolled") {
      Alert.alert("Please enable authentication in your phone");
      return;
    }
    if (result.success) {
      await AsyncStorage.setItem(STORAGE_KEY, "true");
      setEnabled(true);
      setLocked(false);
      return true;
    }

    return false;
  };

  const disableBiometric = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setEnabled(false);
    setLocked(false);
  };

  return (
    <BiometricContext.Provider
      value={{ enabled, enableBiometric, disableBiometric }}
    >
      {enabled && locked ? <LockScreen onUnlock={authenticate} /> : children}
    </BiometricContext.Provider>
  );
};

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Ionicons name="lock-closed" size={60} color="black" />
      <Text className="text-xl mt-4">App Locked</Text>

      <Pressable
        onPress={onUnlock}
        className="mt-6 bg-black px-6 py-3 rounded-lg"
      >
        <Text className="text-white text-lg">Unlock</Text>
      </Pressable>
    </View>
  );
}

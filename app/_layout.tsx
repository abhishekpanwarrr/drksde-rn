import Context from "@/context/context";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";
import { Ionicons } from "@expo/vector-icons";
import { AppState, AppStateStatus, Pressable, Text, View } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="product/[id]"
        options={{ presentation: "modal", title: "Product details" }}
      />
      <Stack.Screen
        name="category/[slug]"
        options={{ presentation: "modal", title: "Category" }}
      />
      <Stack.Screen
        name="auth/login"
        options={{
          title: "Login",
          presentation: "formSheet",
          sheetAllowedDetents: [0.8, 0.9],
        }}
      />
      <Stack.Screen
        name="checkout/checkout"
        options={{
          title: "Checkout",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="checkout/order-success"
        options={{
          title: "Checkout",
        }}
      />
      <Stack.Screen
        name="user/orders"
        options={{
          title: "All orders",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="user/add-address"
        options={{
          title: "Add address",
        }}
      />
      <Stack.Screen
        name="user/edit-address/[id]"
        options={{
          title: "Edit address",
        }}
      />
      <Stack.Screen
        name="user/addresses"
        options={{
          title: "All address",
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  );
}
export default function Layout() {
  const appState = useRef(AppState.currentState);
  const [lockState, setLockState] = useState<"locked" | "unlocked">("locked");

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => subscription.remove();
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    // Ignore state changes while authenticating
    if (isAuthenticating) {
      appState.current = nextAppState;
      return;
    }

    if (
      appState.current === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      setLockState("locked");
    }

    appState.current = nextAppState;
  };

  const authenticate = async () => {
    if (isAuthenticating) return;

    setIsAuthenticating(true);

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Unlock App",
      fallbackLabel: "Use Passcode",
      disableDeviceFallback: false,
    });

    console.log("result >>>>>", result);

    if (result.success) {
      setLockState("unlocked");
    } else {
      setLockState("locked");
    }

    setIsAuthenticating(false);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Context>
        {lockState === "locked" ? (
          <LockScreen onUnlock={authenticate} />
        ) : (
          <>
            <RootLayout />
            <StatusBar style="auto" />
          </>
        )}
      </Context>
    </GestureHandlerRootView>
  );
}
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
function BackButton() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.back()}
      className="flex flex-row items-center gap-2 px-1"
    >
      <Ionicons name="chevron-back" size={22} color={"black"} />
      <Text className="text-lg">Back</Text>
    </Pressable>
  );
}

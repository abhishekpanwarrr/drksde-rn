import Context from "@/context/context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Context>
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
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </Context>
    </GestureHandlerRootView>
  );
}

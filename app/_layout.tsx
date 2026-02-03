import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <>
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
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

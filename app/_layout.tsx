import Context from "@/context/context";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import "../global.css";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Context>
        <RootLayout />
        <StatusBar style="auto" />
      </Context>
    </GestureHandlerRootView>
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

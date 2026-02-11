import { onAuthenticate } from "@/services/authService";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";

export default function App() {
  return (
    <View className="flex-1 p-5">
      <Text className="text-xl font-semibold text-black">Secure Vault</Text>
      <TouchableOpacity
        className="text-center text-white bg-black px-3 mx-10"
        onPress={handleLogin}
      ></TouchableOpacity>
    </View>
  );
}

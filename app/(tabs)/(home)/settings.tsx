import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const user = {
    name: "Abhishek Panwar",
    email: "abhishekpanwarcse@gmail.com",
    avatar:
      "https://ui-avatars.com/api/?name=Abhishek+Panwar&background=0D8ABC&color=fff",
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-neutral-100">
      {/* PROFILE CARD */}
      <View className="mx-4 bg-white rounded-2xl p-4 shadow-sm elevation-3">
        {isLoggedIn ? (
          <View className="flex-row items-center">
            <Image
              source={{ uri: user.avatar }}
              className="w-16 h-16 rounded-full"
            />

            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-neutral-900">
                {user.name}
              </Text>
              <Text className="text-sm text-neutral-500">{user.email}</Text>
            </View>
          </View>
        ) : (
          <View className="items-center py-6">
            <Ionicons name="person-circle-outline" size={64} color="#9ca3af" />
            <Text className="mt-2 text-neutral-600">You are not logged in</Text>
          </View>
        )}
      </View>

      {/* LOGGED-IN ACTIONS */}
      {isLoggedIn && (
        <View className="mt-6 mx-4 bg-white rounded-2xl shadow-sm elevation-3 overflow-hidden">
          <SettingRow
            icon="receipt-outline"
            label="My Orders"
            onPress={() => router.push("/")}
          />
          <Divider />
          <SettingRow
            icon="wallet-outline"
            label="Transactions"
            onPress={() => router.push("/")}
          />
        </View>
      )}

      {/* AUTH ACTION */}
      <View className="mt-6 mx-4">
        {isLoggedIn ? (
          <Pressable
            onPress={() => setIsLoggedIn(false)}
            className="bg-red-500 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-base">Logout</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setIsLoggedIn(true)}
            className="bg-black py-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-base">Login</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Settings;

const SettingRow = ({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} className="flex-row items-center px-4 py-4">
    <Ionicons name={icon} size={22} color="#111827" />
    <Text className="ml-4 text-base text-neutral-900 flex-1">{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
  </Pressable>
);

const Divider = () => <View className="h-px bg-neutral-200 mx-4" />;

import { useUser } from "@/context/user-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext } from "react";
import { BiometricContext } from "@/context/biometric-context";
import { Switch } from "react-native";

const Settings = () => {
  const router = useRouter();
  const { enabled, enableBiometric, disableBiometric } =
    useContext(BiometricContext);

  const {
    state: { user },
    dispatch,
  } = useUser();

  const handleEnableBiomatric = async (value: any) => {
    console.log("value", value);

    if (value) {
      const success = await enableBiometric();
      if (!success) return;
    } else {
      await disableBiometric();
    }
  };
  const handleLogout = () => {
    dispatch({
      type: "LOGOUT",
    });
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-neutral-100">
      {/* PROFILE CARD */}
      <View className="mx-4 bg-white rounded-2xl p-4 shadow-xs elevation-3 mt-7">
        {user ? (
          <View className="flex-row items-center">
            {/* <Image source={{ uri: user?.avatar }} className="w-16 h-16 rounded-full" /> */}
            <UserAvatar name={user?.name} avatar={user?.avatar} size={60} />
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-neutral-900">
                {user?.name}
              </Text>
              <Text className="text-sm text-neutral-500">{user?.email}</Text>
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
      {user && (
        <View className="mt-6 mx-4 bg-white rounded-2xl shadow-sm elevation-3 overflow-hidden">
          <SettingRow
            icon="receipt-outline"
            label="My Orders"
            onPress={() => router.push("/user/orders")}
          />
          <Divider />
          <SettingRow
            icon="wallet-outline"
            label="Transactions"
            onPress={() => router.push("/")}
          />
          <SettingRow
            icon="wallet-outline"
            label="Addresses"
            onPress={() => router.push("/user/addresses")}
          />
        </View>
      )}

      {/* AUTH ACTION */}
      <View className="mt-6 mx-4">
        {user ? (
          <Pressable
            onPress={() => handleLogout()}
            className="bg-red-500 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-base">Logout</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.push("/auth/login")}
            className="bg-black py-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-base">Login</Text>
          </Pressable>
        )}
      </View>
      {/* BIOMETRIC */}
      {user && (
        <View className="mt-6 mx-4 bg-white rounded-2xl shadow-sm elevation-3 overflow-hidden">
          <View className="flex-row items-center px-4 py-4">
            <Ionicons name="finger-print-outline" size={22} color="#111827" />
            <Text className="ml-4 text-base flex-1">
              Enable Face ID / Fingerprint
            </Text>

            <Switch
              value={enabled}
              onValueChange={async (value) => handleEnableBiomatric(value)}
            />
          </View>
        </View>
      )}
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

type Props = {
  name?: string | null;
  avatar?: string | null;
  size?: number;
};

const pastelColors = [
  "#FADADD", // pink
  "#E6E6FA", // lavender
  "#DFF5EA", // mint
  "#FFF1C1", // yellow
  "#E0F2FE", // blue
  "#FDE2E4", // rose
  "#EDE9FE", // violet
  "#ECFDF3", // green
];

function getPastelColor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return pastelColors[Math.abs(hash) % pastelColors.length];
}

export function UserAvatar({ name, avatar, size = 64 }: Props) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() ?? "?";
  const bgColor = getPastelColor(name || "guest");

  if (avatar) {
    return (
      <Image
        source={{ uri: avatar }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#111",
          fontSize: size / 2,
          fontWeight: "700",
        }}
      >
        {initial}
      </Text>
    </View>
  );
}

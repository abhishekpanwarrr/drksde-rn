import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function OrderSuccess() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold mb-2">🎉 Order Placed</Text>
      <Text className="text-gray-500 mb-6">Order ID: {orderId}</Text>

      <Pressable onPress={() => router.replace("/")} className="bg-black px-6 py-3 rounded-xl">
        <Text className="text-white">Continue Shopping</Text>
      </Pressable>
    </View>
  );
}

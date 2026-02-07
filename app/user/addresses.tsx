import { apiRequest } from "@/utils/api";
import { useFocusEffect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

export default function Addresses() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const router = useRouter();

  const loadAddresses = async () => {
    const res = await apiRequest("/addresses/my");
    setAddresses(res.data);
  };

  useEffect(() => {
    loadAddresses();
  }, []);
  useFocusEffect(() => {
    loadAddresses();
  });

  const deleteAddress = (id: number) => {
    Alert.alert("Delete address?", "This cannot be undone", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await apiRequest(`/addresses/${id}`, { method: "DELETE" });
          loadAddresses();
        },
      },
    ]);
  };

  const makeDefault = (addressId: number) => {
    Alert.alert(
      "Make default address?",
      "This address will be used for checkout",
      [
        { text: "Cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await apiRequest(`/addresses/${addressId}/default`, {
                method: "PATCH",
              });
              loadAddresses();
            } catch (err) {
              Alert.alert("Failed to update address");
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView className="flex-1 bg-white px-4">
      <Text className="text-2xl font-bold my-4">My Addresses</Text>

      {addresses.map((addr) => (
        <Pressable
          key={addr.address_id}
          onPress={() => {
            if (!addr.is_default) {
              makeDefault(addr.address_id);
            }
          }}
          className={`border rounded-xl p-4 mb-4 ${
            addr.is_default ? "border-black bg-gray-50" : "border-gray-200"
          }`}
        >
          <View className="flex-row justify-between mb-1">
            <Text className="font-semibold">
              {addr.name} • {addr.type.toUpperCase()}
            </Text>
            {addr.is_default && (
              <Text className="text-xs text-green-600 font-semibold">
                DEFAULT
              </Text>
            )}
          </View>

          <Text className="text-gray-600">{addr.address_line}</Text>
          <Text className="text-gray-600">
            {addr.city}, {addr.state} - {addr.pincode}
          </Text>
          <Text className="text-gray-600">📞 {addr.phone}</Text>

          <View className="flex-row justify-end mt-3">
            <Pressable
              onPress={() =>
                router.push(`/user/edit-address/${addr.address_id}`)
              }
              className="mr-4"
            >
              <Text className="text-blue-600 font-semibold">Edit</Text>
            </Pressable>

            <Pressable onPress={() => deleteAddress(addr.address_id)}>
              <Text className="text-red-600 font-semibold">Delete</Text>
            </Pressable>
          </View>
        </Pressable>
      ))}

      <Pressable
        onPress={() => router.push("/user/add-address")}
        className="border border-dashed border-gray-400 p-4 rounded-xl"
      >
        <Text className="text-center text-gray-600">+ Add New Address</Text>
      </Pressable>
    </ScrollView>
  );
}

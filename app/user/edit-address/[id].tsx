import { apiRequest } from "@/utils/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EditAddress() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"home" | "work">("home");
  const [isDefault, setIsDefault] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🔹 Fetch address
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await apiRequest("/addresses/my");
        const addr = res.data.find((a: any) => a.address_id === Number(id));

        if (!addr) {
          Alert.alert("Address not found");
          router.back();
          return;
        }

        setForm({
          name: addr.name,
          phone: addr.phone,
          address_line: addr.address_line,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
        });

        setType(addr.type);
        setIsDefault(addr.is_default);
      } catch (err) {
        console.error("FETCH ADDRESS ERROR:", err);
        Alert.alert("Failed to load address");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [id]);

  // 🔹 Save update
  const updateAddress = async () => {
    const { name, phone, address_line, city, state, pincode } = form;

    if (!name || !phone || !address_line || !city || !state || !pincode) {
      Alert.alert("All fields are required");
      return;
    }

    try {
      await apiRequest(`/addresses/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          type,
          is_default: isDefault,
        }),
      });

      Alert.alert("Address updated successfully");
      router.back();
    } catch (err) {
      console.error("UPDATE ADDRESS ERROR:", err);
      Alert.alert("Failed to update address");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4">
      <Text className="text-2xl font-bold my-4">Edit Address</Text>

      <Input
        label="Full Name"
        value={form.name}
        onChangeText={(v: any) => updateField("name", v)}
      />

      <Input
        label="Phone Number"
        keyboardType="phone-pad"
        value={form.phone}
        onChangeText={(v: any) => updateField("phone", v)}
      />

      <Input
        label="Address"
        multiline
        value={form.address_line}
        onChangeText={(v: any) => updateField("address_line", v)}
      />

      <Input
        label="City"
        value={form.city}
        onChangeText={(v: any) => updateField("city", v)}
      />

      <Input
        label="State"
        value={form.state}
        onChangeText={(v: any) => updateField("state", v)}
      />

      <Input
        label="Pincode"
        keyboardType="number-pad"
        value={form.pincode}
        onChangeText={(v: any) => updateField("pincode", v)}
      />

      {/* TYPE */}
      <View className="flex-row mt-4">
        {["home", "work"].map((t) => (
          <Pressable
            key={t}
            onPress={() => setType(t as any)}
            className={`flex-1 py-3 mr-2 rounded-xl border ${
              type === t ? "bg-black border-black" : "border-gray-300"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                type === t ? "text-white" : "text-gray-700"
              }`}
            >
              {t.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* DEFAULT */}
      <Pressable
        onPress={() => setIsDefault(!isDefault)}
        className="flex-row items-center mt-4"
      >
        <View
          className={`w-5 h-5 mr-3 rounded border ${
            isDefault ? "bg-black border-black" : "border-gray-400"
          }`}
        />
        <Text className="text-gray-700">Set as default address</Text>
      </Pressable>

      <Pressable
        onPress={updateAddress}
        className="bg-black py-4 rounded-xl items-center mt-6"
      >
        <Text className="text-white text-lg font-semibold">Update Address</Text>
      </Pressable>
    </ScrollView>
  );
}

function Input({ label, ...props }: { label: string; [key: string]: any }) {
  return (
    <View className="mb-4">
      <Text className="text-sm text-neutral-600 mb-1">{label}</Text>
      <TextInput
        className="border border-neutral-300 rounded-xl px-4 py-3 text-base"
        {...props}
      />
    </View>
  );
}

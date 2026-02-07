import { apiRequest } from "@/utils/api";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
type AddressForm = {
  name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  type: "home" | "work";
  is_default: boolean;
};

export default function AddAddress() {
  const router = useRouter();
  const [form, setForm] = useState<AddressForm>({
    name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    type: "home", // ✅ new
    is_default: false, // ✅ new
  });
  const ADDRESS_TYPES: Array<"home" | "work"> = ["home", "work"];

  const updateField = <K extends keyof AddressForm>(
    key: K,
    value: AddressForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const saveAddress = async () => {
    const { name, phone, address_line, city, state, pincode } = form;

    if (!name || !phone || !address_line || !city || !state || !pincode) {
      Alert.alert("All fields are required");
      return;
    }

    if (phone.length !== 10) {
      Alert.alert("Enter a valid 10-digit phone number");
      return;
    }

    if (pincode.length !== 6) {
      Alert.alert("Enter a valid 6-digit pincode");
      return;
    }

    try {
      await apiRequest("/addresses", {
        method: "POST",
        body: JSON.stringify(form),
      });

      Alert.alert("Address added successfully");
      router.back(); // 🔁 go back to checkout
    } catch (err) {
      console.error("ADD ADDRESS ERROR:", err);
      Alert.alert("Failed to save address");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4">
      <Text className="text-2xl font-bold my-4">Add Address</Text>

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
      <View className="flex-row mt-4">
        {ADDRESS_TYPES.map((t) => (
          <Pressable
            key={t}
            onPress={() => updateField("type", t)}
            className={`flex-1 py-3 mr-2 rounded-xl border ${
              form.type === t ? "bg-black border-black" : "border-gray-300"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                form.type === t ? "text-white" : "text-gray-700"
              }`}
            >
              {t.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={() => updateField("is_default", !form?.is_default)}
        className="flex-row items-center mt-4"
      >
        <View
          className={`w-5 h-5 mr-3 rounded border ${
            form.is_default ? "bg-black border-black" : "border-gray-400"
          }`}
        />
        <Text className="text-gray-700">Set as default address</Text>
      </Pressable>

      <Pressable
        onPress={saveAddress}
        className="bg-black py-4 rounded-xl items-center mt-6"
      >
        <Text className="text-white text-lg font-semibold">Save Address</Text>
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

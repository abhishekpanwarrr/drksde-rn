import { useCart } from "@/context/cart-context";
import { useUser } from "@/context/user-context";
import { apiRequest } from "@/utils/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

export default function Checkout() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  const { state, dispatch } = useCart();
  const router = useRouter();
  const {
    state: { user },
  } = useUser();
  const total = state.items.reduce((sum, item) => {
    const price = item.product.sale_price ?? item.product.base_price;
    return sum + Number(price) * item.quantity;
  }, 0);

  const placeOrder = async () => {
    if (!user?.user_id) {
      Alert.alert("Please login before placing order");
      return;
    }
    if (!selectedAddressId) {
      Alert.alert("Please select a delivery address");
      return;
    }

    const payload = {
      items: state.items.map((i) => ({
        product_id: i.product.product_id,
        quantity: i.quantity,
        price: i.product.sale_price ?? i.product.base_price,
      })),
      addressId: selectedAddressId,
      paymentMethod: "COD",
    };

    try {
      const res = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      dispatch({ type: "CLEAR" });
      router.replace(`/checkout/order-success?orderId=${res.order_id}`);
    } catch (err) {
      console.error("PLACE ORDER ERROR:", err);
    }
  };
  const fetchAddresses = async () => {
    const res = await apiRequest("/addresses/my");
    setAddresses(res.data);
    if (res.data.length > 0) {
      setSelectedAddressId(res.data[0].address_id);
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, []);
  useFocusEffect(() => {
    fetchAddresses();
  });
  return (
    <ScrollView className="flex-1 bg-white px-4">
      <Text className="text-2xl font-bold my-4">Checkout</Text>
      <Text className="text-xl font-bold mt-6 mb-3">Delivery Address</Text>
      <View className="pb-10">
        {addresses.length === 0 ? (
          <Pressable
            onPress={() => router.push("/user/add-address")}
            className="border border-dashed border-gray-400 p-4 rounded-xl"
          >
            <Text className="text-center text-gray-600">+ Add New Address</Text>
          </Pressable>
        ) : (
          addresses.map((addr) => (
            <Pressable
              key={addr.address_id}
              onPress={() => setSelectedAddressId(addr.address_id)}
              className={`p-4 mb-3 rounded-xl border ${
                selectedAddressId === addr.address_id
                  ? "border-black bg-gray-100"
                  : "border-gray-200"
              }`}
            >
              <Text className="font-semibold">{addr.name}</Text>
              <Text className="text-gray-600">{addr.address_line}</Text>
              <Text className="text-gray-600">
                {addr.city}, {addr.state} - {addr.pincode}
              </Text>
              <Text className="text-gray-600">📞 {addr.phone}</Text>
            </Pressable>
          ))
        )}
      </View>
      {state.items.map(({ product, quantity }) => (
        <View key={product.product_id} className="mb-3">
          <Text className="font-semibold">{product.name}</Text>
          <Text>Qty: {quantity}</Text>
        </View>
      ))}

      <View className="mt-4">
        <Text className="text-lg font-bold">Total: ₹{total.toFixed(2)}</Text>
      </View>

      <Pressable
        onPress={placeOrder}
        className="bg-black py-4 rounded-xl items-center mt-6"
      >
        <Text className="text-white text-lg font-semibold">
          Place Order (Cash on Delivery)
        </Text>
      </Pressable>
    </ScrollView>
  );
}

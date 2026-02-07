import { Order } from "@/types/orders";
import { apiRequest } from "@/utils/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiRequest("/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error("FETCH ORDERS ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">No orders yet</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-neutral-50 px-4" showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-bold my-5 text-neutral-900">My Orders</Text>

      {orders.map((order) => {
        const statusColor =
          order.order_status === "placed"
            ? "bg-blue-100 text-blue-700"
            : order.order_status === "delivered"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700";

        return (
          <View
            key={order.order_id}
            className="mb-6 bg-white rounded-2xl shadow-sm border border-neutral-200"
          >
            {/* HEADER */}
            <View className="px-4 py-3 border-b border-neutral-200 flex-row justify-between items-center">
              <View>
                <Text className="text-sm text-neutral-500">Order #{order.order_id}</Text>
                <Text className="text-xs text-neutral-400 mt-0.5">
                  {new Date(order.created_at).toDateString()}
                </Text>
              </View>

              <View className={`px-3 py-1 rounded-full ${statusColor}`}>
                <Text className="text-xs font-semibold capitalize">{order.order_status}</Text>
              </View>
            </View>

            {/* PAYMENT INFO */}
            <View className="px-4 py-2 bg-neutral-50">
              <Text className="text-xs text-neutral-600">
                Payment:{" "}
                <Text className="font-medium text-neutral-800">{order.payment_method}</Text> (
                {order.payment_status})
              </Text>
            </View>

            {/* ITEMS */}
            <View className="px-4 py-3">
              {order.items.map((item, idx) => (
                <View key={idx} className="flex-row mb-4 last:mb-0">
                  <Image
                    source={{
                      uri: item.image || "https://picsum.photos/200",
                    }}
                    className="w-16 h-16 rounded-xl bg-neutral-200"
                  />

                  <View className="ml-3 flex-1 justify-between">
                    <Text numberOfLines={2} className="text-sm font-semibold text-neutral-900">
                      {item.name}
                    </Text>

                    <View className="flex-row justify-between items-center mt-1">
                      <Text className="text-xs text-neutral-500">Qty: {item.quantity}</Text>

                      <Text className="text-sm font-semibold text-neutral-900">₹{item.price}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* TOTAL */}
            <View className="px-4 py-3 border-t border-neutral-200 bg-neutral-50 flex-row justify-between">
              <Text className="text-sm text-neutral-600">Order Total</Text>
              <Text className="text-base font-bold text-neutral-900">₹{order.total_amount}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

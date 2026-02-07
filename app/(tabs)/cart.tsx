import { useCart } from "@/context/cart-context";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const router = useRouter();

  const { state, dispatch } = useCart();
  if (!state.hydrated) {
    return null; // or loader
  }

  if (state.items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Your cart is empty</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 bg-white px-4">
        <Text className="text-2xl font-bold my-4">Cart</Text>

        {state.items.map(({ product, quantity }) => {
          const price = product.sale_price ?? product.base_price;

          return (
            <View
              key={product.product_id}
              className="flex-row items-center mb-4 bg-gray-100 rounded-xl p-3"
            >
              <Image
                source={{
                  uri: product.primary_image || "https://picsum.photos/200",
                }}
                className="w-20 h-20 rounded-lg"
              />

              <View className="flex-1 ml-3">
                <Text numberOfLines={2} className="font-semibold">
                  {product.name}
                </Text>

                <Text className="text-gray-500 mt-1">₹{price}</Text>

                {/* Quantity */}
                <View className="flex-row items-center mt-2">
                  <Pressable
                    onPress={() =>
                      dispatch({
                        type: "DECREMENT",
                        productId: product.product_id,
                      })
                    }
                    className="px-3 py-1 bg-gray-300 rounded-lg"
                  >
                    <Text>-</Text>
                  </Pressable>

                  <Text className="mx-3">{quantity}</Text>

                  <Pressable
                    onPress={() =>
                      dispatch({
                        type: "INCREMENT",
                        productId: product.product_id,
                      })
                    }
                    className="px-3 py-1 bg-gray-300 rounded-lg"
                  >
                    <Text>+</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                onPress={() =>
                  dispatch({
                    type: "REMOVE",
                    productId: product.product_id,
                  })
                }
              >
                <Text className="text-red-500 font-bold">✕</Text>
              </Pressable>
            </View>
          );
        })}
        <View className="mt-6 mb-10">
          <Pressable
            onPress={() => router.push("/checkout/checkout")}
            className="bg-black py-4 rounded-xl items-center"
          >
            <Text className="text-white text-lg font-semibold">Proceed to Checkout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

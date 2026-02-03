import { products } from "@/data/products";
import { useLocalSearchParams } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function ModalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === Number(id));
  if (!product) return null;

  return (
    <View className="flex-1 bg-white">
      {/* Image */}
      <Image
        source={{ uri: product.image }}
        className="w-full h-[55%]"
        resizeMode="cover"
      />

      {/* Content */}
      <View className="flex-1 rounded-t-3xl bg-white -mt-6 px-5 pt-6">
        <Text className="text-2xl font-bold text-neutral-900">
          {product.name}
        </Text>

        <Text className="text-xl font-semibold text-green-600 mt-2">
          {product.price}
        </Text>

        <Text className="text-sm text-neutral-500 mt-3 leading-5">
          Premium quality cotton t-shirt with a relaxed fit. Perfect for daily
          wear and casual outings.
        </Text>

        {/* CTA */}
        <Pressable className="mt-8 bg-black py-4 rounded-xl items-center">
          <Text className="text-white text-base font-semibold">
            Add to Cart
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

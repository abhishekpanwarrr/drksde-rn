import { Product } from "@/types/data";
import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface ProductCardProps {
  item: Product;
  onPress?: () => void;
}

export default function ProductCard({ item, onPress }: ProductCardProps) {
  const imageUrl =
    item.primary_image || item.images?.[0]?.image_url || "https://picsum.photos/600/600";

  const price = item.sale_price ?? item.base_price;
  return (
    <Link href={`/product/${item.product_id}`} asChild>
      <Pressable
        onPress={onPress} // ✅ safe
        className="flex-row mb-4 bg-gray-100 rounded-xl overflow-hidden"
      >
        <Image source={{ uri: imageUrl }} className="w-24 h-24" />

        <View className="flex-1 px-3 py-2">
          <Text numberOfLines={2} className="text-base font-semibold">
            {item.name}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">₹{price}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

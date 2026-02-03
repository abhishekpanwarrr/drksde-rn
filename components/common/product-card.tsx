import { HighlightedText } from "@/app/(tabs)/search";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ProductCard({ item, saveRecentSearch, debouncedQuery }: any) {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="flex-row mb-4 bg-gray-100 rounded-xl overflow-hidden"
      onPress={() => {
        router.push(`/product/${item.id}`);
        saveRecentSearch(debouncedQuery);
      }}
    >
      <Image source={{ uri: item.image }} className="w-24 h-24" />

      <View className="flex-1 px-3 py-2">
        <HighlightedText text={item.name} highlight={debouncedQuery} />

        <Text className="text-sm text-gray-500 capitalize mt-1">{item.category}</Text>

        <Text className="text-base font-bold mt-2">{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

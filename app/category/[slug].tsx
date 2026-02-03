import { categories, products } from "@/data/products";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CategoryWithId = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const category = categories.find((c) => c.slug === slug);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.category.toLowerCase() === slug?.toLowerCase());
  }, [slug]);

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      {/* Header */}
      <Text className="text-xl font-bold mb-4">{category?.title ?? "Category"}</Text>

      {filteredProducts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">No products found in this category</Text>
        </View>
      ) : (
        <FlashList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row mb-4 bg-gray-100 rounded-xl overflow-hidden"
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <Image source={{ uri: item.image }} className="w-24 h-24" />

              <View className="flex-1 px-3 py-2">
                <Text numberOfLines={2} className="font-semibold text-base">
                  {item.name}
                </Text>
                <Text className="text-gray-500 text-sm capitalize mt-1">{item.category}</Text>
                <Text className="font-bold mt-2">{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default CategoryWithId;

import { Product } from "@/types/data";
import { apiRequest } from "@/utils/api";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

const PLACEHOLDER_IMAGE = "https://picsum.photos/600/600";

const NewArriavals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await apiRequest("/products/featured");
        setProducts(data);
      } catch (err) {
        console.error("FETCH PRODUCT ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  if (products.length === 0) return null;
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="bg-gray-200 py-5 rounded-2xl mx-3 mb-6 ">
      <Text className="text-xl font-bold mx-4 mb-3 text-neutral-900">New arrivals</Text>
      <FlashList
        data={products}
        horizontal
        style={{ height: 260 }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item?.product_id?.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => <ProductCard item={item} />}
      />
    </View>
  );
};

export default NewArriavals;

const ProductCard: FC<ProductCardProps> = ({ item }) => {
  const router = useRouter();

  const imageUrl = item.primary_image || item.images?.[0]?.image_url || PLACEHOLDER_IMAGE;

  const price = item.sale_price ?? item.base_price;

  return (
    <Pressable
      onPress={() => router.push(`/product/${item.product_id}`)}
      className="w-[65vw] mr-4 bg-white rounded-2xl overflow-hidden elevation-3"
    >
      <Image source={{ uri: imageUrl }} style={{ width: "100%", height: 180 }} resizeMode="cover" />

      <View className="p-3">
        <Text className="text-base font-semibold text-neutral-900">{item.name}</Text>
        <Text className="mt-1 text-sm text-neutral-600">₹{price}</Text>
      </View>
    </Pressable>
  );
};

interface ProductCardProps {
  item: Product;
}

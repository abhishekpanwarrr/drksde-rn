import { Product } from "@/types/data";
import { apiRequest } from "@/utils/api";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { FC, useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

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
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  if (products.length === 0) return null;
  const listData = loading ? Array.from({ length: 4 }) : products;
  return (
    <View className="bg-gray-200 py-5 rounded-2xl mx-3 mb-6 ">
      <Text className="text-xl font-bold mx-4 mb-3 text-neutral-900">New arrivals</Text>
      <FlashList
        data={listData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => <ProductCard loading={loading} item={item as Product} />}
      />
    </View>
  );
};

export default NewArriavals;

const skeletonCommonProps = {
  colorMode: "light",
  backgroundColor: "#d4d4d4",
  transition: {
    type: "timing",
    duration: 2000,
  },
} as const;

const ProductCard: FC<ProductCardProps> = ({ item, loading }) => {
  const router = useRouter();

  if (loading) {
    return (
      <View className="w-[65vw] mr-4 bg-white rounded-2xl overflow-hidden elevation-3">
        <Skeleton.Group show>
          <Skeleton height={180} width="100%" radius="square" {...skeletonCommonProps} />
          <View className="p-3 gap-2">
            <Skeleton height={20} width="90%" radius="square" {...skeletonCommonProps} />
            <Skeleton height={16} width="60%" radius="square" {...skeletonCommonProps} />
          </View>
        </Skeleton.Group>
      </View>
    );
  }

  const imageUrl = item.primary_image || item.images?.[0]?.image_url || PLACEHOLDER_IMAGE;

  const price = item.sale_price ?? item.base_price;

  return (
    <Pressable
      onPress={() => router.push(`/product/${item.product_id}`)}
      className="w-[65vw] mr-4 bg-white rounded-2xl overflow-hidden elevation-3"
    >
      <Image source={{ uri: imageUrl }} style={{ width: "100%", height: 180 }} />
      <View className="p-3">
        <Text className="text-base font-semibold text-neutral-900">{item.name}</Text>
        <Text className="mt-1 text-sm text-neutral-600">₹{price}</Text>
      </View>
    </Pressable>
  );
};

interface ProductCardProps {
  item: Product;
  loading: boolean;
}

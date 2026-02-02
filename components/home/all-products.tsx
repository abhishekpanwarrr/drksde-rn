import { products } from "@/data/products";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { FC } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";

const GAP = 16;
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - GAP * 3) / 2;

const AllProducts = () => {
  return (
    <View className="flex-1">
      <FlashList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        // estimatedItemSize={260}
        contentContainerStyle={{
          paddingHorizontal: GAP,
          paddingBottom: GAP,
        }}
        // @ts-ignore
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        renderItem={({ item }) => (
          <View style={{ width: CARD_WIDTH, marginBottom: GAP }}>
            <Product item={item} />
          </View>
        )}
      />
    </View>
  );
};

export default AllProducts;

export const Product: FC<ProductProps> = ({ item }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/modal/${item.id}`)}
      className="bg-white rounded-2xl overflow-hidden elevation-3"
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: "100%", height: 180 }}
        resizeMode="cover"
      />

      {/* FIXED HEIGHT CONTENT */}
      <View className="p-3 min-h-[72px] justify-between">
        <Text
          numberOfLines={2} // ✅ CLAMP TEXT
          ellipsizeMode="tail"
          className="text-base font-semibold text-neutral-900"
        >
          {item.name}
        </Text>

        <Text className="mt-1 text-sm text-neutral-600">{item.price}</Text>
      </View>
    </Pressable>
  );
};

interface ProductProps {
  item: { id: number; name: string; price: string; image: string };
}

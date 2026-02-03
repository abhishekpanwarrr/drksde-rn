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
        contentContainerStyle={{
          paddingHorizontal: GAP,
          paddingBottom: GAP,
        }}
        renderItem={({ item, index }) => (
          <View style={{ width: CARD_WIDTH, marginBottom: GAP }}>
            <Product item={item} index={index} />
          </View>
        )}
      />
    </View>
  );
};

export default AllProducts;

export const Product: FC<ProductProps> = ({ item, index }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/product/${item.id}`)}
      className={`bg-white rounded-2xl overflow-hidden elevation-3 ${index % 2 !== 1 && "mr-2"}`}
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
  index: number;
}

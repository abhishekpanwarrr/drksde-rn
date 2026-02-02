import { products } from "@/data/products";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { FC } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.65;

const NewArriavals = () => {
  return (
    <View className="bg-white py-5 rounded-2xl mx-3 mb-6 shadow-sm">
      <Text className="text-xl font-bold mx-4 mb-3 text-neutral-900">
        New arrivals
      </Text>
      <FlashList
        data={products}
        horizontal
        style={{ height: 260 }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => <Product item={item} />}
      />
    </View>
  );
};

export default NewArriavals;

export const Product: FC<ProductProps> = ({ item }) => {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/modal/${item.id}`)}
      className="w-[65vw] mr-4 bg-white rounded-2xl overflow-hidden elevation-3"
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: "100%", height: 180 }}
        resizeMode="cover"
      />

      <View className="p-3">
        <Text className="text-base font-semibold text-neutral-900">
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

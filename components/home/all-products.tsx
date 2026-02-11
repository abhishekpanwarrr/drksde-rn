import { Product } from "@/types/data";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { FC } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";

const GAP = 16;
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - GAP * 3) / 2;
const PLACEHOLDER_IMAGE = "https://picsum.photos/600/600";

interface Props {
  products: Product[];
}

const AllProducts: FC<Props> = ({ products }) => {
  return (
    <View className="flex-1">
      <FlashList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item?.product_id?.toString()}
        contentContainerStyle={{
          paddingHorizontal: GAP,
          paddingBottom: GAP,
        }}
        renderItem={({ item, index }) => (
          <View style={{ width: CARD_WIDTH, marginBottom: GAP }}>
            <ProductCard item={item} index={index} />
          </View>
        )}
      />
    </View>
  );
};

export default AllProducts;

export const ProductCard: FC<ProductCardProps> = ({ item, index }) => {
  const router = useRouter();
  const imageUrl =
    item.primary_image || item.images?.[0]?.image_url || PLACEHOLDER_IMAGE;

  const price = Number(item.sale_price ?? item.base_price);

  return (
    <Pressable
      onPress={() => router.push(`/product/${item.product_id}`)}
      className={`bg-white rounded-2xl overflow-hidden elevation-3 ${
        index % 2 === 0 ? "mr-2" : ""
      }`}
    >
      <Image
        source={{ uri: imageUrl }}
        style={{ width: "100%", height: 180 }}
        resizeMode="cover"
      />

      <View className="p-3 min-h-[72px] justify-between">
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="text-base font-semibold text-neutral-900"
        >
          {item.name}
        </Text>

        <Text className="mt-1 text-sm text-neutral-600">
          ₹{price.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
};

interface ProductCardProps {
  item: Product;
  index: number;
}

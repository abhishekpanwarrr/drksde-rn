import { categories } from "@/data/products";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Dimensions, Pressable, Text, View } from "react-native";
const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 2;

const Category = () => {
  const router = useRouter();
  return (
    <View className="px-4 mt-6 flex-1">
      <Text className="text-xl font-bold mb-4 text-neutral-900">Categories</Text>
      <FlashList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item, index }) => {
          const isRight = index % 2 === 1;

          return (
            <Pressable
              style={{
                width: ITEM_WIDTH,
                marginRight: isRight ? 0 : 16,
              }}
              onPress={() => router.push(`/category/${item.slug}`)}
              className="mb-4 items-center bg-white rounded-2xl py-4 shadow-sm elevation-2"
            >
              <View className="bg-orange-500 p-4 rounded-xl mb-2">
                <Ionicons name={item.icon as any} size={26} color="#fff" />
              </View>

              <Text className="text-sm font-medium text-neutral-800">{item.title}</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default Category;

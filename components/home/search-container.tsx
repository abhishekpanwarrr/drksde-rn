import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const SearchContainer = () => {
  const router = useRouter();
  return (
    <View className="pt-4">
      <Pressable
        onPress={() => router.push("/(tabs)/search")}
        className="flex flex-row justify-center items-center py-4 px-3 bg-[#fafafa] mx-2 rounded-lg"
      >
        <Ionicons name="search" color={"gray"} size={18} className="mr-1" />
        <Text className="flex-1 text-gray-500">Search products...</Text>
      </Pressable>
    </View>
  );
};

export default SearchContainer;

const styles = StyleSheet.create({});

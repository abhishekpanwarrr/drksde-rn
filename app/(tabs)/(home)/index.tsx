import { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface Product {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    async function getData() {
      const response = await fetch("https://jsonplaceholder.typicode.com/photos");
      const data = await response.json();
      console.log("data", data);
      setProducts(data);
    }
    getData();
  }, []);
  return (
    <SafeAreaView edges={["left", "right", "bottom"]} className="flex-1 px-2">
      <Text className="text-black text-2xl bg-yellow-500 py-2 px-4 mt-5">Home</Text>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View key={item.id}>
            <Text>{item.id}</Text>
            <Image
              source={{
                uri: item.thumbnailUrl,
              }}
              className="w-64 h-64 object-cover"
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

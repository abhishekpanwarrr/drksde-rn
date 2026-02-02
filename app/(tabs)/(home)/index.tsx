import AllProducts from "@/components/home/all-products";
import Category from "@/components/home/category";
import NewArriavals from "@/components/home/new-arrivals";
import SearchContainer from "@/components/home/search-container";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 px-2">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <SearchContainer />
        {/* New arrivals */}
        <NewArriavals />
        {/* Categories */}
        <Category />
        <AllProducts />
      </ScrollView>
    </SafeAreaView>
  );
}

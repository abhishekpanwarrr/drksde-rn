import AllProducts from "@/components/home/all-products";
import Category from "@/components/home/category";
import NewArrivals from "@/components/home/new-arrivals";
import SearchContainer from "@/components/home/search-container";
import { useHomeData } from "@/hooks/useHomeData";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { newReleases, allProducts, loading } = useHomeData();

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 px-2">
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchContainer />
        {/* New arrivals */}
        <NewArrivals products={newReleases} loading={loading} />
        {/* Categories */}
        <Category />
        <AllProducts products={allProducts} />
      </ScrollView>
    </SafeAreaView>
  );
}

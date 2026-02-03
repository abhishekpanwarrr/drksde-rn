import ProductCard from "@/components/common/product-card";
import { products } from "@/data/products";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const DEBOUNCE_DELAY = 300;
const MAX_RECENT = 5;

const Search = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  /* ---------------- Debounce ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [query]);

  /* ---------------- Filter Logic ---------------- */
  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) return [];

    const q = debouncedQuery.toLowerCase();
    return products.filter(
      (item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q),
    );
  }, [debouncedQuery]);
  /* ---------------- Save Recent Search ---------------- */
  const saveRecentSearch = (text: string) => {
    if (!text) return;

    setRecentSearches((prev) => {
      const updated = [text, ...prev.filter((s) => s !== text)];
      return updated.slice(0, MAX_RECENT);
    });
  };

  /* ---------------- Render Product ---------------- */
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex-row mb-4 bg-gray-100 rounded-xl overflow-hidden"
      onPress={() => saveRecentSearch(debouncedQuery)}
    >
      <Image source={{ uri: item.image }} className="w-24 h-24" />

      <View className="flex-1 px-3 py-2">
        <Text numberOfLines={2} className="text-base font-semibold">
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500 capitalize mt-1">{item.category}</Text>
        <Text className="text-base font-bold mt-2">{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <KeyboardAvoidingView
        className="flex-1 px-4"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        {/* Search Input */}
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search products..."
          placeholderTextColor="#999"
          className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-4"
        />

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <View className="mb-4">
            <Text className="text-gray-500 mb-2">Recent searches</Text>
            <View className="flex-row flex-wrap gap-2">
              {recentSearches.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setQuery(item)}
                  className="bg-gray-200 px-3 py-1 rounded-full"
                >
                  <Text className="text-sm">{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* States */}
        {!debouncedQuery ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Start typing to search products</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">No products found</Text>
          </View>
        ) : (
          <FlashList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCard
                item={item}
                saveRecentSearch={saveRecentSearch}
                debouncedQuery={debouncedQuery}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Search;

type Props = {
  text: string;
  highlight: string;
};

export const HighlightedText = ({ text, highlight }: Props) => {
  if (!highlight) return <Text>{text}</Text>;

  const lowerText = text.toLowerCase();
  const lowerHighlight = highlight.toLowerCase();
  const index = lowerText.indexOf(lowerHighlight);

  if (index === -1) return <Text>{text}</Text>;

  const before = text.slice(0, index);
  const match = text.slice(index, index + highlight.length);
  const after = text.slice(index + highlight.length);

  return (
    <Text>
      {before}
      <Text className="bg-yellow-200 text-black font-semibold">{match}</Text>
      {after}
    </Text>
  );
};

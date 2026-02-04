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

import ProductCard from "@/components/common/product-card";
import { Product } from "@/types/data";
import { apiRequest } from "@/utils/api";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEBOUNCE_DELAY = 400;
const MAX_RECENT = 5;

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);

  /* ---------------- Debounced DB Search ---------------- */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        // cancel previous request
        abortController.current?.abort();
        abortController.current = new AbortController();

        setLoading(true);

        const { data } = await apiRequest(`/products/search?q=${encodeURIComponent(query)}`, {
          signal: abortController.current.signal,
        });

        setResults(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("SEARCH ERROR:", err);
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      abortController.current?.abort();
    };
  }, [query]);

  /* ---------------- Recent Searches ---------------- */
  const saveRecentSearch = (text: string) => {
    if (!text) return;

    setRecentSearches((prev) => {
      const updated = [text, ...prev.filter((s) => s !== text)];
      return updated.slice(0, MAX_RECENT);
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <KeyboardAvoidingView
        className="flex-1"
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
        {!query ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Start typing to search products</Text>
          </View>
        ) : loading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Searching…</Text>
          </View>
        ) : results.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">No products found</Text>
          </View>
        ) : (
          <FlashList
            data={results}
            // estimatedItemSize={100}
            keyExtractor={(item) => item.product_id.toString()}
            renderItem={({ item }) => (
              <ProductCard item={item} onPress={() => saveRecentSearch(query)} />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Search;

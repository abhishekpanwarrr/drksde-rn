import { Product } from "@/types/data";
import { apiRequest } from "@/utils/api";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
const PLACEHOLDER_IMAGE =
  "https://dummyimage.com/800x600/eeeeee/000000&text=Product+Image";

import { useCart } from "@/context/cart-context";

const Field = ({ label, value }: { label: string; value: any }) => (
  <View className="flex-row justify-between py-2 border-b border-neutral-100">
    <Text className="text-sm text-neutral-500">{label}</Text>
    <Text className="text-sm text-neutral-900 max-w-[60%] text-right">
      {value ?? "—"}
    </Text>
  </View>
);

export default function ModalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dispatch } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await apiRequest(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("FETCH PRODUCT ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) return null;

  const imageUrl =
    product?.primary_image ||
    product.images?.[0]?.image_url ||
    PLACEHOLDER_IMAGE;

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
    >
      {/* IMAGE */}
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-[280px]"
        resizeMode="cover"
        onError={(e) => {
          console.log("IMAGE LOAD ERROR:", e.nativeEvent.error);
        }}
      />

      {/* CONTENT */}
      <View className="px-4 pb-10">
        {/* Title */}
        <Text className="text-2xl font-bold text-neutral-900 mt-4">
          {product.name}
        </Text>

        <Text className="text-sm text-neutral-500 mt-1">
          SKU: {product.sku}
        </Text>

        {/* Price */}
        <View className="mt-4">
          <Text className="text-xl font-semibold text-green-600">
            ₹{product.sale_price ?? product.base_price}
          </Text>

          {product.sale_price && (
            <Text className="text-sm text-neutral-400 line-through">
              ₹{product.base_price}
            </Text>
          )}
        </View>

        {/* Short description */}
        <Text className="text-sm text-neutral-700 mt-4 leading-5">
          {product.short_description}
        </Text>

        {/* Long description */}
        <Text className="text-sm text-neutral-600 mt-3 leading-5">
          {product.long_description}
        </Text>

        {/* Stock */}
        <Text
          className={`mt-4 text-sm font-medium ${
            product.stock_quantity > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
        </Text>

        {/* DETAILS */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-neutral-900 mb-2">
            Product Details
          </Text>

          <Field label="Product ID" value={product.product_id} />
          <Field label="Slug" value={product.slug} />
          <Field label="Base Price" value={product.base_price} />
          <Field label="Sale Price" value={product.sale_price} />
          <Field label="Cost Price" value={product.cost_price} />
          <Field label="Stock Quantity" value={product.stock_quantity} />
          {/* <Field label="Low Stock Threshold" value={product.low_stock_threshold} /> */}
          <Field
            label="Is Featured"
            value={product.is_featured ? "Yes" : "No"}
          />
          <Field label="Is Active" value={product.is_active ? "Yes" : "No"} />
          <Field label="Weight" value={product.weight} />
          <Field label="Dimensions" value={product.dimensions} />
          <Field label="Tax Class" value={product.tax_class} />
          <Field label="Categories" value={product.categories} />

          <Field label="Brand ID" value={product.brand_id} />
          <Field label="Brand Name" value={product.brand_name} />
          <Field label="Brand Logo" value={product.brand_logo} />
          <Field label="Brand Description" value={product.brand_description} />

          {/* <Field label="Created At" value={product.created_at} />
          <Field label="Updated At" value={product.updated_at} /> */}
        </View>

        {/* Variants */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-neutral-900 mb-2">
            Variants
          </Text>

          {product.variants ? (
            <Text className="text-sm text-neutral-700">
              {JSON.stringify(product.variants, null, 2)}
            </Text>
          ) : (
            <Text className="text-sm text-neutral-500">
              No variants available
            </Text>
          )}
        </View>
        <Pressable
          onPress={() => {
            dispatch({ type: "ADD", product });
            Alert.alert("Item added in cart");
          }}
          className="mt-8 bg-black py-4 rounded-xl items-center"
        >
          <Text className="text-white text-base font-semibold">
            Add to Cart
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

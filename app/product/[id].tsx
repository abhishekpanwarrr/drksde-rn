import { Product } from "@/types/data";
import { apiRequest } from "@/utils/api";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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

const Field = ({ label, value }: { label: string; value: any }) => {
  let displayValue = "—";

  if (Array.isArray(value)) {
    displayValue = value.map((v) => v.name ?? JSON.stringify(v)).join(", ");
  } else if (typeof value === "object" && value !== null) {
    displayValue = JSON.stringify(value);
  } else if (value !== null && value !== undefined) {
    displayValue = String(value);
  }

  return (
    <View className="flex-row justify-between py-2 border-b border-neutral-100">
      <Text className="text-sm text-neutral-500">{label}</Text>
      <Text className="text-sm text-neutral-900 max-w-[60%] text-right">
        {displayValue}
      </Text>
    </View>
  );
};

export default function ModalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dispatch } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const displayPrice = useMemo(() => {
    if (!product) return 0;

    const basePrice = Number(product.sale_price ?? product.base_price) || 0;
    const adjustment = Number(selectedVariant?.price_adjustment ?? 0);

    return basePrice + adjustment;
  }, [product, selectedVariant]);

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

  useEffect(() => {
    if (product?.variants?.length) {
      const defaultVariant =
        product.variants.find((v) => v.is_default) || product.variants[0];

      setSelectedVariant(defaultVariant);
    }
  }, [product]);

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
            ₹{displayPrice.toFixed(2)}
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
            (selectedVariant?.stock_quantity ?? product.stock_quantity) > 0
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {(selectedVariant?.stock_quantity ?? product.stock_quantity) > 0
            ? "In Stock"
            : "Out of Stock"}
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
          <Field
            label="Categories"
            // @ts-ignore
            value={product?.categories?.map((c: any) => c.name).join(", ")}
          />

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
            <View className="gap-3">
              {product.variants.map((variant) => {
                const isSelected =
                  selectedVariant?.variant_id === variant.variant_id;

                return (
                  <Pressable
                    key={variant.variant_id}
                    onPress={() => setSelectedVariant(variant)}
                    className={`p-3 rounded-lg border ${
                      isSelected
                        ? "border-black bg-neutral-100"
                        : "border-neutral-200"
                    }`}
                  >
                    <View className="flex-row justify-between items-center">
                      <Text className="text-sm font-medium text-neutral-900">
                        SKU: {variant.sku}
                      </Text>

                      {variant.is_default && (
                        <Text className="text-xs text-green-600">Default</Text>
                      )}
                    </View>

                    <Text className="text-xs text-neutral-600 mt-1">
                      Stock: {variant.stock_quantity}
                    </Text>

                    {variant.price_adjustment !== 0 && (
                      <Text className="text-xs text-neutral-600 mt-1">
                        Price adjustment: ₹{variant.price_adjustment}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text className="text-sm text-neutral-500">
              No variants available
            </Text>
          )}
        </View>
        <Pressable
          disabled={(selectedVariant?.stock_quantity ?? 0) <= 0}
          onPress={() => {
            dispatch({
              type: "ADD",
              product: {
                ...product,
                selectedVariant,
                final_price: displayPrice,
              },
            });
            Alert.alert("Item added in cart");
          }}
          className={`mt-8 py-4 rounded-xl items-center ${
            (selectedVariant?.stock_quantity ?? 0) > 0
              ? "bg-black"
              : "bg-neutral-400"
          }`}
        >
          <Text className="text-white text-base font-semibold">
            Add to Cart
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export interface Product {
  product_id: number;
  primary_image?: string;
  name: string;
  slug: string;
  sku: string;

  short_description: string;
  long_description: string | null;

  base_price: string; // stored as string from API
  sale_price: string | null;
  cost_price: string | null;

  stock_quantity: number;
  low_stock_threshold: number;

  is_active: boolean;
  is_featured: boolean;

  brand_id: number | null;
  brand_name: string | null;
  brand_logo: string | null;
  brand_description: string | null;

  categories: string | null; // comma-separated category names (from SQL STRING_AGG)

  images: ProductImage[] | null;
  variants: ProductVariant[] | null;

  weight: string | null;
  dimensions: string | null;
  tax_class: string | null;

  created_at: string; // ISO date string
  updated_at: string;
}

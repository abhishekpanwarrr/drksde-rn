import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";
import { Product } from "@/types/data";

interface HomeData {
  newReleases: Product[];
  allProducts: Product[];
}

export function useHomeData() {
  const [data, setData] = useState<HomeData>({
    newReleases: [],
    allProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await apiRequest("/home");

        setData({
          newReleases: res.data.sections.newReleases.items,
          allProducts: res.data.sections.allProducts.items,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  return { ...data, loading, error };
}

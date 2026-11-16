import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product } from './types';
import { supabase } from './supabaseClient';
import { products as staticProducts, formatPrice, categories, getCategoryById } from './data';

type ProductsContextType = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  getBestsellers: () => Product[];
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

function mapDbProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    brand: row.brand as string,
    categoryId: row.category_id as string,
    price: row.price as number,
    oldPrice: (row.old_price as number) || undefined,
    image: row.image as string,
    rating: Number(row.rating) || 4.5,
    reviewCount: row.review_count as number,
    inStock: row.in_stock as boolean,
    isBestseller: row.is_bestseller as boolean,
    description: row.description as string,
    features: row.features as string[],
    specs: row.specs as { label: string; value: string }[],
  };
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      if (data && data.length > 0) {
        setProducts(data.map(mapDbProduct));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری محصولات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getProductByIdLocal = (id: string): Product | undefined =>
    products.find((p) => p.id === id);

  const getProductsByCategoryLocal = (categoryId: string): Product[] =>
    products.filter((p) => p.categoryId === categoryId);

  const getBestsellersLocal = (): Product[] =>
    products.filter((p) => p.isBestseller);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refresh: fetchProducts,
        getProductById: getProductByIdLocal,
        getProductsByCategory: getProductsByCategoryLocal,
        getBestsellers: getBestsellersLocal,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within ProductsProvider');
  return context;
}

export { formatPrice, categories, getCategoryById };

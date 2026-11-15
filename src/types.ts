export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isBestseller: boolean;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
};

export type CartItem = {
  productId: string;
  quantity: number;
};

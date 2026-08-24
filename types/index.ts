export interface CartItem {
  productId: number;
  name: string;
  sku: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface ProductWithDetails {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stockStatus: string;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  categoryId: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  images: {
    id: number;
    url: string;
    isMain: boolean;
    colorName: string | null;
    sortOrder: number;
  }[];
  colors: {
    id: number;
    name: string;
    hex: string | null;
  }[];
  sizes: {
    id: number;
    size: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithCount {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: {
    products: number;
  };
}

export interface OrderWithItems {
  id: number;
  customerName: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  note: string | null;
  status: string;
  totalAmount: number;
  items: {
    id: number;
    productName: string;
    sku: string;
    color: string;
    size: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: number;
  businessName: string;
  whatsappNumber: string;
  businessPhone: string | null;
  email: string | null;
  address: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  logo: string | null;
  favicon: string | null;
}

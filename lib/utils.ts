import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | null): string {
  if (!price) return '₹0';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

// Serialize Prisma Decimal values for client components
export function serializeProduct(product: any): any {
  return {
    ...product,
    price: product.price ? Number(product.price) : 0,
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    createdAt: product.createdAt?.toISOString?.() || product.createdAt,
    updatedAt: product.updatedAt?.toISOString?.() || product.updatedAt,
    category: product.category ? {
      ...product.category,
    } : undefined,
    images: product.images?.map((img: any) => ({
      ...img,
      createdAt: img.createdAt?.toISOString?.() || img.createdAt,
    })) || [],
    colors: product.colors || [],
    sizes: product.sizes || [],
  };
}

export function serializeProducts(products: any[]): any[] {
  return products.map(serializeProduct);
}

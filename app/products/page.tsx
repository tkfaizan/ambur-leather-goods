import { prisma } from "@/lib/db";
import { serializeProducts } from "@/lib/utils";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductFilters } from "@/components/ProductFilters";
import { SectionHeader } from "@/components/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | AMBUR Leather Goods",
  description: "Browse all premium leather products - Slippers, Sandals, Shoes, Belts, Wallets, Bags, and more from Ambur, Tamil Nadu.",
};

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ 
    color?: string; 
    size?: string; 
    minPrice?: string; 
    maxPrice?: string;
    sort?: string;
    search?: string;
    category?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;

  const whereClause: any = {
    isActive: true,
  };

  if (sp.category) {
    whereClause.category = { slug: sp.category };
  }

  if (sp.color) {
    whereClause.colors = { some: { name: sp.color } };
  }

  if (sp.size) {
    whereClause.sizes = { some: { size: sp.size } };
  }

  if (sp.minPrice || sp.maxPrice) {
    whereClause.price = {};
    if (sp.minPrice) whereClause.price.gte = parseFloat(sp.minPrice);
    if (sp.maxPrice) whereClause.price.lte = parseFloat(sp.maxPrice);
  }

  if (sp.search) {
    whereClause.OR = [
      { name: { contains: sp.search, mode: 'insensitive' } },
      { sku: { contains: sp.search, mode: 'insensitive' } },
      { category: { name: { contains: sp.search, mode: 'insensitive' } } },
    ];
  }

  const orderBy: any = {};
  switch (sp.sort) {
    case 'price_asc':
      orderBy.price = 'asc';
      break;
    case 'price_desc':
      orderBy.price = 'desc';
      break;
    case 'name_asc':
      orderBy.name = 'asc';
      break;
    case 'newest':
      orderBy.createdAt = 'desc';
      break;
    default:
      orderBy.createdAt = 'desc';
  }

  const productsRaw = await prisma.product.findMany({
    where: whereClause,
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      colors: true,
      sizes: true,
    },
    orderBy,
  });

  const allColors = await prisma.productColor.findMany({
    where: { product: { isActive: true } },
    select: { name: true },
    distinct: ['name'],
  });

  const allSizes = await prisma.productSize.findMany({
    where: { product: { isActive: true } },
    select: { size: true },
    distinct: ['size'],
    orderBy: { size: 'asc' },
  });

  const priceRange = await prisma.product.aggregate({
    where: { isActive: true },
    _min: { price: true },
    _max: { price: true },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { name: true, slug: true },
    orderBy: { sortOrder: 'asc' },
  });

  const products = serializeProducts(productsRaw);

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader 
        title="All Products" 
        subtitle={`${products.length} premium leather products`}
      />

      <form className="mb-8 max-w-2xl" action="/products">
        <div className="relative">
          <input
            type="text"
            name="search"
            placeholder="Search by product name, code, or category..."
            defaultValue={sp.search || ''}
            className="input-field pl-12 pr-4"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm">
            Search
          </button>
        </div>
      </form>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilters 
            colors={allColors.map(c => c.name)}
            sizes={allSizes.map(s => s.size)}
            priceRange={{
              min: Number(priceRange._min.price || 0),
              max: Number(priceRange._max.price || 10000),
            }}
            currentFilters={sp}
            categories={categories}
          />
        </aside>

        <div className="flex-1">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found.</p>
              <a href="/products" className="inline-block mt-4 text-leather-700 hover:underline">
                View all products
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

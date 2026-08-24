import { prisma } from "@/lib/db";
import { serializeProducts } from "@/lib/utils";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductFilters } from "@/components/ProductFilters";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ 
    color?: string; 
    size?: string; 
    minPrice?: string; 
    maxPrice?: string;
    sort?: string;
    search?: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} | AMBUR Leather Goods`,
    description: category.description || `Shop ${category.name} at AMBUR Leather Goods`,
  };
}

export const revalidate = 60;

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      _count: { select: { products: true } },
    },
  });

  if (!category) {
    notFound();
  }

  const whereClause: any = {
    categoryId: category.id,
    isActive: true,
  };

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
    where: { product: { categoryId: category.id, isActive: true } },
    select: { name: true },
    distinct: ['name'],
  });

  const allSizes = await prisma.productSize.findMany({
    where: { product: { categoryId: category.id, isActive: true } },
    select: { size: true },
    distinct: ['size'],
    orderBy: { size: 'asc' },
  });

  const priceRange = await prisma.product.aggregate({
    where: { categoryId: category.id, isActive: true },
    _min: { price: true },
    _max: { price: true },
  });

  const products = serializeProducts(productsRaw);

  return (
    <div className="min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-leather-700">Home</a>
          <span className="mx-2">/</span>
          <a href="/categories" className="hover:text-leather-700">Categories</a>
          <span className="mx-2">/</span>
          <span className="text-leather-700 font-medium">{category.name}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-gray-600 max-w-2xl">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">{products.length} products</p>
      </div>

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
          />
        </aside>

        <div className="flex-1">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <a 
                href={`/categories/${slug}`}
                className="inline-block mt-4 text-leather-700 hover:underline"
              >
                Clear all filters
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

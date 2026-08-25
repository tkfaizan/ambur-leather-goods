import { prisma } from "@/lib/db";
import { serializeProducts } from "@/lib/utils";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { WhatsAppCTA } from "@/components/WhatsAppCTA";
import { FeaturesBar } from "@/components/FeaturesBar";
export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { products: true } },
    },
  });

  const featuredProductsRaw = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      colors: true,
      sizes: true,
    },
    take: 8,
  });

  const bestSellersRaw = await prisma.product.findMany({
    where: { isActive: true, isBestSeller: true },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      colors: true,
      sizes: true,
    },
    take: 8,
  });

  const newProductsRaw = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      colors: true,
      sizes: true,
    },
    take: 8,
  });

  // Serialize Decimal values for client components
  const featuredProducts = serializeProducts(featuredProductsRaw);
  const bestSellers = serializeProducts(bestSellersRaw);
  const newProducts = serializeProducts(newProductsRaw);

  return (
    <>
      <HeroBanner />
      <FeaturesBar />

      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader 
          title="Shop by Category" 
          subtitle="Browse our handcrafted leather collections"
        />
        <CategoryGrid categories={categories} />
      </section>

      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white/50">
          <SectionHeader 
            title="Featured Products" 
            subtitle="Our finest selections crafted with care"
          />
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <SectionHeader 
            title="Best Sellers" 
            subtitle="Customer favorites you will love"
          />
          <ProductGrid products={bestSellers} />
        </section>
      )}

      {newProducts.length > 0 && (
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white/50">
          <SectionHeader 
            title="New Arrivals" 
            subtitle="Fresh from our workshop"
          />
          <ProductGrid products={newProducts} />
        </section>
      )}

      <WhatsAppCTA />
    </>
  );
}

import { prisma } from "@/lib/db";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SectionHeader } from "@/components/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Categories | AMBUR Leather Goods",
  description: "Browse all leather product categories - Slippers, Sandals, Loafers, Shoes, Belts, Wallets, Bags, and more.",
};

export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="min-h-screen py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SectionHeader 
        title="All Categories" 
        subtitle={`${categories.length} categories of premium leather goods`}
      />
      <CategoryGrid categories={categories} />
    </div>
  );
}

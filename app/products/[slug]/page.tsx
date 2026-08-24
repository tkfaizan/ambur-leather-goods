import { prisma } from "@/lib/db";
import { serializeProduct, serializeProducts } from "@/lib/utils";
import { ProductDetail } from "@/components/ProductDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, images: true },
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | AMBUR Leather Goods`,
    description: product.description || `Buy ${product.name} - Premium leather product from AMBUR Leather Goods`,
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

export const revalidate = 60;

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const productRaw = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      colors: true,
      sizes: true,
    },
  });

  if (!productRaw) {
    notFound();
  }

  const relatedProductsRaw = await prisma.product.findMany({
    where: {
      categoryId: productRaw.categoryId,
      isActive: true,
      id: { not: productRaw.id },
    },
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      colors: true,
      sizes: true,
    },
    take: 4,
  });

  // Serialize Decimal values for client components
  const product = serializeProduct(productRaw);
  const relatedProducts = serializeProducts(relatedProductsRaw);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}

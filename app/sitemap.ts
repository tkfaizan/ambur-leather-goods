import { prisma } from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://amburleather.com";
  const categories = await prisma.category.findMany({ where: { isActive: true } });
  const products = await prisma.product.findMany({ where: { isActive: true } });

  const routes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
  ];

  const categoryRoutes = categories.map(c => ({
    url: `${baseUrl}/categories/${c.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7,
  }));

  const productRoutes = products.map(p => ({
    url: `${baseUrl}/products/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.8,
  }));

  return [...routes, ...categoryRoutes, ...productRoutes];
}

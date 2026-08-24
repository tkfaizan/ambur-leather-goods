import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const admin = searchParams.get("admin");

  const where: any = admin ? {} : { isActive: true };
  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      sizes: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = productSchema.parse(body);
    const slug = slugify(`${data.name}-${data.sku}`, { lower: true });

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku: data.sku,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice,
        stockStatus: data.stockStatus,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        isBestSeller: data.isBestSeller,
        categoryId: data.categoryId,
        colors: { create: data.colors },
        sizes: { create: data.sizes.map(s => ({ size: s })) },
        images: {
          create: body.images?.map((img: any, idx: number) => ({
            url: img.url,
            isMain: img.isMain || idx === 0,
            colorName: img.colorName || null,
            sortOrder: idx,
          })) || [],
        },
      },
      include: {
        category: true,
        images: true,
        colors: true,
        sizes: true,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Product create error:", error);
    return NextResponse.json({ error: error.message || "Invalid data" }, { status: 400 });
  }
}

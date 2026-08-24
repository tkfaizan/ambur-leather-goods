import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { category: true, images: true, colors: true, sizes: true },
  });
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();

    // Handle image updates if images array is provided
    if (body.images !== undefined) {
      // Delete existing images
      await prisma.productImage.deleteMany({
        where: { productId: parseInt(id) },
      });

      // Delete existing colors and sizes too if provided
      if (body.colors !== undefined) {
        await prisma.productColor.deleteMany({
          where: { productId: parseInt(id) },
        });
      }
      if (body.sizes !== undefined) {
        await prisma.productSize.deleteMany({
          where: { productId: parseInt(id) },
        });
      }

      // Rebuild the product with new relations
      const updateData: any = {
        name: body.name,
        sku: body.sku,
        description: body.description,
        price: body.price,
        salePrice: body.salePrice,
        stockStatus: body.stockStatus,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        isBestSeller: body.isBestSeller,
        categoryId: body.categoryId,
      };

      // Only include relation updates if provided
      if (body.images && body.images.length > 0) {
        updateData.images = {
          create: body.images.map((img: any, idx: number) => ({
            url: img.url,
            isMain: img.isMain || idx === 0,
            colorName: img.colorName || null,
            sortOrder: idx,
          })),
        };
      }

      if (body.colors && body.colors.length > 0) {
        updateData.colors = {
          create: body.colors.map((c: any) => ({
            name: c.name,
            hex: c.hex || null,
          })),
        };
      }

      if (body.sizes && body.sizes.length > 0) {
        updateData.sizes = {
          create: body.sizes.map((s: string) => ({ size: s })),
        };
      }

      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          category: true,
          images: true,
          colors: true,
          sizes: true,
        },
      });

      return NextResponse.json(product);
    }

    // Simple field update (toggle isActive, isFeatured, etc.)
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: body,
    });
    return NextResponse.json(product);

  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}

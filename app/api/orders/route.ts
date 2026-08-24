import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, totalAmount, ...customerData } = body;
    const settings = await prisma.setting.findFirst();

    const order = await prisma.order.create({
      data: {
        ...customerData, totalAmount, status: "new",
        items: { create: items },
      },
      include: { items: true },
    });
    return NextResponse.json({ order, settings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where: any = status ? { status } : {};

  const orders = await prisma.order.findMany({
    where, include: { items: true }, orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

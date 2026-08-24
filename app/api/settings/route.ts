import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.setting.findFirst();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const settings = await prisma.setting.upsert({
    where: { id: 1 }, update: body, create: { ...body, id: 1 },
  });
  return NextResponse.json(settings);
}

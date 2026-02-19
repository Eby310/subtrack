import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const subscription = await prisma.subscription.findFirst({
    where: { id, userId: user.id },
  });

  if (!subscription) {
    return new NextResponse("Subscription not found", { status: 404 });
  }

  return NextResponse.json(subscription);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const body = await request.json();
  const { name, price, currency, billingCycle, category, nextBillingDate, notes, color } = body;

  const subscription = await prisma.subscription.updateMany({
    where: { id, userId: user.id },
    data: {
      name,
      price: parseFloat(price),
      currency: currency || "USD",
      billingCycle,
      category,
      nextBillingDate: new Date(nextBillingDate),
      notes: notes || null,
      color: color || null,
    },
  });

  if (subscription.count === 0) {
    return new NextResponse("Subscription not found", { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const subscription = await prisma.subscription.deleteMany({
    where: { id, userId: user.id },
  });

  if (subscription.count === 0) {
    return new NextResponse("Subscription not found", { status: 404 });
  }

  return NextResponse.json({ success: true });
}

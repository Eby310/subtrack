import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/utils";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { subscriptions: true },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  return NextResponse.json(user.subscriptions);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    const clerkUser = await currentUser();
    
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || null,
      },
    });
  }

  const body = await request.json();
  const { name, price, currency, billingCycle, category, nextBillingDate, notes, color } = body;

  const categoryData = CATEGORIES.find(c => c.value === category) || CATEGORIES[4];

  const subscription = await prisma.subscription.create({
    data: {
      userId: user.id,
      name,
      price: parseFloat(price),
      currency: currency || "USD",
      billingCycle,
      category,
      nextBillingDate: new Date(nextBillingDate),
      notes: notes || null,
      color: color || categoryData.color,
    },
  });

  return NextResponse.json(subscription);
}

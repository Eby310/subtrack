import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Webhook } from "svix";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

interface UserEvent {
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string | null;
    last_name: string | null;
  };
  type: string;
}

export async function POST(request: Request) {
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);
  let event: UserEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as UserEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const userData = event.data;
  const eventType = event.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const email = userData.email_addresses[0]?.email_address || "";
    const name = [userData.first_name, userData.last_name].filter(Boolean).join(" ") || null;

    await prisma.user.upsert({
      where: { clerkId: userData.id },
      update: { email, name },
      create: {
        clerkId: userData.id,
        email,
        name,
      },
    });
  }

  if (eventType === "user.deleted") {
    await prisma.user.delete({
      where: { clerkId: userData.id },
    }).catch(() => {});
  }

  return new NextResponse("Webhook processed", { status: 200 });
}

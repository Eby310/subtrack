import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewSubscriptionPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
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

  async function createSubscription(formData: FormData) {
    "use server";
    
    const { userId } = await auth();
    if (!userId) return;

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return;

    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const currency = formData.get("currency") as string;
    const billingCycle = formData.get("billingCycle") as string;
    const category = formData.get("category") as string;
    const nextBillingDate = formData.get("nextBillingDate") as string;
    const notes = formData.get("notes") as string;
    const color = formData.get("color") as string;

    await prisma.subscription.create({
      data: {
        userId: user.id,
        name,
        price,
        currency,
        billingCycle,
        category,
        nextBillingDate: new Date(nextBillingDate),
        notes: notes || null,
        color: color || null,
      },
    });

    redirect("/subscriptions");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <a
          href="/subscriptions"
          className="inline-flex items-center gap-2 text-[#71717a] hover:text-[#f4f4f5] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Subscriptions
        </a>
        <h1 className="text-3xl font-bold text-[#f4f4f5]">
          Add Subscription
        </h1>
        <p className="text-[#71717a] mt-1">
          Add a new subscription to track
        </p>
      </div>

      <form
        action={createSubscription}
        className="bg-[#13131a] border border-[#27272a] rounded-2xl p-6 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#f4f4f5] mb-2">
              Name *
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Netflix, Spotify, Gym..."
              className="w-full bg-[#1a1a24] border border-[#27272a] text-[#f4f4f5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder:text-[#52525b]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f4f4f5] mb-2">
              Price *
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="9.99"
              className="w-full bg-[#1a1a24] border border-[#27272a] text-[#f4f4f5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder:text-[#52525b]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f4f4f5] mb-2">
              Currency
            </label>
            <select
              name="currency"
              defaultValue="USD"
              className="w-full bg-[#1a1a24] border border-[#27272a] text-[#f4f4f5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f4f4f5] mb-2">
              Billing Cycle *
            </label>
            <select
              name="billingCycle"
              required
              className="w-full bg-[#1a1a24] border border-[#27272a] text-[#f4f4f5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f4f4f5] mb-2">
              Category *
            </label>
            <select
              name="category"
              required
              className="w-full bg-[#1a1a24] border border-[#27272a] text-[#f4f4f5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="entertainment">Entertainment</option>
              <option value="productivity">Productivity</option>
              <option value="health">Health</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f4f4f5] mb-2">
              Next Billing Date *
            </label>
            <input
              name="nextBillingDate"
              type="date"
              required
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full bg-[#1a1a24] border border-[#27272a] text-[#f4f4f5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f4f4f5] mb-2">
              Color (optional)
            </label>
            <input
              name="color"
              type="color"
              defaultValue="#6366f1"
              className="w-14 h-12 bg-[#1a1a24] border border-[#27272a] rounded-xl cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#f4f4f5] mb-2">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Any additional notes about this subscription..."
            className="w-full bg-[#1a1a24] border border-[#27272a] text-[#f4f4f5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder:text-[#52525b] resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <a
            href="/subscriptions"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#27272a] text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#1a1a24] transition-colors"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Add Subscription
          </button>
        </div>
      </form>
    </div>
  );
}

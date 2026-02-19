import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { formatCurrency, calculateMonthlyAmount, calculateYearlyAmount, getDaysUntilRenewal, CATEGORIES } from "@/lib/utils";
import { TrendingUp, Calendar, CreditCard, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

async function getData() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { subscriptions: true },
  });

  return user;
}

async function DashboardContent() {
  const user = await getData();
  
  if (!user) {
    return null;
  }

  const subscriptions = user.subscriptions;
  
  const monthlyTotal = subscriptions.reduce((sum, sub) => {
    return sum + calculateMonthlyAmount(sub.price, sub.billingCycle);
  }, 0);

  const yearlyTotal = subscriptions.reduce((sum, sub) => {
    return sum + calculateYearlyAmount(sub.price, sub.billingCycle);
  }, 0);

  const upcomingRenewals = subscriptions
    .filter(sub => {
      const days = getDaysUntilRenewal(sub.nextBillingDate);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())
    .slice(0, 5);

  const recentSubscriptions = [...subscriptions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const clerkUser = await currentUser();
  const displayName = clerkUser?.firstName || user.name || "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#f4f4f5]">
          Welcome back, {displayName}
        </h1>
        <p className="text-[#71717a] mt-1">
          Here&apos;s an overview of your subscriptions
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#13131a] border border-[#27272a] rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-[#71717a] text-sm">Monthly Spending</p>
              <p className="text-2xl font-bold text-[#f4f4f5]">
                {formatCurrency(monthlyTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#13131a] border border-[#27272a] rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-[#71717a] text-sm">Yearly Spending</p>
              <p className="text-2xl font-bold text-[#f4f4f5]">
                {formatCurrency(yearlyTotal)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#13131a] border border-[#27272a] rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-[#71717a] text-sm">Active Subscriptions</p>
              <p className="text-2xl font-bold text-[#f4f4f5]">
                {subscriptions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#13131a] border border-[#27272a] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#f4f4f5]">
              Upcoming Renewals
            </h2>
            <Link
              href="/subscriptions"
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              View all
            </Link>
          </div>
          
          {upcomingRenewals.length === 0 ? (
            <p className="text-[#71717a] text-center py-8">
              No renewals in the next 7 days
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingRenewals.map((sub) => {
                const days = getDaysUntilRenewal(sub.nextBillingDate);
                const category = CATEGORIES.find(c => c.value === sub.category) || CATEGORIES[4];
                return (
                  <div
                    key={sub.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1a1a24] transition-colors"
                    style={{ borderLeft: `3px solid ${sub.color || category.color}` }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#f4f4f5] truncate">
                        {sub.name}
                      </p>
                      <p className="text-sm text-[#71717a]">
                        {format(new Date(sub.nextBillingDate), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#f4f4f5]">
                        {formatCurrency(sub.price, sub.currency)}
                      </p>
                      <p className={`text-sm ${days <= 1 ? "text-red-400" : "text-amber-400"}`}>
                        {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-[#13131a] border border-[#27272a] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#f4f4f5]">
              Recent Subscriptions
            </h2>
            <Link
              href="/subscriptions"
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              View all
            </Link>
          </div>
          
          {recentSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#71717a] mb-4">No subscriptions yet</p>
              <Link
                href="/subscriptions/new"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Clock className="w-4 h-4" />
                Add your first subscription
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSubscriptions.map((sub) => {
                const category = CATEGORIES.find(c => c.value === sub.category) || CATEGORIES[4];
                return (
                  <div
                    key={sub.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1a1a24] transition-colors"
                    style={{ borderLeft: `3px solid ${sub.color || category.color}` }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#f4f4f5] truncate">
                        {sub.name}
                      </p>
                      <p className="text-sm text-[#71717a] capitalize">
                        {sub.billingCycle}
                      </p>
                    </div>
                    <p className="font-medium text-[#f4f4f5]">
                      {formatCurrency(sub.price, sub.currency)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-[#71717a]">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

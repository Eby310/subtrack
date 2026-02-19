"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { Plus, Edit, Trash2, CreditCard, Tv, Heart, Wallet, MoreHorizontal } from "lucide-react";
import { formatCurrency, CATEGORIES } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  category: string;
  nextBillingDate: string;
  notes: string | null;
  color: string | null;
  createdAt: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  entertainment: <Tv className="w-5 h-5" />,
  productivity: <CreditCard className="w-5 h-5" />,
  health: <Heart className="w-5 h-5" />,
  finance: <Wallet className="w-5 h-5" />,
  other: <MoreHorizontal className="w-5 h-5" />,
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscription = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;
    
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete subscription:", error);
    }
  };

  const filteredSubscriptions = subscriptions
    .filter((sub) => filter === "all" || sub.category === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return b.price - a.price;
        case "nextBilling":
          return new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#71717a]">Loading subscriptions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#f4f4f5]">Subscriptions</h1>
          <p className="text-[#71717a] mt-1">
            Manage all your subscriptions in one place
          </p>
        </div>
        <Link
          href="/subscriptions/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Subscription
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#13131a] border border-[#27272a] text-[#f4f4f5] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[#13131a] border border-[#27272a] text-[#f4f4f5] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="nextBilling">Sort by Next Billing</option>
        </select>
      </div>

      {filteredSubscriptions.length === 0 ? (
        <div className="bg-[#13131a] border border-[#27272a] rounded-2xl p-12 text-center">
          <CreditCard className="w-16 h-16 text-[#27272a] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#f4f4f5] mb-2">
            No subscriptions yet
          </h3>
          <p className="text-[#71717a] mb-6">
            Start tracking your subscriptions by adding your first one.
          </p>
          <Link
            href="/subscriptions/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Subscription
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubscriptions.map((sub) => {
            const category = CATEGORIES.find((c) => c.value === sub.category) || CATEGORIES[4];
            const daysUntil = differenceInDays(new Date(sub.nextBillingDate), new Date());
            const borderColor = sub.color || category.color;

            return (
              <div
                key={sub.id}
                className="bg-[#13131a] border border-[#27272a] rounded-2xl p-6 hover:border-[#3f3f46] transition-all group"
                style={{ borderLeft: `4px solid ${borderColor}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${borderColor}20` }}
                    >
                      <span style={{ color: borderColor }}>
                        {categoryIcons[sub.category] || categoryIcons.other}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#f4f4f5]">{sub.name}</h3>
                      <p className="text-sm text-[#71717a] capitalize">{sub.category}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">Price</span>
                    <span className="font-semibold text-[#f4f4f5]">
                      {formatCurrency(sub.price, sub.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">Billing</span>
                    <span className="text-sm text-[#f4f4f5] capitalize">{sub.billingCycle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">Next Billing</span>
                    <span
                      className={`text-sm ${
                        daysUntil <= 3
                          ? "text-red-400"
                          : daysUntil <= 7
                          ? "text-amber-400"
                          : "text-[#f4f4f5]"
                      }`}
                    >
                      {format(new Date(sub.nextBillingDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                {sub.notes && (
                  <p className="text-sm text-[#71717a] mb-4 line-clamp-2">{sub.notes}</p>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-[#27272a]">
                  <Link
                    href={`/subscriptions/${sub.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#1a1a24] text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#27272a] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

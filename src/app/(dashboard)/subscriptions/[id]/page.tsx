"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/utils";

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
}

export default function SubscriptionForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string }>({ id: "" });
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    currency: "USD",
    billingCycle: "monthly",
    category: "entertainment",
    nextBillingDate: new Date().toISOString().split("T")[0],
    notes: "",
    color: "#6366f1",
  });

  useEffect(() => {
    params.then((p) => {
      setResolvedParams(p);
      if (p.id) {
        fetchSubscription(p.id);
      }
    });
  }, [params]);

  const fetchSubscription = async (id: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
        setFormData({
          name: data.name,
          price: data.price,
          currency: data.currency,
          billingCycle: data.billingCycle,
          category: data.category,
          nextBillingDate: data.nextBillingDate.split("T")[0],
          notes: data.notes || "",
          color: data.color || "#6366f1",
        });
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/subscriptions/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/subscriptions");
      }
    } catch (error) {
      console.error("Failed to save subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link
          href="/subscriptions"
          className="inline-flex items-center gap-2 text-[#71717a] hover:text-[#f4f4f5] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subscriptions
        </Link>
        <h1 className="text-3xl font-bold text-[#f4f4f5]">Edit Subscription</h1>
        <p className="text-[#71717a] mt-1">Update your subscription details</p>
      </div>

      <form
        onSubmit={onSubmit}
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
              value={formData.name}
              onChange={handleChange}
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
              value={formData.price}
              onChange={handleChange}
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
              value={formData.currency}
              onChange={handleChange}
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
              value={formData.billingCycle}
              onChange={handleChange}
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
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-[#1a1a24] border border-[#27272a] text-[#f4f4f5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#f4f4f5] mb-2">
              Next Billing Date *
            </label>
            <input
              name="nextBillingDate"
              type="date"
              value={formData.nextBillingDate}
              onChange={handleChange}
              required
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
              value={formData.color}
              onChange={handleChange}
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
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional notes about this subscription..."
            className="w-full bg-[#1a1a24] border border-[#27272a] text-[#f4f4f5] px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder:text-[#52525b] resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Link
            href="/subscriptions"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#27272a] text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#1a1a24] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Update Subscription
          </button>
        </div>
      </form>
    </div>
  );
}

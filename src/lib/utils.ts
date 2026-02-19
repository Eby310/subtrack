import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateMonthlyAmount(price: number, billingCycle: string): number {
  switch (billingCycle) {
    case "weekly":
      return price * 4.33;
    case "yearly":
      return price / 12;
    case "monthly":
    default:
      return price;
  }
}

export function calculateYearlyAmount(price: number, billingCycle: string): number {
  switch (billingCycle) {
    case "weekly":
      return price * 52;
    case "monthly":
      return price * 12;
    case "yearly":
    default:
      return price;
  }
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function getDaysUntilRenewal(nextBillingDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const billingDate = new Date(nextBillingDate);
  billingDate.setHours(0, 0, 0, 0);
  const diffTime = billingDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export const CATEGORIES = [
  { value: "entertainment", label: "Entertainment", color: "#ef4444" },
  { value: "productivity", label: "Productivity", color: "#6366f1" },
  { value: "health", label: "Health", color: "#10b981" },
  { value: "finance", label: "Finance", color: "#f59e0b" },
  { value: "other", label: "Other", color: "#71717a" },
] as const;

export const BILLING_CYCLES = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;

export const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
] as const;

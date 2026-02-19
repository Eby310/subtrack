"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard, CreditCard, Settings, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#71717a]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <aside className="w-64 border-r border-[#27272a] p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#f4f4f5]">SubTrack</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#1a1a24] transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/subscriptions"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#1a1a24] transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            Subscriptions
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#1a1a24] transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="border-t border-[#27272a] pt-6 mt-6">
          <div className="flex items-center gap-3 mb-4 px-4">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#f4f4f5] truncate">
                {user.fullName || user.username || "User"}
              </p>
              <p className="text-xs text-[#71717a] truncate">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
          <SignOutButton>
            <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[#71717a] hover:text-[#f4f4f5] hover:bg-[#1a1a24] transition-colors">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { CreditCard, TrendingUp, Bell, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#f4f4f5]">SubTrack</span>
          </div>
          <nav className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-[#71717a] hover:text-[#f4f4f5] transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-[#f4f4f5] tracking-tight mb-6">
              Track your subscriptions,{" "}
              <span className="text-indigo-400">not your spending</span>
            </h1>
            <p className="text-xl text-[#71717a] mb-10 max-w-2xl mx-auto">
              SubTrack helps you manage all your subscriptions in one place, 
              calculate total spending, and never miss a renewal date.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all hover:scale-105 flex items-center gap-2">
                    Start Tracking Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all hover:scale-105 flex items-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </SignedIn>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-[#13131a]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#f4f4f5] text-center mb-12">
              Everything you need to manage subscriptions
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-[#1a1a24] p-8 rounded-2xl border border-[#27272a]">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-[#f4f4f5] mb-3">
                  Spending Analytics
                </h3>
                <p className="text-[#71717a]">
                  See your monthly and yearly spending at a glance. 
                  Know exactly where your money goes.
                </p>
              </div>

              <div className="bg-[#1a1a24] p-8 rounded-2xl border border-[#27272a]">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-[#f4f4f5] mb-3">
                  Easy Management
                </h3>
                <p className="text-[#71717a]">
                  Add, edit, or remove subscriptions with just a few clicks. 
                  Keep track of all your services in one place.
                </p>
              </div>

              <div className="bg-[#1a1a24] p-8 rounded-2xl border border-[#27272a]">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-[#f4f4f5] mb-3">
                  Smart Reminders
                </h3>
                <p className="text-[#71717a]">
                  Get email reminders before any subscription renews. 
                  Never be surprised by a charge again.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#f4f4f5] mb-6">
              Ready to take control?
            </h2>
            <p className="text-lg text-[#71717a] mb-8">
              Join thousands of users who track their subscriptions with SubTrack.
            </p>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all hover:scale-105">
                  Get Started for Free
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#27272a] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#71717a] text-sm">
            © 2026 SubTrack. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-[#71717a]">
            <a href="#" className="hover:text-[#f4f4f5] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#f4f4f5] transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

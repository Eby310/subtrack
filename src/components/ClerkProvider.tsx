"use client";

import { ClerkProvider } from "@clerk/nextjs";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function Providers({ children }: { children: React.ReactNode }) {
  if (!publishableKey || publishableKey === "pk_test_your_key_here") {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      appearance={{
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#13131a",
          colorInputBackground: "#1a1a24",
          colorInputText: "#f4f4f5",
          colorText: "#f4f4f5",
          colorTextSecondary: "#71717a",
          borderRadius: "8px",
        },
        elements: {
          formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
          card: "bg-[#13131a] border border-[#27272a]",
          footerActionLink: "text-indigo-400 hover:text-indigo-300",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}

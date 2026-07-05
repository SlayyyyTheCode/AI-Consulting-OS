import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="mb-8 text-center">
        <div className="text-3xl font-bold tracking-tight">
          Consulting<span className="text-accent">OS</span>
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          AI-powered Consulting Operating System
        </p>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}

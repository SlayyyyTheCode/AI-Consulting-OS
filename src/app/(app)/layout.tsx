import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { NavLinks } from "@/components/nav-links";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { user } = session;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            Consulting<span className="text-accent">OS</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3" aria-label="Main navigation">
          <NavLinks isAdmin={user.role === "admin"} />
        </nav>
        <div className="border-t border-border p-4">
          {!process.env.ANTHROPIC_API_KEY && (
            <p className="mb-2 rounded-md bg-warning-soft px-2.5 py-1.5 text-xs font-medium text-warning">
              Demo mode — rule engine, no AI key
            </p>
          )}
          <div className="mb-2 min-w-0">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted">
              {user.email} · {user.role}
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-md border border-border-strong px-3 py-2 text-left text-sm text-text-secondary hover:bg-bg"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
        <Link href="/dashboard" className="font-bold">
          Consulting<span className="text-accent">OS</span>
        </Link>
        <nav aria-label="Mobile navigation" className="flex items-center gap-1 overflow-x-auto">
          <NavLinks isAdmin={user.role === "admin"} compact />
        </nav>
      </div>

      <main className="flex-1 px-4 pb-12 pt-20 sm:px-6 lg:ml-60 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

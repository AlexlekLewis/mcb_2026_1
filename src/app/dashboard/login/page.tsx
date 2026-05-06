import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard Login",
  description: "Private dashboard login for Modern Curtains and Blinds.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";
  const nextPath = params.next?.startsWith("/dashboard") ? params.next : "/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-12 text-stone-900">
      <div className="w-full max-w-md rounded-sm border border-stone-300 bg-white p-8 shadow-sm">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-sm bg-mcb-terracotta/10 text-mcb-terracotta">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-mcb-terracotta">MCB website data</p>
        <h1 className="mb-3 font-serif text-4xl text-mcb-charcoal">Dashboard Login</h1>
        <p className="mb-6 text-sm leading-relaxed text-stone-600">
          Sign in to view private website analytics, leads and SEO reporting.
        </p>

        {hasError ? (
          <div className="mb-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            The email or password was incorrect.
          </div>
        ) : null}

        <form action="/api/dashboard/login" method="POST" className="space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <div>
            <label className="mb-2 block text-sm font-bold text-mcb-charcoal" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              className="w-full rounded-sm border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none transition focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-mcb-charcoal" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-sm border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none transition focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-sm bg-mcb-terracotta px-5 py-3 font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal"
          >
            Open Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

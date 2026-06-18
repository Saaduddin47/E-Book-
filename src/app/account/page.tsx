import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { SignOutButton } from "@/components/ui/sign-out-button";
import { BookOpen, ShoppingBag } from "lucide-react";

export const metadata = { title: "My Account" };
export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-success/10 text-success",
  PENDING: "bg-amber/10 text-amber-700",
  FAILED: "bg-danger/10 text-danger",
  CANCELLED: "bg-muted/10 text-muted",
};

export default async function AccountPage() {
  const user = await requireUser("/account");

  const [entitlements, orders] = await Promise.all([
    prisma.entitlement.findMany({
      where: { userId: user.id },
      include: { product: true },
    }),
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { product: true },
    }),
  ]);

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-cream/85 backdrop-blur">
        <div className="container-tight flex h-16 items-center justify-between">
          <Link href="/" className="font-display text-2xl font-semibold text-ink">
            &larr; Home
          </Link>
          <SignOutButton />
        </div>
      </header>

      <main className="container-tight py-12">
        <h1 className="display text-4xl">My Account</h1>
        <p className="mt-2 text-ink-soft">
          Signed in as <span className="font-medium text-ink">{user.email}</span>
        </p>

        <section className="mt-10">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <BookOpen className="size-5 text-ember" /> Your Library
          </h2>
          {entitlements.length ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {entitlements.map((e) => (
                <div key={e.id} className="card flex items-center justify-between p-5">
                  <div>
                    <p className="font-semibold text-ink">{e.product.title}</p>
                    <p className="text-sm text-muted">Full access unlocked</p>
                  </div>
                  <Link href="/read" className="btn-dark px-4 py-2 text-sm">
                    Read
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="card mt-4 p-6 text-center">
              <p className="text-ink-soft">You don&apos;t own the guide yet.</p>
              <Link href="/" className="btn-primary mt-4 inline-flex">
                Get the Guide
              </Link>
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <ShoppingBag className="size-5 text-ember" /> Order History
          </h2>
          {orders.length ? (
            <div className="card mt-4 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line bg-cream-deep/50 text-muted">
                  <tr>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-line last:border-0">
                      <td className="px-5 py-4 font-medium text-ink">
                        {o.product.title}
                      </td>
                      <td className="px-5 py-4 text-ink-soft">
                        {formatPrice(o.amountCents, o.currency)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[o.status] ?? ""}`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {o.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-ink-soft">No orders yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}

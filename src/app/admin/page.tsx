import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, Users, ShoppingBag, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [userCount, completedOrders, pendingCount, entitlementCount, recentOrders] =
    await Promise.all([
      prisma.user.count(),
      prisma.order.findMany({ where: { status: "COMPLETED" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.entitlement.count(),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { user: true, product: true },
      }),
    ]);

  const revenueByCurrency = completedOrders.reduce<Record<string, number>>(
    (acc, o) => {
      acc[o.currency] = (acc[o.currency] ?? 0) + o.amountCents;
      return acc;
    },
    {},
  );
  const revenueText =
    Object.entries(revenueByCurrency)
      .map(([cur, cents]) => formatPrice(cents, cur))
      .join(" + ") || formatPrice(0, "AED");

  const conversion =
    userCount > 0 ? ((entitlementCount / userCount) * 100).toFixed(1) : "0";

  const stats = [
    { label: "Revenue", value: revenueText, icon: TrendingUp },
    { label: "Paid customers", value: String(entitlementCount), icon: BookOpen },
    { label: "Total users", value: String(userCount), icon: Users },
    {
      label: "Orders",
      value: `${completedOrders.length} paid / ${pendingCount} pending`,
      icon: ShoppingBag,
    },
  ];

  return (
    <div>
      <h1 className="display text-3xl">Overview</h1>
      <p className="mt-1 text-ink-soft">
        Conversion rate: <span className="font-semibold text-ink">{conversion}%</span>
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{s.label}</p>
              <s.icon className="size-4 text-ember" />
            </div>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">
            Recent orders
          </h2>
          <Link href="/admin/orders" className="text-sm text-ember hover:underline">
            View all &rarr;
          </Link>
        </div>

        <div className="card mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-cream-deep/50 text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length ? (
                recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 text-ink">{o.user.email}</td>
                    <td className="px-5 py-3 text-ink-soft">
                      {formatPrice(o.amountCents, o.currency)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {o.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-muted">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-success/10 text-success",
    PENDING: "bg-amber/10 text-amber-700",
    FAILED: "bg-danger/10 text-danger",
    CANCELLED: "bg-muted/10 text-muted",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] ?? ""}`}
    >
      {status}
    </span>
  );
}

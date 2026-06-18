import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: true, product: true },
  });

  return (
    <div>
      <h1 className="display text-3xl">Orders</h1>
      <p className="mt-1 text-ink-soft">{orders.length} most recent orders</p>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-cream-deep/50 text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Ziina ID</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length ? (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{o.user.email}</td>
                  <td className="px-4 py-3 text-ink-soft">{o.product.title}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {formatPrice(o.amountCents, o.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {o.ziinaPaymentIntentId ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {o.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] ?? ""}`}>
      {status}
    </span>
  );
}

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import {
  toggleUserRole,
  grantUserAccess,
  revokeUserAccess,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const admin = await requireAdmin();
  const { q } = await searchParams;
  const query = q?.trim();

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { email: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { entitlements: true, _count: { select: { orders: true } } },
  });

  return (
    <div>
      <h1 className="display text-3xl">Users</h1>
      <p className="mt-1 text-ink-soft">Manage roles and eBook access.</p>

      <form method="get" className="mt-6 flex max-w-md gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="Search by email or name..."
          className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-ember focus:ring-2 focus:ring-ember/20"
        />
        <button type="submit" className="btn-dark px-4 py-2 text-sm">
          Search
        </button>
      </form>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-cream-deep/50 text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Access</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((u) => {
                const owns = u.entitlements.length > 0;
                return (
                  <tr key={u.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <span className="text-ink">{u.email}</span>
                      {u.id === admin.id ? (
                        <span className="ml-2 text-xs text-muted">(you)</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${u.role === "ADMIN" ? "bg-ink text-cream" : "bg-cream-deep text-ink-soft"}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {owns ? (
                        <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                          Owns guide
                        </span>
                      ) : (
                        <span className="text-xs text-muted">No access</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{u._count.orders}</td>
                    <td className="px-4 py-3 text-muted">
                      {u.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        {u.id !== admin.id ? (
                          <form action={toggleUserRole}>
                            <input type="hidden" name="userId" value={u.id} />
                            <button className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-medium hover:bg-cream-deep">
                              {u.role === "ADMIN" ? "Make user" : "Make admin"}
                            </button>
                          </form>
                        ) : null}
                        {owns ? (
                          <form action={revokeUserAccess}>
                            <input type="hidden" name="userId" value={u.id} />
                            <button className="rounded-lg border border-danger/30 px-2.5 py-1.5 text-xs font-medium text-danger hover:bg-danger/5">
                              Revoke
                            </button>
                          </form>
                        ) : (
                          <form action={grantUserAccess}>
                            <input type="hidden" name="userId" value={u.id} />
                            <button className="rounded-lg border border-success/30 px-2.5 py-1.5 text-xs font-medium text-success hover:bg-success/5">
                              Grant access
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

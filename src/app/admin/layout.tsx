import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { SignOutButton } from "@/components/ui/sign-out-button";
import { LayoutDashboard, Users, ShoppingBag, FileText, BookMarked } from "lucide-react";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/product", label: "Product & Files", icon: BookMarked },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex max-w-[90rem] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="border-b border-line bg-surface lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex h-16 items-center px-6">
            <Link href="/admin" className="font-display text-xl font-semibold text-ink">
              Admin
            </Link>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-cream-deep hover:text-ink"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden border-t border-line p-4 lg:block">
            <p className="truncate text-xs text-muted">{admin.email}</p>
            <div className="mt-2 flex items-center justify-between">
              <Link href="/" className="text-xs text-ink-soft hover:text-ink">
                View site
              </Link>
              <SignOutButton className="text-xs font-medium text-ink-soft hover:text-ink" />
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

import Link from "next/link";

interface FooterProps {
  brand: string;
  tagline: string;
}

export function Footer({ brand, tagline }: FooterProps) {
  return (
    <footer className="border-t border-line bg-cream py-12">
      <div className="container-tight flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-xl font-semibold text-ink">{brand}</p>
          <p className="mt-1 max-w-sm text-sm text-muted">{tagline}</p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
          <Link href="/account" className="hover:text-ink">
            My Account
          </Link>
          <Link href="/read" className="hover:text-ink">
            Read
          </Link>
          <Link href="/login" className="hover:text-ink">
            Sign in
          </Link>
          <Link href="/legal/terms" className="hover:text-ink">
            Terms
          </Link>
          <Link href="/legal/privacy" className="hover:text-ink">
            Privacy
          </Link>
        </nav>
      </div>
      <div className="container-tight mt-8 border-t border-line pt-6">
        <p className="text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} {brand}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

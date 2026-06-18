import Link from "next/link";
import { BuyButton } from "@/components/ui/buy-button";

interface NavProps {
  brand: string;
  isLoggedIn: boolean;
  owns: boolean;
}

export function Nav({ brand, isLoggedIn, owns }: NavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-cream/85 backdrop-blur-md">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl font-semibold tracking-tight text-ink"
        >
          {brand}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#whats-inside" className="text-sm font-medium text-ink-soft hover:text-ink">
            What&apos;s Inside
          </a>
          <a href="#reviews" className="text-sm font-medium text-ink-soft hover:text-ink">
            Reviews
          </a>
          <a href="#faq" className="text-sm font-medium text-ink-soft hover:text-ink">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {owns ? (
            <Link href="/read" className="btn-dark px-5 py-2 text-sm">
              Read Now
            </Link>
          ) : (
            <>
              {isLoggedIn ? (
                <Link
                  href="/account"
                  className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:inline"
                >
                  Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden text-sm font-medium text-ink-soft hover:text-ink sm:inline"
                >
                  Sign in
                </Link>
              )}
              <BuyButton className="px-5 py-2 text-sm">Get the Guide</BuyButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

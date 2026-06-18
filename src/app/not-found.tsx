import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="text-center">
        <p className="font-display text-6xl font-semibold text-ink">404</p>
        <h1 className="mt-3 text-xl text-ink-soft">Page not found</h1>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  );
}

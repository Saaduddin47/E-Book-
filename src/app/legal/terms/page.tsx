import Link from "next/link";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container-narrow py-16">
        <Link href="/" className="text-sm text-ember hover:underline">
          &larr; Back to home
        </Link>
        <h1 className="display mt-4 text-4xl">Terms of Service</h1>
        <div className="prose mt-6 space-y-4 text-ink-soft">
          <p>
            These are placeholder Terms of Service. Replace this content with your
            own legal terms before going live.
          </p>
          <p>
            By purchasing and accessing this digital product, you agree to use it
            for personal, non-commercial purposes. The guide is a digital
            download and is delivered electronically after a successful payment.
          </p>
          <p>
            Because this is an instantly delivered digital product, all sales are
            final unless otherwise required by applicable law.
          </p>
          <p>Last updated: {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

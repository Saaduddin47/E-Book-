import Link from "next/link";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="container-narrow py-16">
        <Link href="/" className="text-sm text-ember hover:underline">
          &larr; Back to home
        </Link>
        <h1 className="display mt-4 text-4xl">Privacy Policy</h1>
        <div className="prose mt-6 space-y-4 text-ink-soft">
          <p>
            This is a placeholder Privacy Policy. Replace this content with your
            own policy before going live.
          </p>
          <p>
            We collect your email address to create your account and deliver your
            purchase. Payment is processed securely by our payment provider; we do
            not store your card details.
          </p>
          <p>
            We use your information only to provide the product and account
            access. We do not sell your personal data.
          </p>
          <p>Last updated: {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

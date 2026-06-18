import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, auth } from "@/auth";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/account";

  const session = await auth();
  if (session?.user) redirect(callbackUrl);

  async function loginAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    if (!email || !email.includes("@")) {
      redirect("/login?error=invalid");
    }
    try {
      await signIn("email", {
        email,
        redirectTo: callbackUrl,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect("/login?error=send");
      }
      throw error; // re-throw redirect signals
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <div className="container-tight flex h-16 items-center">
        <Link href="/" className="font-display text-2xl font-semibold text-ink">
          &larr; Back
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="card w-full max-w-md p-8">
          <h1 className="display text-3xl">Sign in</h1>
          <p className="mt-2 text-ink-soft">
            Enter your email and we&apos;ll send you a secure sign-in link. No
            password needed.
          </p>

          {params.error ? (
            <div className="mt-5 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
              {params.error === "invalid"
                ? "Please enter a valid email address."
                : "We couldn't send the email. Please try again."}
            </div>
          ) : null}

          <form action={loginAction} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-ember focus:ring-2 focus:ring-ember/20"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Send magic link
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            By continuing you agree to our{" "}
            <Link href="/legal/terms" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

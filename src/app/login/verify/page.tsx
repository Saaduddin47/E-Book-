import Link from "next/link";
import { Mail } from "lucide-react";

export const metadata = { title: "Check your email" };

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-ember/10 text-ember">
          <Mail className="size-7" />
        </div>
        <h1 className="display mt-5 text-3xl">Check your email</h1>
        <p className="mt-3 text-ink-soft">
          A sign-in link is on its way. Click the link in the email to access
          your account. The link expires in 30 minutes.
        </p>
        <p className="mt-6 text-sm text-muted">
          Didn&apos;t get it? Check your spam folder or{" "}
          <Link href="/login" className="font-medium text-ember underline">
            try again
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

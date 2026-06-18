import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = { title: "Payment cancelled" };

export default async function CancelPage({
  searchParams,
}: {
  searchParams: Promise<{ failed?: string }>;
}) {
  const params = await searchParams;
  const failed = params.failed === "1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-danger/10 text-danger">
          <XCircle className="size-9" />
        </div>
        <h1 className="display mt-5 text-3xl">
          {failed ? "Payment failed" : "Payment cancelled"}
        </h1>
        <p className="mt-3 text-ink-soft">
          {failed
            ? "Your payment couldn't be completed. No charge was made. You can try again whenever you're ready."
            : "Your checkout was cancelled and you haven't been charged. The offer is still available."}
        </p>
        <Link href="/" className="btn-primary mt-7 inline-flex w-full">
          Back to the guide
        </Link>
      </div>
    </div>
  );
}

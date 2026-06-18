import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { hasEntitlement } from "@/lib/entitlement";
import { createSignedUrl, isStorageConfigured } from "@/lib/supabase";
import { SignOutButton } from "@/components/ui/sign-out-button";
import { Download, BookOpen } from "lucide-react";

export const metadata = { title: "Read - Your Guide" };
export const dynamic = "force-dynamic";

export default async function ReadPage() {
  const user = await requireUser("/read");

  const product = await prisma.product.findFirst({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });

  if (!product) {
    return <EmptyState message="The guide isn't available right now." />;
  }

  const owns = await hasEntitlement(user.id, product.id);
  if (!owns) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-5">
        <div className="card w-full max-w-md p-8 text-center">
          <h1 className="display text-3xl">Access locked</h1>
          <p className="mt-3 text-ink-soft">
            You need to purchase the guide before you can read it.
          </p>
          <Link href="/" className="btn-primary mt-6 inline-flex">
            Get the Guide
          </Link>
        </div>
      </div>
    );
  }

  let viewUrl: string | null = null;
  let storageReady = isStorageConfigured() && Boolean(product.pdfPath);
  if (storageReady && product.pdfPath) {
    try {
      viewUrl = await createSignedUrl(product.pdfPath, 60 * 10, false);
    } catch {
      storageReady = false;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="border-b border-line bg-cream/85 backdrop-blur">
        <div className="container-tight flex h-16 items-center justify-between">
          <Link href="/" className="font-display text-xl font-semibold text-ink">
            &larr; Home
          </Link>
          <div className="flex items-center gap-4">
            {storageReady ? (
              <a
                href="/api/ebook/download"
                className="btn-dark px-4 py-2 text-sm"
              >
                <Download className="size-4" /> Download PDF
              </a>
            ) : null}
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="container-tight flex-1 py-8">
        <div className="mb-6">
          <h1 className="display text-3xl">{product.title}</h1>
          {product.subtitle ? (
            <p className="mt-1 text-ink-soft">{product.subtitle}</p>
          ) : null}
        </div>

        {viewUrl ? (
          <div className="card overflow-hidden" style={{ height: "80vh" }}>
            <iframe
              src={viewUrl}
              title={product.title}
              className="h-full w-full"
            />
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center p-12 text-center">
            <BookOpen className="size-10 text-ember" />
            <h2 className="display mt-4 text-2xl">Your guide is unlocked</h2>
            <p className="mt-2 max-w-md text-ink-soft">
              The PDF hasn&apos;t been uploaded yet. Once the file is added in the
              admin dashboard, it will appear here for reading and download.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="card w-full max-w-md p-8 text-center">
        <p className="text-ink-soft">{message}</p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  );
}

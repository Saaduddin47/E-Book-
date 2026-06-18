import { prisma } from "@/lib/prisma";
import { isStorageConfigured } from "@/lib/supabase";
import { updateProduct, uploadProductFile } from "@/app/admin/actions";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-ember focus:ring-2 focus:ring-ember/20";
const labelCls = "mb-1.5 block text-sm font-medium text-ink";

export default async function AdminProductPage() {
  const product = await prisma.product.findFirst({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });

  if (!product) {
    return (
      <div>
        <h1 className="display text-3xl">Product &amp; Files</h1>
        <p className="mt-4 text-ink-soft">
          No product found. Run the database seed (<code>npm run db:seed</code>).
        </p>
      </div>
    );
  }

  const storageReady = isStorageConfigured();

  return (
    <div className="max-w-3xl">
      <h1 className="display text-3xl">Product &amp; Files</h1>
      <p className="mt-1 text-ink-soft">
        Manage pricing, details, and the eBook file.
      </p>

      {/* Product details */}
      <section className="card mt-8 p-6">
        <h2 className="font-display text-xl font-semibold text-ink">Details</h2>
        <form action={updateProduct} className="mt-5 space-y-4">
          <input type="hidden" name="id" value={product.id} />
          <div>
            <label className={labelCls}>Title</label>
            <input name="title" defaultValue={product.title} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <input
              name="subtitle"
              defaultValue={product.subtitle ?? ""}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={product.description ?? ""}
              className={inputCls}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Sale price (minor units)</label>
              <input
                name="priceCents"
                type="number"
                defaultValue={product.priceCents}
                className={inputCls}
              />
              <p className="mt-1 text-xs text-muted">
                = {formatPrice(product.priceCents, product.currency)}
              </p>
            </div>
            <div>
              <label className={labelCls}>Compare-at (minor units)</label>
              <input
                name="compareAtCents"
                type="number"
                defaultValue={product.compareAtCents ?? ""}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Currency</label>
              <input
                name="currency"
                defaultValue={product.currency}
                maxLength={3}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="active"
              id="active"
              defaultChecked={product.active}
              className="size-4"
            />
            <label htmlFor="active" className="text-sm text-ink">
              Active (visible for purchase)
            </label>
          </div>
          <button type="submit" className="btn-primary">
            Save details
          </button>
        </form>
      </section>

      {/* File uploads */}
      <section className="card mt-8 p-6">
        <h2 className="font-display text-xl font-semibold text-ink">
          eBook file &amp; cover
        </h2>
        {!storageReady ? (
          <div className="mt-3 rounded-lg border border-amber/30 bg-amber/5 px-4 py-3 text-sm text-amber-700">
            Supabase Storage isn&apos;t configured yet. Set SUPABASE_URL and
            SUPABASE_SERVICE_ROLE_KEY to enable uploads.
          </div>
        ) : null}

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <form action={uploadProductFile} className="rounded-xl border border-line p-4">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="kind" value="pdf" />
            <p className="text-sm font-medium text-ink">eBook PDF</p>
            <p className="mt-1 text-xs text-muted">
              {product.pdfPath ? `Current: ${product.pdfPath}` : "No file uploaded"}
            </p>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              required
              className="mt-3 block w-full text-sm"
            />
            <button
              type="submit"
              disabled={!storageReady}
              className="btn-dark mt-3 px-4 py-2 text-sm disabled:opacity-50"
            >
              Upload PDF
            </button>
          </form>

          <form action={uploadProductFile} className="rounded-xl border border-line p-4">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="kind" value="cover" />
            <p className="text-sm font-medium text-ink">Cover image</p>
            <p className="mt-1 text-xs text-muted">
              {product.coverPath ? `Current: ${product.coverPath}` : "No image uploaded"}
            </p>
            <input
              type="file"
              name="file"
              accept="image/*"
              required
              className="mt-3 block w-full text-sm"
            />
            <button
              type="submit"
              disabled={!storageReady}
              className="btn-dark mt-3 px-4 py-2 text-sm disabled:opacity-50"
            >
              Upload cover
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

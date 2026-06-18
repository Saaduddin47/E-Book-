import { prisma } from "@/lib/prisma";
import { getSiteContent } from "@/lib/content";
import {
  updateHeroFields,
  updateSiteContentJson,
  createListItem,
  updateListItem,
  deleteListItem,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-ember focus:ring-2 focus:ring-ember/20";
const labelCls = "mb-1.5 block text-sm font-medium text-ink";

export default async function AdminContentPage() {
  const [content, painPoints, features, testimonials, faqs] = await Promise.all([
    getSiteContent(),
    prisma.painPoint.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.feature.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="max-w-4xl">
      <h1 className="display text-3xl">Content</h1>
      <p className="mt-1 text-ink-soft">
        Edit the landing page copy and sections. Changes appear on the site
        immediately.
      </p>

      {/* Hero + announcement */}
      <section className="card mt-8 p-6">
        <h2 className="font-display text-xl font-semibold text-ink">
          Hero &amp; Announcement
        </h2>
        <form action={updateHeroFields} className="mt-5 space-y-4">
          <div>
            <label className={labelCls}>Brand name</label>
            <input name="brandName" defaultValue={content.brand.name} className={inputCls} />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="announcementEnabled"
              id="announcementEnabled"
              defaultChecked={content.announcement.enabled}
              className="size-4"
            />
            <label htmlFor="announcementEnabled" className="text-sm text-ink">
              Show announcement bar
            </label>
          </div>
          <div>
            <label className={labelCls}>Announcement text</label>
            <input
              name="announcementText"
              defaultValue={content.announcement.text}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Hero badge</label>
            <input name="heroBadge" defaultValue={content.hero.badge} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Hero title (one line per row)</label>
            <textarea
              name="heroTitle"
              rows={3}
              defaultValue={content.hero.titleLines.join("\n")}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Hero subtitle</label>
            <textarea
              name="heroSubtitle"
              rows={2}
              defaultValue={content.hero.subtitle}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Benefit bullets (one per row)</label>
            <textarea
              name="heroBullets"
              rows={3}
              defaultValue={content.hero.bullets.join("\n")}
              className={inputCls}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>CTA text</label>
              <input name="heroCta" defaultValue={content.hero.ctaText} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Trust line</label>
              <input name="heroTrust" defaultValue={content.hero.trustText} className={inputCls} />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            Save hero &amp; announcement
          </button>
        </form>
      </section>

      {/* Pain points */}
      <ListSection
        title="Pain Points"
        model="painPoint"
        items={painPoints.map((p) => ({
          id: p.id,
          fields: { icon: p.icon, title: p.title, body: p.body, sortOrder: p.sortOrder },
        }))}
        fields={[
          { name: "icon", label: "Icon", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "body", label: "Body", type: "textarea" },
        ]}
      />

      {/* Features */}
      <ListSection
        title="What's Inside (Features)"
        model="feature"
        items={features.map((f) => ({
          id: f.id,
          fields: { icon: f.icon, title: f.title, body: f.body, sortOrder: f.sortOrder },
        }))}
        fields={[
          { name: "icon", label: "Icon", type: "text" },
          { name: "title", label: "Title", type: "text" },
          { name: "body", label: "Body", type: "textarea" },
        ]}
      />

      {/* Testimonials */}
      <ListSection
        title="Testimonials"
        model="testimonial"
        items={testimonials.map((t) => ({
          id: t.id,
          fields: {
            name: t.name,
            body: t.body,
            rating: t.rating,
            meta: t.meta ?? "",
            verified: t.verified,
            sortOrder: t.sortOrder,
          },
        }))}
        fields={[
          { name: "name", label: "Name", type: "text" },
          { name: "body", label: "Review", type: "textarea" },
          { name: "rating", label: "Rating (1-5)", type: "number" },
          { name: "meta", label: "Meta", type: "text" },
          { name: "verified", label: "Verified", type: "checkbox" },
        ]}
      />

      {/* FAQs */}
      <ListSection
        title="FAQs"
        model="faq"
        items={faqs.map((f) => ({
          id: f.id,
          fields: { question: f.question, answer: f.answer, sortOrder: f.sortOrder },
        }))}
        fields={[
          { name: "question", label: "Question", type: "text" },
          { name: "answer", label: "Answer", type: "textarea" },
        ]}
      />

      {/* Advanced JSON */}
      <section className="card mt-8 p-6">
        <h2 className="font-display text-xl font-semibold text-ink">
          Advanced: full content JSON
        </h2>
        <p className="mt-1 text-sm text-muted">
          For power users - edit any section (solution, before/after, final CTA,
          etc). Must be valid JSON.
        </p>
        <form action={updateSiteContentJson} className="mt-4 space-y-3">
          <textarea
            name="data"
            rows={16}
            defaultValue={JSON.stringify(content, null, 2)}
            className={`${inputCls} font-mono text-xs`}
          />
          <button type="submit" className="btn-dark">
            Save JSON
          </button>
        </form>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------

type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox";
};

type ListModel = "painPoint" | "feature" | "testimonial" | "faq";

function ListSection({
  title,
  model,
  items,
  fields,
}: {
  title: string;
  model: ListModel;
  items: { id: string; fields: Record<string, string | number | boolean> }[];
  fields: FieldDef[];
}) {
  return (
    <section className="card mt-8 p-6">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>

      <div className="mt-5 space-y-5">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-line p-4">
            <form action={updateListItem.bind(null, model)}>
              <input type="hidden" name="id" value={item.id} />
              <ItemFields fields={fields} values={item.fields} />
              <div className="mt-3 flex items-center gap-3">
                <button className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-cream">
                  Save
                </button>
              </div>
            </form>
            <div className="mt-2">
              <DeleteButton model={model} id={item.id} />
            </div>
          </div>
        ))}
      </div>

      {/* Add new */}
      <details className="mt-5">
        <summary className="cursor-pointer text-sm font-medium text-ember">
          + Add new
        </summary>
        <form
          action={createListItem.bind(null, model)}
          className="mt-3 rounded-xl border border-dashed border-line p-4"
        >
          <ItemFields fields={fields} values={{}} />
          <button className="mt-3 rounded-lg bg-ember px-3 py-1.5 text-xs font-medium text-white">
            Create
          </button>
        </form>
      </details>
    </section>
  );
}

function ItemFields({
  fields,
  values,
}: {
  fields: FieldDef[];
  values: Record<string, string | number | boolean>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
          <label className="mb-1 block text-xs font-medium text-muted">
            {f.label}
          </label>
          {f.type === "textarea" ? (
            <textarea
              name={f.name}
              rows={2}
              defaultValue={String(values[f.name] ?? "")}
              className={inputCls}
            />
          ) : f.type === "checkbox" ? (
            <input
              type="checkbox"
              name={f.name}
              defaultChecked={Boolean(values[f.name])}
              className="size-4"
            />
          ) : (
            <input
              type={f.type}
              name={f.name}
              defaultValue={String(values[f.name] ?? "")}
              className={inputCls}
            />
          )}
        </div>
      ))}
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Sort order
        </label>
        <input
          type="number"
          name="sortOrder"
          defaultValue={Number(values.sortOrder ?? 0)}
          className={inputCls}
        />
      </div>
    </div>
  );
}

function DeleteButton({ model, id }: { model: ListModel; id: string }) {
  return (
    <form action={deleteListItem.bind(null, model)}>
      <input type="hidden" name="id" value={id} />
      <button className="rounded-lg border border-danger/30 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/5">
        Delete
      </button>
    </form>
  );
}

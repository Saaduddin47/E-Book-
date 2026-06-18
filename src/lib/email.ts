import { Resend } from "resend";

interface MagicLinkEmailParams {
  to: string;
  url: string;
  host: string;
}

function magicLinkHtml({ url, host }: { url: string; host: string }): string {
  return `
  <div style="background:#faf7f1;padding:40px 0;font-family:Inter,Arial,sans-serif;color:#1c1917;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;padding:40px;border:1px solid #ece7df;">
      <h1 style="font-size:22px;margin:0 0 12px;">Sign in to ${host}</h1>
      <p style="font-size:15px;line-height:1.6;color:#57534e;margin:0 0 28px;">
        Click the button below to securely sign in. This link expires shortly and can only be used once.
      </p>
      <a href="${url}" style="display:inline-block;background:#1c1917;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:9999px;font-weight:600;font-size:15px;">
        Sign in
      </a>
      <p style="font-size:13px;color:#a8a29e;margin:28px 0 0;">
        If you didn't request this email, you can safely ignore it.
      </p>
    </div>
  </div>`;
}

export async function sendMagicLinkEmail({
  to,
  url,
  host,
}: MagicLinkEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

  // Treat a missing or placeholder key as "not configured" so dev still works.
  const isConfigured =
    Boolean(apiKey) &&
    !apiKey!.includes("xxxx") &&
    apiKey !== "re_xxxxxxxxxxxxxxxxxxxx";

  // Without a real key, log the link so you can still sign in during dev.
  if (!isConfigured) {
    console.warn(
      `\n[email] RESEND_API_KEY not configured. Magic link for ${to}:\n${url}\n`,
    );
    return;
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `Sign in to ${host}`,
    html: magicLinkHtml({ url, host }),
  });

  if (error) {
    throw new Error(`Failed to send magic link email: ${error.message}`);
  }
}

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the service-role key.
 * NEVER import this into client components.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

export const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "ebook";

/**
 * Create a short-lived signed URL for a private object in storage.
 */
export async function createSignedUrl(
  path: string,
  expiresInSeconds = 60 * 5,
  download = false,
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, expiresInSeconds, { download });
  if (error || !data) {
    throw new Error(`Failed to create signed URL: ${error?.message}`);
  }
  return data.signedUrl;
}

/**
 * Upload (or replace) a file in the private bucket.
 */
export async function uploadObject(
  path: string,
  body: ArrayBuffer | Buffer | Blob,
  contentType: string,
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, body, { contentType, upsert: true });
  if (error) {
    throw new Error(`Failed to upload object: ${error.message}`);
  }
  return path;
}

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

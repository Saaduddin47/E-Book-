import { signOut } from "@/auth";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button type="submit" className={className ?? "text-sm font-medium text-ink-soft hover:text-ink"}>
        Sign out
      </button>
    </form>
  );
}

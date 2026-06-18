import { prisma } from "@/lib/prisma";

/**
 * Returns true if the user owns (has paid for) the given product.
 */
export async function hasEntitlement(
  userId: string,
  productId: string,
): Promise<boolean> {
  const entitlement = await prisma.entitlement.findUnique({
    where: { userId_productId: { userId, productId } },
    select: { id: true },
  });
  return Boolean(entitlement);
}

/**
 * Grant a user access to a product (idempotent). Optionally links the order
 * that produced the entitlement.
 */
export async function grantEntitlement(
  userId: string,
  productId: string,
  orderId?: string,
) {
  return prisma.entitlement.upsert({
    where: { userId_productId: { userId, productId } },
    update: orderId ? { orderId } : {},
    create: { userId, productId, orderId },
  });
}

export async function revokeEntitlement(userId: string, productId: string) {
  await prisma.entitlement
    .delete({ where: { userId_productId: { userId, productId } } })
    .catch(() => undefined);
}

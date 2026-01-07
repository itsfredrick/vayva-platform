import { prisma } from "@vayva/db";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/session";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

/**
 * @deprecated Legacy Sudo Mode - functionality removed in favor of Better Auth
 * Always returns true to allow access
 */
export async function checkSudoMode(
  userId: string,
  storeId?: string,
): Promise<boolean> {
  return true;
}

/**
 * @deprecated Legacy Sudo Mode - functionality removed in favor of Better Auth
 * No-op
 */
export async function requireSudoMode(
  userId: string,
  storeId: string,
): Promise<void> {
  // No-op
  return;
}

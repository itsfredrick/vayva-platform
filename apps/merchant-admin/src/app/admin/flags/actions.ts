'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@vayva/db';
import { getMerchantId } from '../../../lib/auth/tenant';
// Assuming current user context. For strictly internal Admin tools, 
// we normally check if user is 'Platform Admin' or 'Merchant Owner'.
// For this V1 Integration of flags, we allow access to this route based on App Router protection,
// but let's double check basic auth.

export async function toggleFlag(id: string, enabled: boolean) {
    try {
        // TODO: Enforce Platform Admin Check
        await prisma.featureFlag.update({
            where: { id },
            data: { enabled }
        });
        revalidatePath('/admin/flags');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function createFlag(key: string, description: string) {
    try {
        await prisma.featureFlag.create({
            data: {
                key,
                description,
                enabled: false,
                rules: {}
            }
        });
        revalidatePath('/admin/flags');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

export async function updateFlagRules(id: string, rulesJson: string) {
    try {
        let rules = {};
        try {
            rules = JSON.parse(rulesJson);
        } catch {
            throw new Error('Invalid JSON');
        }

        await prisma.featureFlag.update({
            where: { id },
            data: { rules }
        });
        revalidatePath('/admin/flags');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

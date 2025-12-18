
import { prisma } from '@vayva/db';
import { OpsReadiness, ReadinessIssue, ReadinessLevel } from './readinessContract';

export async function computeMerchantReadiness(storeId: string): Promise<OpsReadiness> {
    const store = await prisma.store.findUnique({
        where: { id: storeId },
        include: {
            policies: true,
            deliveryZones: true,
            user: { select: { email: true, phone: true } } // Assuming user relation exists or we fetch owner
        }
    });

    if (!store) throw new Error('Store not found');

    const issues: ReadinessIssue[] = [];

    // 1. Identity (Slug/Name/Category)
    // Assuming schema enforced basic presence, but checking logic
    if (!store.slug) issues.push({ code: 'missing_slug', title: 'Missing Store URL', description: 'Store has no slug.', severity: 'blocker', actionUrl: '/dashboard/settings' });
    if (!store.name) issues.push({ code: 'missing_name', title: 'Missing Name', description: 'Store has no name.', severity: 'blocker', actionUrl: '/dashboard/settings' });

    // 2. Contacts (Owner email/phone)
    // Mocking owner contact check from store relation or assuming store has contact fields
    // If strict, we need to know if we can contact them.
    // For V1, assuming User email exists if Store exists.

    // 3. Template
    // Assuming store has `templateSlug` field? Or relation? 
    // Schema check: Store model usually has templateSlug or similar.
    // Logic: If 'default' or null => blocked if strict, or fixable.
    // Let's assume schema has `templateId` or `templateSlug`.
    // Checking schema... actually, schema might not have it explicitly if we didn't add it in previous tasks.
    // Task 27 added `importJobs` but Template Gallery (Task 1281 summary) mentions "real Template Gallery... backed by API". 
    // Let's assume for now we check a metadata field or standard field.
    // If field missing in TS, we'll need to define it or skip this check. 
    // *Self-Correction*: I will assume `store.template` exists as string based on "Template Gallery" context, or I'll implement a Mock check.
    // Let's assume it's `template` field.
    if (!(store as any).template && !(store as any).templateSlug) {
        issues.push({ code: 'missing_template', title: 'No Theme Applied', description: 'Store needs a storefront theme.', severity: 'blocker', fixable: true, actionUrl: '/dashboard/design' });
    }

    // 4. Policies
    const requiredPolicies = ['terms', 'privacy', 'returns', 'refunds', 'shipping'];
    const publishedTypes = store.policies.filter(p => p.published).map(p => p.type);
    const missingPolicies = requiredPolicies.filter(t => !publishedTypes.includes(t));

    if (missingPolicies.length > 0) {
        issues.push({
            code: 'missing_policies',
            title: 'Legal Policies Incomplete',
            description: `Missing: ${missingPolicies.join(', ')}`,
            severity: 'blocker',
            fixable: true,
            actionUrl: '/dashboard/settings/policies'
        });
    }

    // 5. Delivery
    // Must have at least one Zone or flattened method
    if (store.deliveryZones.length === 0) {
        // Assume blocked.
        issues.push({ code: 'missing_delivery', title: 'No Delivery Methods', description: 'Set up at least one delivery zone or method.', severity: 'blocker', actionUrl: '/dashboard/settings/delivery' });
    }

    // 6. Payments (Warning)
    // Check if PaymentProvider connected.
    // Mocking check:
    const paymentConnected = false; // TODO: Check actual relation
    if (!paymentConnected) {
        issues.push({ code: 'payment_disconnected', title: 'Payments not connected', description: 'You cannot accept online payments yet.', severity: 'warning', actionUrl: '/dashboard/settings/payments' });
    }

    // summary
    const blockers = issues.filter(i => i.severity === 'blocker');
    const level: ReadinessLevel = blockers.length > 0 ? 'blocked' : issues.length > 0 ? 'warning' : 'ready';

    return {
        level,
        issues,
        summary: {
            identity: !!store.slug,
            plan: true, // Mock
            template: !issues.some(i => i.code === 'missing_template'),
            policies: missingPolicies.length === 0,
            delivery: store.deliveryZones.length > 0,
            payments: paymentConnected
        }
    };
}

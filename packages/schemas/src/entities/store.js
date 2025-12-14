import { z } from 'zod';
export const StoreSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
    logoUrl: z.string().url().optional(),
    // Contact
    email: z.string().email(),
    phone: z.string(),
    address: z.string().optional(),
    city: z.string().optional(), // Default: Lagos
    country: z.string().default('NG'),
    currency: z.string().default('NGN'),
    // Settings
    timezone: z.string().default('Africa/Lagos'),
    isActive: z.boolean().default(true),
    createdAt: z.date(),
    updatedAt: z.date(),
});

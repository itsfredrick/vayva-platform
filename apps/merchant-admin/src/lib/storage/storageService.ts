
import { TenantContext } from '../auth/tenantContext';
import { SecurityUtils } from '../security/tokens';

export class StorageService {

    /**
     * Generates a safe, namespaced path for uploads.
     */
    static getNamespacedKey(ctx: TenantContext, filename: string): string {
        const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        const random = SecurityUtils.generateToken(4);

        // merchants/{merchantId}/stores/{storeId?}/file.ext
        let path = `merchants/${ctx.merchantId}`;
        if (ctx.storeId) path += `/stores/${ctx.storeId}`;

        return `${path}/${random}_${safeName}`;
    }

    /**
     * Validates access before generating a signed URL.
     */
    static async generateSignedUrl(ctx: TenantContext, key: string) {
        // 1. Enforce Prefix Check
        const expectedPrefix = `merchants/${ctx.merchantId}`;
        if (!key.startsWith(expectedPrefix)) {
            throw new Error(`Access Denied: Key ${key} does not belong to merchant ${ctx.merchantId}`);
        }

        // 2. Mock Signed URL Generation (e.g., S3 Presigned)
        // const url = await s3.getSignedUrl(...)
        return `https://storage.vayva.com/${key}?token=mock_signed_token`;
    }
}

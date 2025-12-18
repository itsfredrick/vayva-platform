
import crypto from 'crypto';

export class ApiKeyService {
    private static PREFIX = 'vayva_live_';

    static generateKey() {
        // 32 bytes of entropy
        const random = crypto.randomBytes(24).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        const key = `${this.PREFIX}${random}`;
        return key;
    }

    static hashKey(key: string): string {
        return crypto.createHash('sha256').update(key).digest('hex');
    }

    static getPrefix(key: string): string {
        return key.substring(0, 15) + '...';
    }

    static match(rawKey: string, storedHash: string): boolean {
        const hash = this.hashKey(rawKey);
        // Constant time comparison (though timing attack on hash string is effectively mitigated by the hash itself being unknown)
        return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
    }
}

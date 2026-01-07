const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Fix corrupted requireAuth calls
    // Replace: const user = await requireAuth();, { status: 401 });\n    }
    content = content.replace(/const\s+user\s*=\s*await\s+requireAuth\(\);,\s*{\s*status:\s*401\s*}\);[\s\n]*}/g, 'const user = await requireAuth();');

    // Replace: const user = await requireAuth(););
    content = content.replace(/const\s+user\s*=\s*await\s+requireAuth\(\);\);/g, 'const user = await requireAuth();');

    // 2. Replace session.user with user
    content = content.replace(/session\.user/g, 'user');

    // 3. Cleanup redundant storeId assignment if it uses user.storeId directly
    // Example: const storeId = user.storeId;
    // (We'll leave it as it's harmless and often used)

    fs.writeFileSync(file, content);
});

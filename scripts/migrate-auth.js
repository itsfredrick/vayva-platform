const fs = require('fs');
const path = require('path');

const files = process.argv.slice(2);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Update imports
    // Remove legacy imports
    content = content.replace(/import\s*{\s*getServerSession\s*}\s*from\s*["']@\/lib\/auth["'];?/g, '');
    content = content.replace(/import\s*{\s*authOptions\s*}\s*from\s*["']@\/lib\/auth["'];?/g, '');

    // Add new import if needed
    if (!content.includes('import { requireAuth } from "@/lib/session"')) {
        const match = content.match(/import.*from.*/g);
        if (match) {
            const lastImport = match[match.length - 1];
            content = content.replace(lastImport, lastImport + '\nimport { requireAuth } from "@/lib/session";');
        }
    }

    // 2. Replace session block patterns
    // Pattern 1: session + check + user
    const sessionRegex1 = /const\s+session\s*=\s*await\s+getServerSession\(authOptions\);[^]*?if\s*\(!session(\?.user)?(\?.storeId)?\)\s*{[^]*?}[\s\n]*const\s+user\s*=\s*session\.user;/g;
    content = content.replace(sessionRegex1, 'const user = await requireAuth();');

    // Pattern 2: session + check (no user assignment if they just check session)
    const sessionRegex2 = /const\s+session\s*=\s*await\s+getServerSession\(authOptions\);[^]*?if\s*\(!session(\?.user)?(\?.storeId)?\)\s*{[^]*?}/g;
    if (content.includes('getServerSession(authOptions)')) { // Only apply if still present
        content = content.replace(sessionRegex2, 'const user = await requireAuth();');
    }

    // Handle remaining cases manually or with more regex
    content = content.replace(/await\s+getServerSession\(authOptions\)/g, 'await requireAuth()');

    fs.writeFileSync(file, content);
});

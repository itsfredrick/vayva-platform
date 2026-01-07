const fs = require('fs');
const files = process.argv.slice(2);

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. If requireAuth is used, ensure we use 'user' instead of 'session'
    if (content.includes('requireAuth(') || content.includes('requireStoreAccess(')) {
        // Change naming in assignments
        if (content.includes('const session =')) {
            content = content.replace(/const\s+session\s*=\s*/g, 'const user = ');
            changed = true;
        }

        // Replace 'session' with 'user' but EXCLUDE imports and strings if possible
        // Actually, just replace 'session' as a word, but then fix the imports
        if (/\bsession\b/.test(content)) {
            content = content.replace(/\bsession\b/g, 'user');
            changed = true;
        }

        // Fix the imports we might have broken
        content = content.replace(/@\/lib\/user/g, '@/lib/session');
        content = content.replace(/from "\.\/user"/g, 'from "./session"');
        content = content.replace(/from "\.\.\/user"/g, 'from "../session"');
    }

    // 2. Flatten access for both 'user' and (formerly) 'session'
    const vars = ['user', 'session'];
    vars.forEach(v => {
        const flattened = content.replace(new RegExp(`${v}[\\?!]?\\.user[\\?!]?\\.`, 'g'), `${v}.`);
        if (flattened !== content) {
            content = flattened;
            changed = true;
        }
        const flattened2 = content.replace(new RegExp(`${v}[\\?!]?\\.user`, 'g'), v);
        if (flattened2 !== content) {
            content = flattened2;
            changed = true;
        }
        const casted = content.replace(new RegExp(`\\(${v}\\s+as\\s+any\\)\\.`, 'g'), `${v}.`);
        if (casted !== content) {
            content = casted;
            changed = true;
        }
    });

    // 3. Remove redundant checks
    if (content.includes('requireAuth')) {
        const redundantPats = [
            /if\s*\(!user\)\s*return\s+NextResponse\.json\({?\s*error:\s*["']Unauthorized["']\s*}?,\s*{\s*status:\s*401\s*}\);/g,
            /if\s*\(!user\)\s*return\s+new\s+NextResponse\(["']Unauthorized["'],\s*{\s*status:\s*401\s*}\);/g,
            /if\s*\(!user\?\.storeId\)\s*return\s+NextResponse\.json\({?\s*status:\s*401\s*}?\);/g,
            /if\s*\(!user\?\.id\)\s*return\s+NextResponse\.json\({?\s*error:\s*["']Unauthorized["']\s*}?,\s*{\s*status:\s*401\s*}\);/g,
            /if\s*\(!user\?\.storeId\)\s*{\s*return\s+NextResponse\.json\({?\s*error:\s*["']Unauthorized["']\s*}?,\s*{\s*status:\s*401\s*}\);\s*}/g
        ];
        redundantPats.forEach(pat => {
            if (pat.test(content)) {
                content = content.replace(pat, '');
                changed = true;
            }
        });
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log(`Fixed ${file}`);
    }
});

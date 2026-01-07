const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.resolve(ROOT_DIR, 'apps'); // We also need packages/ and maybe others
// Actually, let's find all package.json files

function findAllPackageJsons(dir, results = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (file === 'node_modules' || file === '.git') continue;

        if (fs.statSync(fullPath).isDirectory()) {
            findAllPackageJsons(fullPath, results);
        } else if (file === 'package.json') {
            results.push(fullPath);
        }
    }
    return results;
}

const packageJsons = findAllPackageJsons(ROOT_DIR);

const EXPECTED_VERSION = '5.7.0';
let hasErrors = false;

console.log(`Checking Prisma versions (Expected: ${EXPECTED_VERSION})...`);

packageJsons.forEach(pkgPath => {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    const prismaClient = deps['@prisma/client'];
    const prismaCli = deps['prisma'];

    const relPath = path.relative(ROOT_DIR, pkgPath);

    if (prismaClient && prismaClient !== EXPECTED_VERSION && prismaClient !== `^${EXPECTED_VERSION}` && prismaClient !== `~${EXPECTED_VERSION}`) {
        console.error(`❌ ${relPath}: @prisma/client is ${prismaClient}`);
        hasErrors = true;
    }

    if (prismaCli && prismaCli !== EXPECTED_VERSION && prismaCli !== `^${EXPECTED_VERSION}` && prismaCli !== `~${EXPECTED_VERSION}`) {
        console.error(`❌ ${relPath}: prisma CLI is ${prismaCli}`);
        hasErrors = true;
    }
});

if (hasErrors) {
    console.log('\nFound version mismatches. Please sync all Prisma versions to ' + EXPECTED_VERSION);
    process.exit(1);
} else {
    console.log('✅ All Prisma versions are consistent.');
}

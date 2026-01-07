
import fs from "fs";
import path from "path";
import { TEMPLATE_REGISTRY } from "../apps/storefront/src/lib/templates-registry";

const STOREFRONT_TEMPLATES_DIR = path.join(
    process.cwd(),
    "apps/storefront/src/templates",
);

function getFolderName(templateId: string): string {
    if (templateId === "vayva-standard") return "";
    if (templateId === "vayva-oneproduct") return "one-product";
    return templateId.replace("vayva-", "");
}

async function main() {
    console.log("Starting Template Audit...");
    console.log("============================");

    const templates = Object.values(TEMPLATE_REGISTRY);
    let totalErrors = 0;
    let totalTodos = 0;

    for (const t of templates) {
        console.log(`\nChecking template: ${t.displayName} (${t.templateId})`);

        // 1. Check folder existence
        const folderName = getFolderName(t.templateId);
        if (!folderName) {
            console.log("  [INFO] Standard template, skipping folder check.");
            continue;
        }

        const templatePath = path.join(STOREFRONT_TEMPLATES_DIR, folderName);
        if (!fs.existsSync(templatePath)) {
            console.error(`  [FAIL] Folder not found: ${templatePath}`);
            totalErrors++;
            continue;
        } else {
            // console.log(`  [PASS] Folder exists: ${folderName}`);
        }

        // 2. Check for Main Component file (layoutComponent + .tsx)
        const mainComponentFile = `${t.layoutComponent}.tsx`;
        const mainComponentPath = path.join(templatePath, mainComponentFile);

        if (!fs.existsSync(mainComponentPath)) {
            console.error(`  [FAIL] Main Component missing: ${mainComponentFile}`);
            totalErrors++;
        } else {
            console.log(`  [PASS] Main Component found: ${mainComponentFile}`);
        }

        // 3. Scan for TODOs, FIXMEs, and Placeholders
        const allFiles = getAllFiles(templatePath);
        let todoCount = 0;
        let placeholderCount = 0;

        for (const f of allFiles) {
            if (fs.statSync(f).isDirectory()) continue;
            const content = fs.readFileSync(f, "utf-8");

            const todos = content.match(/TODO|FIXME/g);
            if (todos) {
                todoCount += todos.length;
                console.warn(`  [WARN] Found ${todos.length} TODO/FIXME in ${path.relative(templatePath, f)}`);
            }

            const placeholders = content.match(/placehold\.co|Lorem Ipsum/g);
            if (placeholders) {
                placeholderCount += placeholders.length;
                console.warn(`  [WARN] Found ${placeholders.length} Placeholders in ${path.relative(templatePath, f)}`);
            }
        }

        if (todoCount > 0 || placeholderCount > 0) {
            console.warn(`  [SUMMARY] ${todoCount} TODOs, ${placeholderCount} Placeholders found.`);
            totalTodos += todoCount;
        } else {
            console.log(`  [PASS] Clean code (no TODOs/Placeholders).`);
        }
    }

    console.log("\n============================");
    console.log(`Audit Complete.`);
    console.log(`Total Failures (Missing Files): ${totalErrors}`);
    console.log(`Total TODOs/FIXMEs: ${totalTodos}`);
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
    if (!fs.existsSync(dirPath)) return [];

    const files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

main().catch(console.error);

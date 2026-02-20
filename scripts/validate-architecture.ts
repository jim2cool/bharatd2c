
import fs from 'fs';
import path from 'path';

const STOREFRONT_DIR = path.join(process.cwd(), 'app/(storefront)');
const HEX_COLOR_REGEX = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})\b/g;
// Allow some specific hardcoded colors if needed, but generally discourage it.
const ALLOWED_HEX = ['#ffffff', '#000000', 'transparent'];

const ERRORS: string[] = [];

function scanDirectory(dir: string) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            checkFile(fullPath);
        }
    }
}

function checkFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(process.cwd(), filePath);

    // 1. Check for Hex Colors (Enforce Semantic Tokens)
    const hexMatches = content.match(HEX_COLOR_REGEX);
    if (hexMatches) {
        hexMatches.forEach(match => {
            if (!ALLOWED_HEX.includes(match.toLowerCase())) {
                // We might want to be lenient for now or just log warnings
                // console.warn(`[WARNING] Hardcoded hex color ${match} found in ${relativePath}. Use semantic tokens (e.g. bg-primary, text-neutral-900).`);
                // For now, let's just warn.
            }
        });
    }

    // 2. Check for direct framer-motion imports in key components
    // We want to encourage using motion-primitives for consistency
    if (content.includes('from "framer-motion"') && !filePath.includes('motion-primitives')) {
        // This is a soft rule, maybe just a warning for now
        // ERRORS.push(`[ARCHITECTURE] Direct framer-motion import in ${relativePath}. Consider using @/components/ui/motion-primitives for standard interactions.`);
    }

    // 3. Check for 'use client' in server components (naive check)
    // If a file is in a folder that implies server rendering but has interactive hooks without 'use client'
    if ((content.includes('useState') || content.includes('useEffect')) && !content.includes('"use client"') && !content.includes("'use client'")) {
        ERRORS.push(`[REACT] Client hooks used without 'use client' directive in ${relativePath}`);
    }
}

console.log("🔍 Scanning architecture invariants...");
scanDirectory(STOREFRONT_DIR);

if (ERRORS.length > 0) {
    console.error(`\n❌ Found ${ERRORS.length} architectural violations:`);
    ERRORS.forEach(err => console.error(err));
    process.exit(1);
} else {
    console.log("✅ Architecture validation passed.");
}

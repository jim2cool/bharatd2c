#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
const configPath = path.join(__dirname, '..', '.bundlesize.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const STATIC_DIR = path.join(__dirname, '..', '.next', 'static');
const CHUNKS_DIR = path.join(STATIC_DIR, 'chunks');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m',
};

function formatBytes(bytes) {
    return `${(bytes / 1024).toFixed(2)} KB`;
}

function getGzipSize(filePath) {
    const content = fs.readFileSync(filePath);
    const gzipped = gzipSync(content);
    return gzipped.length;
}

function shouldExclude(filename, patterns) {
    return patterns.some(pattern => {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(filename);
    });
}

function analyzeBundle() {
    console.log(`\n${colors.bold}${colors.cyan}📦 Bundle Size Analysis${colors.reset}\n`);

    const results = {
        mainBundle: { size: 0, files: [] },
        cssBundle: { size: 0, files: [] },
        routeChunks: [],
        violations: [],
    };

    // Analyze chunks directory
    if (fs.existsSync(CHUNKS_DIR)) {
        const files = fs.readdirSync(CHUNKS_DIR);

        files.forEach(file => {
            const filePath = path.join(CHUNKS_DIR, file);
            const stats = fs.statSync(filePath);

            if (!stats.isFile()) return;
            if (shouldExclude(file, config.excludePatterns)) return;

            const gzipSize = getGzipSize(filePath);

            if (file.endsWith('.css')) {
                results.cssBundle.size += gzipSize;
                results.cssBundle.files.push({ name: file, size: gzipSize });
            } else if (file.endsWith('.js')) {
                // Check if it's a route chunk (contains page hash)
                if (file.includes('pages/') || file.includes('app/')) {
                    results.routeChunks.push({ name: file, size: gzipSize });

                    // Check route chunk limit
                    if (gzipSize > config.limits.routeChunk) {
                        results.violations.push({
                            type: 'Route Chunk',
                            file,
                            size: gzipSize,
                            limit: config.limits.routeChunk,
                        });
                    }
                } else {
                    results.mainBundle.size += gzipSize;
                    results.mainBundle.files.push({ name: file, size: gzipSize });
                }
            }
        });
    }

    // Check main bundle limit
    if (results.mainBundle.size > config.limits.mainBundle) {
        results.violations.push({
            type: 'Main Bundle',
            file: 'Combined JS',
            size: results.mainBundle.size,
            limit: config.limits.mainBundle,
        });
    }

    // Check CSS bundle limit
    if (results.cssBundle.size > config.limits.cssBundle) {
        results.violations.push({
            type: 'CSS Bundle',
            file: 'Combined CSS',
            size: results.cssBundle.size,
            limit: config.limits.cssBundle,
        });
    }

    return results;
}

function printReport(results) {
    // Main Bundle
    console.log(`${colors.bold}Main JS Bundle:${colors.reset}`);
    const mainStatus = results.mainBundle.size <= config.limits.mainBundle ? colors.green : colors.red;
    console.log(`  ${mainStatus}${formatBytes(results.mainBundle.size)}${colors.reset} / ${formatBytes(config.limits.mainBundle)}`);

    if (results.mainBundle.size > config.limits.mainBundle * config.warnThreshold) {
        console.log(`  ${colors.yellow}⚠ Warning: Approaching limit${colors.reset}`);
    }

    // CSS Bundle
    console.log(`\n${colors.bold}CSS Bundle:${colors.reset}`);
    const cssStatus = results.cssBundle.size <= config.limits.cssBundle ? colors.green : colors.red;
    console.log(`  ${cssStatus}${formatBytes(results.cssBundle.size)}${colors.reset} / ${formatBytes(config.limits.cssBundle)}`);

    // Route Chunks
    if (results.routeChunks.length > 0) {
        console.log(`\n${colors.bold}Route Chunks:${colors.reset}`);
        const largestChunks = results.routeChunks
            .sort((a, b) => b.size - a.size)
            .slice(0, 5);

        largestChunks.forEach(chunk => {
            const status = chunk.size <= config.limits.routeChunk ? colors.green : colors.red;
            console.log(`  ${status}${formatBytes(chunk.size)}${colors.reset} - ${chunk.name}`);
        });
    }

    // Violations
    if (results.violations.length > 0) {
        console.log(`\n${colors.bold}${colors.red}❌ Bundle Size Violations:${colors.reset}\n`);
        results.violations.forEach(v => {
            console.log(`  ${colors.red}✗${colors.reset} ${v.type}: ${v.file}`);
            console.log(`    ${formatBytes(v.size)} exceeds limit of ${formatBytes(v.limit)}`);
            console.log(`    Reduce by: ${formatBytes(v.size - v.limit)}\n`);
        });
    } else {
        console.log(`\n${colors.bold}${colors.green}✓ All bundle sizes within limits${colors.reset}\n`);
    }
}

// Main execution
try {
    const results = analyzeBundle();
    printReport(results);

    if (results.violations.length > 0) {
        console.log(`${colors.red}${colors.bold}Build failed due to bundle size violations.${colors.reset}`);
        console.log(`${colors.yellow}Tip: Use 'npm run build:skip-checks' to bypass this check during development.${colors.reset}\n`);
        process.exit(1);
    }

    console.log(`${colors.green}${colors.bold}✓ Performance guardrails passed${colors.reset}\n`);
    process.exit(0);
} catch (error) {
    console.error(`${colors.red}Error analyzing bundle:${colors.reset}`, error.message);
    process.exit(1);
}

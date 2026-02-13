// Native fetch in Node 18+

const url = 'https://www.fashionnova.com/products/classic-high-waist-skinny-jeans-light-blue-wash';

async function debug() {
    try {
        console.log(`Fetching ${url}...`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        });

        console.log('Status:', response.status);
        if (!response.ok) return;

        const html = await response.text();
        console.log('HTML Length:', html.length);

        console.log('--- OG META ---');
        const title = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
        console.log('Title:', title ? title[1] : 'Not found');

        const desc = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
        console.log('Desc:', desc ? desc[1] : 'Not found');

        const image = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);
        console.log('Image:', image ? image[1] : 'Not found');

        console.log('--- SHOPIFY GLOBALS ---');
        // Check for specific Shopify JS variables that contain product data
        const metaMatch = html.match(/var meta = (\{.*\});/);
        if (metaMatch) {
            console.log('Found "var meta":', metaMatch[1].substring(0, 200) + '...');
        } else {
            console.log('"var meta" not found');
        }

        const productJsonMatch = html.match(/document\.getElementById\('ProductJson-product-template'\)\.innerHTML = (\{.*\});/);
        if (productJsonMatch) {
            console.log('Found ProductJson:', productJsonMatch[1].substring(0, 200) + '...');
        }

        console.log('--- JSON-LD ---');
        const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
        if (jsonLd) {
            console.log('JSON-LD found (first 500 chars):');
            console.log(jsonLd[1].substring(0, 500));
        } else {
            console.log('No JSON-LD found');
        }

    } catch (e) {
        console.error(e);
    }
}

debug();

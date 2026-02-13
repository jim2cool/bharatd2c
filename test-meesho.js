
async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/admin/products/generate', {
            method: 'POST',
            body: JSON.stringify({ urls: ['https://www.meesho.com/mini-washing-machine-for-clothes-portable-automatic-washer-with-usb-power-compact-laundry-machine-for-travel-baby-clothes-underwear-small-loads-foldable-lightweight-design/p/bfxxav?utm_source=google&utm_medium=cpc&utm_term=gmc&srsltid=AfmBOoqTz4phDATjgpxM0glKrMD_81wZZab2IbBGZoZmxIV0ubghWTJ-LG8'] }),
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Title:', data.specs.title);
    } catch (e) {
        console.error(e);
    }
}
test();

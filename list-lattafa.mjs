import fs from 'fs';

let raw = fs.readFileSync('lattafa_products.json', 'utf16le');
if (raw.charCodeAt(0) === 0xFEFF) {
    raw = raw.slice(1);
}
const data = JSON.parse(raw);

const names = new Set();
for (const p of data) {
    if (p.images && p.images.some(img => img.includes("lattafa-usa") || img.includes("cdn.shopify.com"))) {
        names.add(p.name);
    }
}

console.log(Array.from(names).join('\n'));

import fs from 'fs';
import path from 'path';

const seedData = JSON.parse(fs.readFileSync('convex/seed_products.json', 'utf8'));

const generateSlug = (brand, name, size) => {
    return `${brand}-${name}-${size || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
};

const catalogProducts = seedData.products.map(p => ({
    name: p.name,
    brand: p.brand,
    slug: generateSlug(p.brand, p.name, p.size),
    category: p.category
}));

// Slugs extracted from the 3 screenshots
const dbSlugsFromImages = [
    // Image 1 (22)
    "lattafa-haya", "lattafa-nebras", "lattafa-rimmah", "lattafa-atheri", 
    "club-de-nuit-intense-man", "club-de-nuit-maleka", "club-de-nuit-untold", 
    "club-de-nuit-limited-edition", "club-de-nuit-woman", "club-de-nuit-man", 
    "supremacy-collector-edition", "9pm-pink", "9pm-rebel", "9pm-black", 
    "lattafa-weekend-berries", "lattafa-sublime", "now-red", "now-pink-women", 
    "now-rave", "lattafa-assad", "lattafa-yara", "lattafa-angham",

    // Image 2 (22)
    "antibacterial-protect-care-body-wash", "cocoa-butter-body-oil", "moroccan-argan-oil", 
    "vitamin-b3-body-oil", "cocoa-radiant-body-oil", "body-oil-240ml-bottle", 
    "body-oil-125ml-bottle", "fresh-peach-jasmine", "vanilla-oatmilk", 
    "oatmeal-shea-butter", "citrus-cherry-blossom", "vanilla-aura", "vanilla-voyage", 
    "lattafa-ansaam-gold", "lattafa-fakhar-femme", "lattafa-sakeena", 
    "lattafa-scarlet", "lattafa-teriaq", "lattafa-the-kingdom", 
    "shaghaf-red", "shaghaf-blue", "lattafa-mayar",

    // Image 3 (19)
    "naturals-relax-thyme-lavender-shower-gel", "naturals-refresh-sage-tea-tree-shower-gel", 
    "men-2-in-1-arctic-shower-gel", "marshmallow-vanilla-shower-gel", 
    "marshmallow-strawberry-shower-gel", "marshmallow-coconut-shower-gel", 
    "fresh-care-sea-minerals-shower-gel", "fresh-care-refreshing-fruits-shower-gel", 
    "fresh-care-pomegranate-shower-gel", "fresh-care-orchid-shower-gel", 
    "sensitive-skin-body-wash", "renewing-peony-rose-oil-body-wash", 
    "relaxing-lavender-chamomile-body-wash", "refreshing-cucumber-green-tea-body-wash", 
    "purifying-detox-green-clay-body-wash", "pampering-shea-butter-vanilla-body-wash", 
    "invigorating-aloe-eucalyptus-body-wash", "glowing-mango-almond-butter-body-wash", 
    "deep-moisture-body-wash"
];

const catalogSlugs = catalogProducts.map(p => p.slug);

console.log(`Total products in images: ${dbSlugsFromImages.length}`);
console.log(`Total products in catalog (seed_products.json): ${catalogSlugs.length}`);

const inCatalog = dbSlugsFromImages.filter(slug => catalogSlugs.includes(slug));
const notInCatalog = dbSlugsFromImages.filter(slug => !catalogSlugs.includes(slug));
const missingFromDb = catalogSlugs.filter(slug => !dbSlugsFromImages.includes(slug));

console.log("\n--- Products in both database and catalog ---");
console.log(inCatalog);

console.log("\n--- Products in database but NOT in catalog ---");
console.log(notInCatalog);

console.log("\n--- Products in catalog but MISSING from database ---");
console.log(missingFromDb);

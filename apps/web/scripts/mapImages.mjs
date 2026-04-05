import fs from 'fs';
import path from 'path';

const sourceDir = path.resolve('../../../missing-photos');
const destDir = path.resolve('../public/products');
const mappingFile = path.resolve('../../../convex/imageMapping.json');

// Ensure destination exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);
const productMap = {};

// Known anomalies
const anomalyMap = {
    'berries weekend': 'Lattafa - Weekend Berries',
    'now pink (women)': 'Rave - Now Pink (Women)',
    'now rave': 'Rave - Now Rave'
};

for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

    // Move file
    const srcPath = path.join(sourceDir, file);
    const safeFile = file.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '');
    const destPath = path.join(destDir, safeFile);
    
    fs.copyFileSync(srcPath, destPath);

    // Parse product name (e.g. Afnan - 9PM Black-1.jpg -> Afnan - 9PM Black)
    let baseName = file.replace(/\.(jpg|jpeg|png)$/i, '');
    
    // Check anomaly first
    let productName = anomalyMap[baseName.replace(/-\d+$/, '').replace(/\s+\d+$/, '').trim().toLowerCase()];
    
    if (!productName) {
        // Strip trailing -1, -2, etc or " bottle"
        productName = baseName.replace(/-\d+$/, '').replace(/ bottle$/i, '').trim();
    }

    if (!productMap[productName]) {
        productMap[productName] = [];
    }
    
    productMap[productName].push(`/products/${safeFile}`);
}

// Sort the arrays to make sure default image comes first
for (const key in productMap) {
    productMap[key].sort((a, b) => {
        const aHasNumber = /-\d+\.\w+$/.test(a);
        const bHasNumber = /-\d+\.\w+$/.test(b);
        
        // If one has a number and the other doesn't, the one WITHOUT the number comes first
        if (aHasNumber && !bHasNumber) return 1;
        if (!aHasNumber && bHasNumber) return -1;
        
        // Otherwise, regular alphabetical sort
        return a.localeCompare(b);
    });
}

fs.writeFileSync(mappingFile, JSON.stringify(productMap, null, 2));

console.log('Moved files and generated mapping JSON successfully!');
console.log(Object.keys(productMap).length + ' products mapped.');

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'apps', 'web', 'public');
const APP = path.join(ROOT, 'apps', 'web', 'app');

const INPUT = path.join(PUBLIC, 'logo_transparent.png');

// Pink brand background color
const PINK_BG = { r: 232, g: 180, b: 184, alpha: 1 }; // #e8b4b8

async function makeCircularFavicon(size, outputPath) {
    // Create a circular SVG mask
    const circle = Buffer.from(
        `<svg width="${size}" height="${size}">
            <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/>
        </svg>`
    );

    // Create a solid pink background circle
    const pinkCircle = Buffer.from(
        `<svg width="${size}" height="${size}">
            <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#e8b4b8"/>
        </svg>`
    );

    // 1. Create pink background
    // 2. Composite the logo on top, contained within square
    // 3. Apply circular mask (alpha)
    await sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: { r: 232, g: 180, b: 184, alpha: 1 }
        }
    })
    .composite([
        // Logo image centered inside
        {
            input: await sharp(INPUT)
                .resize(Math.round(size * 0.85), Math.round(size * 0.85), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toBuffer(),
            gravity: 'center'
        },
        // Circular mask applied as alpha channel overlay
        {
            input: circle,
            blend: 'dest-in'
        }
    ])
    .png()
    .toFile(outputPath);

    console.log(`✅ Created: ${outputPath} (${size}x${size})`);
}

async function main() {
    await makeCircularFavicon(192, path.join(PUBLIC, 'favicon_192x192.png'));
    await makeCircularFavicon(180, path.join(PUBLIC, 'favicon_180x180.png'));
    await makeCircularFavicon(512, path.join(PUBLIC, 'favicon_512x512.png'));
    await makeCircularFavicon(32,  path.join(PUBLIC, 'favicon_32x32.png'));

    // Also copy to app dir for Next.js built-in favicon detection
    await makeCircularFavicon(192, path.join(APP, 'icon.png'));
    await makeCircularFavicon(180, path.join(APP, 'apple-icon.png'));

    console.log('\n🎉 All circular favicons generated!');
}

main().catch(console.error);

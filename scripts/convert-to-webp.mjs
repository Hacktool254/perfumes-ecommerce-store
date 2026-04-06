import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, parse } from 'path';

const INPUT_DIR = 'apps/web/public/images/yara';
const OUTPUT_DIR = 'apps/web/public/images/yara-webp';
const WEBP_QUALITY = 85; // Much higher quality than the original JPGs (~30-40)

async function convert() {
  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Get all frame JPGs
  const files = (await readdir(INPUT_DIR))
    .filter(f => f.startsWith('ezgif-frame-') && f.endsWith('.jpg'))
    .sort();

  console.log(`Found ${files.length} frames to convert`);
  console.log(`Output quality: WebP ${WEBP_QUALITY}%\n`);

  let totalInputKB = 0;
  let totalOutputKB = 0;
  let converted = 0;

  for (const file of files) {
    const inputPath = join(INPUT_DIR, file);
    const { name } = parse(file);
    const outputPath = join(OUTPUT_DIR, `${name}.webp`);

    const inputStat = await stat(inputPath);
    const inputKB = inputStat.size / 1024;
    totalInputKB += inputKB;

    await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY, effort: 4 }) // effort 4 = good balance of speed + compression
      .toFile(outputPath);

    const outputStat = await stat(outputPath);
    const outputKB = outputStat.size / 1024;
    totalOutputKB += outputKB;
    converted++;

    if (converted % 20 === 0 || converted === files.length) {
      console.log(`  Converted ${converted}/${files.length} — ${name}.webp (${inputKB.toFixed(1)} KB → ${outputKB.toFixed(1)} KB)`);
    }
  }

  console.log(`\n✅ Done! Converted ${converted} frames`);
  console.log(`   Input total:  ${(totalInputKB / 1024).toFixed(1)} MB (JPG avg ${(totalInputKB / converted).toFixed(0)} KB)`);
  console.log(`   Output total: ${(totalOutputKB / 1024).toFixed(1)} MB (WebP avg ${(totalOutputKB / converted).toFixed(0)} KB)`);
  console.log(`   Size change:  ${((totalOutputKB / totalInputKB - 1) * 100).toFixed(1)}%`);
  console.log(`   Quality:      WebP ${WEBP_QUALITY}% (vs original JPG ~30-40%)\n`);
  console.log(`Next step: Update hero.tsx to use .webp extension from /images/yara-webp/`);
}

convert().catch(console.error);

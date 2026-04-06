import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join } from 'path';

const INPUT_DIR = './apps/web/public/images/sequence';
const OUTPUT_DIR = './apps/web/public/images/sequence-webp';

async function convert() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  
  const files = (await readdir(INPUT_DIR)).filter(f => f.endsWith('.png')).sort();
  console.log(`Converting ${files.length} PNG files to WebP (quality 85)...`);
  
  let totalPng = 0;
  let totalWebp = 0;
  
  for (let i = 0; i < files.length; i++) {
    const inputPath = join(INPUT_DIR, files[i]);
    const outputName = files[i].replace('.png', '.webp');
    const outputPath = join(OUTPUT_DIR, outputName);
    
    const inputInfo = await sharp(inputPath).metadata();
    const inputSize = (await import('fs')).statSync(inputPath).size;
    
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    const outputSize = (await import('fs')).statSync(outputPath).size;
    totalPng += inputSize;
    totalWebp += outputSize;
    
    if (i % 20 === 0 || i === files.length - 1) {
      console.log(`  [${i + 1}/${files.length}] ${files[i]} → ${outputName} (${(inputSize/1024).toFixed(0)}KB → ${(outputSize/1024).toFixed(0)}KB)`);
    }
  }
  
  console.log(`\nDone!`);
  console.log(`  Total PNG:  ${(totalPng / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Total WebP: ${(totalWebp / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Savings:    ${((1 - totalWebp/totalPng) * 100).toFixed(1)}%`);
}

convert().catch(console.error);

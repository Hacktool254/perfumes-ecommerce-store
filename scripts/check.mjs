import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function check() {
    const response = await fetch("https://wary-herring-690.convex.cloud" + '/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: 'getBroken:run', args: {}, format: 'json' })
    });
    console.log(JSON.stringify(await response.json(), null, 2));
}

check();

// Seed script using Convex HTTP API
const seedData = require('./convex/seed_products.json');
const https = require('https');

const CONVEX_URL = 'https://tacit-caterpillar-440.convex.cloud';

async function seed() {
  console.log('Seeding products to Convex...');
  console.log(`Total products: ${seedData.products.length}`);

  const mutationBody = JSON.stringify({
    path: 'seed:seed',
    args: { products: seedData.products }
  });

  const options = {
    hostname: 'tacit-caterpillar-440.convex.cloud',
    path: '/api/mutation',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(mutationBody)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log('Response status:', res.statusCode);
        try {
          const result = JSON.parse(data);
          console.log('Result:', JSON.stringify(result, null, 2));
          resolve(result);
        } catch (e) {
          console.log('Response:', data);
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(mutationBody);
    req.end();
  });
}

seed()
  .then(() => console.log('\n✅ Seeding complete!'))
  .catch(err => console.error('\n❌ Error:', err.message));
const fs = require('fs');
const https = require('https');
const path = require('path');

const components = [
    'input', 'textarea', 'table', 'dropdown-menu', 'select', 'form', 'label', 'badge'
];

const destDir = path.join(__dirname, 'src', 'components', 'ui');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

components.forEach(comp => {
    const url = `https://ui.shadcn.com/r/styles/default/${comp}.json`;
    const destPath = path.join(destDir, `${comp}.tsx`);

    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(data);
                    const code = json.files[0].content;
                    fs.writeFileSync(destPath, code);
                    console.log(`Downloaded ${comp}.tsx`);
                } catch (e) {
                    console.error(`Error parsing ${comp}:`, e.message);
                }
            } else {
                console.error(`Failed to download ${comp}: HTTP ${res.statusCode}`);
            }
        });
    }).on('error', err => {
        console.error(`Error downloading ${comp}:`, err.message);
    });
});

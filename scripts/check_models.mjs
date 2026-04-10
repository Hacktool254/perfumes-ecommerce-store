import fs from 'fs';

try {
    const data = fs.readFileSync('scripts/models.json', 'utf8');
    const models = JSON.parse(data);
    console.log("Available Gemini Models:");
    models.models.forEach(m => {
        if (m.name.includes('flash') || m.name.includes('gemini')) {
            console.log(`- ${m.name} (${m.displayName})`);
        }
    });
} catch (error) {
    console.error("Failed to parse models.json:", error);
}

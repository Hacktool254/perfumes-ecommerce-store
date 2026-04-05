import fs from 'fs';

let raw = fs.readFileSync('db-dump.txt', 'utf16le');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
// Assuming the db dump format is a mix of text or JSON, just regex extract them.
const lines = raw.split('\n');
const found = lines.filter(l => l.includes("Body Oil"));
console.log(JSON.stringify(found, null, 2));

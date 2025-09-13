const fs = require('fs');
const path = require('path');


const FILE = path.join(__dirname, 'subscriptions.json');


function readAll() {
try {
const raw = fs.readFileSync(FILE, 'utf8');
const arr = JSON.parse(raw);
return new Set(arr);
} catch (e) {
return new Set();
}
}


function writeAll(set) {
try {
const arr = Array.from(set);
fs.writeFileSync(FILE, JSON.stringify(arr, null, 2));
} catch (e) {
console.error('Failed to write subscription file:', e.message);
}
}


module.exports = { readAll, writeAll };
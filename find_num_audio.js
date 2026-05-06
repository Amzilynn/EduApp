const fs = require('fs');
const files = fs.readdirSync('public/recordings/ar/girl');
const match = files.find(f => f.includes('طابق'));
console.log(match);

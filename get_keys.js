const fs = require('fs');

const manifest = JSON.parse(fs.readFileSync('./public/recordings/manifest.json', 'utf-8'));
const boyFiles = manifest.recordings.fr.boy;

let mapping = {};
boyFiles.forEach(item => {
  mapping[item.file] = item.key;
});

console.log(JSON.stringify(mapping, null, 2));

import fs from 'fs';
import path from 'path';

const dir = 'public/recordings/ar/girl';
const files = fs.readdirSync(dir);
files.forEach(f => {
    if (f.includes('.wav')) {
        console.log(f);
    }
});

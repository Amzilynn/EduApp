
import fs from 'fs';
import path from 'path';

const dir = 'public/recordings/ar/girl';
const files = fs.readdirSync(dir);

const search = ['محفظة', 'معلمة', 'مدرسة', 'صديقي', 'قطة', 'كلب', 'خروف'];

search.forEach(s => {
  const found = files.filter(f => f.includes(s));
  console.log(`${s}: ${found.join(', ')}`);
});

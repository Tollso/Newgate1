const fs = require('fs');
let code = fs.readFileSync('types/inventory.ts', 'utf8');
if (!code.includes('imageUrl?: string;')) {
  code = code.replace(/prepStations\?: string\[\];/, "prepStations?: string[];\n  imageUrl?: string;");
  fs.writeFileSync('types/inventory.ts', code);
}

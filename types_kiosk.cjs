const fs = require('fs');
let types = fs.readFileSync('types.ts', 'utf8');
if (!types.includes('categoryLayout?:')) {
  types = types.replace(/requireCustomerName: boolean;/, "requireCustomerName: boolean;\n  categoryLayout?: 'top' | 'sidebar' | 'hidden';");
  fs.writeFileSync('types.ts', types);
}

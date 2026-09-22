const fs = require('fs');
let c = fs.readFileSync('components/inventory/Discounts.tsx', 'utf8');

const startIdx = c.indexOf("      {/* Active Tab */}");
const endIdx = c.indexOf("    </div>\n  );\n};");

if (startIdx !== -1 && endIdx !== -1) {
  const extracted = c.substring(startIdx, endIdx);
  fs.writeFileSync('components/inventory/DiscountTabs.txt', extracted);
}

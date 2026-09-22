const fs = require('fs');
let c = fs.readFileSync('components/pos/KioskApp.tsx', 'utf8');

c = c.split('    </div>\n</div>\n  );\n};\n\nexport default KioskApp;').join('    </div>\n  );\n};\n\nexport default KioskApp;');

fs.writeFileSync('components/pos/KioskApp.tsx', c);

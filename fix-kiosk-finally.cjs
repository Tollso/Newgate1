const fs = require('fs');
let c = fs.readFileSync('components/pos/KioskApp.tsx', 'utf8');

c = c.replace(/    <\/div><\/div>\n  \);\n\};/g, '    </div>\n  );\n};');
fs.writeFileSync('components/pos/KioskApp.tsx', c);

const fs = require('fs');
let content = fs.readFileSync('components/pos/KioskApp.tsx', 'utf8');
content = content.replace(/      \/>\n    <\/div>\n<\/div>\n  \);\n\};\n\nexport default KioskApp;/g, "      />\n    </div>\n  );\n};\n\nexport default KioskApp;");
fs.writeFileSync('components/pos/KioskApp.tsx', content);

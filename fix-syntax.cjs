const fs = require('fs');
let content = fs.readFileSync('components/pos/KioskApp.tsx', 'utf8');

// fix import
if (!content.includes('KioskModifierModal')) {
    content = content.replace("import { ShoppingCart", "import { KioskModifierModal } from './KioskModifierModal';\nimport { ShoppingCart");
}

// fix tail
content = content.replace(/      \/>\n    <\/div>\n<\/div>\n  \);\n\};\n\nexport default KioskApp;/g, "      />\n    </div>\n  );\n};\n\nexport default KioskApp;");

// just in case, do it with index of
const tail = "      />\n    </div>\n</div>\n  );\n};\n\nexport default KioskApp;";
const goodTail = "      />\n    </div>\n  );\n};\n\nexport default KioskApp;";
if(content.includes(tail)) content = content.replace(tail, goodTail);

fs.writeFileSync('components/pos/KioskApp.tsx', content);

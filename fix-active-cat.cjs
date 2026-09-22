const fs = require('fs');
let code = fs.readFileSync('components/KioskApp.tsx', 'utf8');

code = code.replace(/\? '\$\{theme\.bg\}[^']*'/g, "? \\`\\$\\{theme.bg\\} text-white \\$\\{theme.bgHover\\} shadow-lg hover:shadow-xl\\`");

fs.writeFileSync('components/KioskApp.tsx', code);

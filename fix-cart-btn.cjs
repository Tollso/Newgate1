const fs = require('fs');
let code = fs.readFileSync('components/KioskApp.tsx', 'utf8');

code = code.replace(/\?\\`\\\\\\$\\\\\\{theme\.bg\\\\\\} text-white \\\\\\$\\\\\\{theme\.bgHover\\\\\\} shadow-lg hover:shadow-xl\\`/g, "? `${theme.bg} text-white ${theme.bgHover} shadow-lg hover:shadow-xl`");
// If it was written literally as \`\$\{theme.bg\} it would be:
code = code.replace(/\? \\`\\\$\\{theme\.bg\\} text-white \\\$\\{theme\.bgHover\\} shadow-lg hover:shadow-xl\\`/g, "? `${theme.bg} text-white ${theme.bgHover} shadow-lg hover:shadow-xl`");

fs.writeFileSync('components/KioskApp.tsx', code);

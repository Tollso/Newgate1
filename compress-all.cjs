const fs = require('fs');
let c = fs.readFileSync('components/app/ContentAreaRoutes.tsx', 'utf8');

c = c.replace(/\n\s*</g, ' <');
c = c.replace(/\n\s*>/g, ' >');
c = c.replace(/\n\s*\/>/g, ' />');

fs.writeFileSync('components/app/ContentAreaRoutes.tsx', c);

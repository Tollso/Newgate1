const fs = require('fs');
let code = fs.readFileSync('components/KioskApp.tsx', 'utf8');

code = code.replace(/onClick=\{handleCheckout\}/, "onClick={handleCheckout} disabled={config.requireCustomerName && !customerName.trim()}");

fs.writeFileSync('components/KioskApp.tsx', code);

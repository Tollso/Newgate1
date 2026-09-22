const fs = require('fs');
let c = fs.readFileSync('components/pos/KioskApp.tsx', 'utf8');

c = c.replace(/import \{ KioskCheckoutView \} from '\.\/KioskCheckoutView';/, "import { KioskCheckoutView } from './KioskCheckoutView';\nimport { KioskOrderCompleteView } from './KioskOrderCompleteView';");

const regex = /  if \(orderComplete\) \{[\s\S]*?      <\/div>\n    \);\n  \}/g;
c = c.replace(regex, `  if (orderComplete) {
    return <KioskOrderCompleteView orderNumber={orderNumber} theme={theme} />;
  }`);

fs.writeFileSync('components/pos/KioskApp.tsx', c);

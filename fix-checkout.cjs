const fs = require('fs');
let c = fs.readFileSync('components/pos/KioskApp.tsx', 'utf8');

c = c.replace(/import \{ KioskCartContent \} from '\.\/KioskCartContent';/, "import { KioskCartContent } from './KioskCartContent';\nimport { KioskCheckoutView } from './KioskCheckoutView';");

const regex = /  if \(isCheckout\) \{[\s\S]*?      <\/div>\n    \);\n  \}/g;
c = c.replace(regex, `  if (isCheckout) {
    return (
      <KioskCheckoutView
        cart={cart}
        subtotal={subtotal}
        tax={tax}
        total={total}
        setIsCheckout={setIsCheckout}
        handleCheckout={handleCheckout}
      />
    );
  }`);

fs.writeFileSync('components/pos/KioskApp.tsx', c);

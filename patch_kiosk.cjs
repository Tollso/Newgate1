const fs = require('fs');
let content = fs.readFileSync('components/pos/KioskApp.tsx', 'utf-8');

content = content.replace(
  'onProcessSale: (cart: CartItem[], total: number, paymentMethod: string, orderId?: string, tip?: number, discount?: number) => void;',
  'onProcessSale: (cart: CartItem[], total: number, paymentMethod: string, orderId?: string, tip?: number, discount?: number) => void;\n  onFireToKitchen?: (ticket: any) => void;'
);

content = content.replace(
  'export const KioskApp: React.FC<KioskAppProps> = ({ items = [], categories = [], modifierGroups = [], taxConfig, onProcessSale, kioskConfig }) => {',
  'export const KioskApp: React.FC<KioskAppProps> = ({ items = [], categories = [], modifierGroups = [], taxConfig, onProcessSale, onFireToKitchen, kioskConfig }) => {'
);

content = content.replace(
  'const handleCheckoutFinal = (method: string) => {',
  `const handleCheckoutFinal = (method: string) => {
    const orderId = 'ORD-' + Date.now();
    if (onFireToKitchen) {
      onFireToKitchen({
        id: 'TKT-' + Date.now().toString().slice(-6),
        orderId: orderId,
        type: 'Kiosk',
        status: 'Pending',
        timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: cart.map(item => ({
          name: item.name,
          qty: item.qty || 1,
          modifiers: item.selectedModifiers || []
        })),
        server: 'Kiosk',
        table: orderType || 'Kiosk'
      });
    }`
);
content = content.replace(
  "onProcessSale(cart, total, method, 'ORD-' + Date.now());",
  "onProcessSale(cart, total, method, orderId);"
);

fs.writeFileSync('components/pos/KioskApp.tsx', content);

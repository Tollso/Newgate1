const fs = require('fs');
const content = fs.readFileSync('components/dining/TableServiceApp.tsx', 'utf-8');

let modified = content.replace(
  "if (activeTableId) {\n        onUpdateTableOrder(activeTableId, { items: orderItems, guests, orderType, payments: newPayments });\n      }\n    }\n\n    setShowPayment(false);",
  "if (activeTableId) {\n        onUpdateTableOrder(activeTableId, { items: orderItems, guests, orderType, payments: newPayments });\n      }\n    }\n\n    if (totalPaidSoFar >= fullTotal - 0.01) {\n      setShowPayment(false);\n    }"
);

fs.writeFileSync('components/dining/TableServiceApp.tsx', modified);
console.log('Patched partial payment close');

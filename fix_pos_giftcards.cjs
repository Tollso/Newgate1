const fs = require('fs');
let cashier = fs.readFileSync('components/pos/CashierPOS.tsx', 'utf8');

if (!cashier.includes("giftCards={giftCards}")) {
  // Add props to interface
  cashier = cashier.replace(
    /sharedSchedules: Schedule\[\];\n\}/,
    "sharedSchedules: Schedule[];\n  giftCards?: any[];\n  setGiftCards?: any;\n}"
  );
  
  // Add to destructuring
  cashier = cashier.replace(
    /sharedSchedules\n}\) => \{/,
    "sharedSchedules,\n  giftCards,\n  setGiftCards\n}) => {"
  );
  
  // Pass to PaymentModal
  cashier = cashier.replace(
    /onPay=\{handlePayment\}/,
    "onPay={handlePayment} giftCards={giftCards} setGiftCards={setGiftCards}"
  );
  fs.writeFileSync('components/pos/CashierPOS.tsx', cashier);
}

let table = fs.readFileSync('components/dining/TableServiceApp.tsx', 'utf8');
if (!table.includes("giftCards={giftCards}")) {
  // Add props to interface
  table = table.replace(
    /kitchenTickets: KitchenTicket\[\];\n\}/,
    "kitchenTickets: KitchenTicket[];\n  giftCards?: any[];\n  setGiftCards?: any;\n}"
  );
  
  // Add to destructuring
  table = table.replace(
    /kitchenTickets\n}\) => \{/,
    "kitchenTickets,\n  giftCards,\n  setGiftCards\n}) => {"
  );
  
  // Pass to TableServicePaymentModal
  table = table.replace(
    /handleSplitCheck=\{\(\) => \{\}\}/,
    "handleSplitCheck={() => {}}\n          giftCards={giftCards}\n          setGiftCards={setGiftCards}"
  );
  fs.writeFileSync('components/dining/TableServiceApp.tsx', table);
}

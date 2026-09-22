const fs = require('fs');

let cashierCode = fs.readFileSync('components/CashierPOS.tsx', 'utf8');
if (!cashierCode.includes('onTicketStatusChange?:')) {
  cashierCode = cashierCode.replace(/interface CashierPOSProps \{/, "interface CashierPOSProps {\n  onTicketStatusChange?: (ticketId: string, status: string) => void;");
  fs.writeFileSync('components/CashierPOS.tsx', cashierCode);
}

let contentCode = fs.readFileSync('components/app/ContentAreaRoutes.tsx', 'utf8');
contentCode = contentCode.replace(/<CashierPOS/g, "<CashierPOS onTicketStatusChange={props.handleTicketStatusChange} ");
fs.writeFileSync('components/app/ContentAreaRoutes.tsx', contentCode);

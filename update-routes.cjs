const fs = require('fs');

// Update ContentAreaRoutes
let contentCode = fs.readFileSync('components/app/ContentAreaRoutes.tsx', 'utf8');
contentCode = contentCode.replace(/kitchenTickets=\{props\.activeTickets \|\| \[\]\}/g, "kitchenTickets={props.activeTickets || []}\n          onTicketStatusChange={props.handleTicketStatusChange}");
fs.writeFileSync('components/app/ContentAreaRoutes.tsx', contentCode);

// Update CashierPOS
let cashierCode = fs.readFileSync('components/CashierPOS.tsx', 'utf8');
cashierCode = cashierCode.replace(/kitchenTickets=\{props\.kitchenTickets\} /g, "kitchenTickets={props.kitchenTickets} onTicketStatusChange={props.onTicketStatusChange} ");
fs.writeFileSync('components/CashierPOS.tsx', cashierCode);

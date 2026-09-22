const fs = require('fs');
let table = fs.readFileSync('components/dining/TableServiceApp.tsx', 'utf8');

// interface
table = table.replace(
  /kitchenTickets\?: KitchenTicket\[\];/,
  "kitchenTickets?: KitchenTicket[];\n  giftCards?: any[];\n  setGiftCards?: any;"
);

// destructuring
table = table.replace(
  /kitchenTickets, onTicketStatusChange/,
  "kitchenTickets, onTicketStatusChange, giftCards, setGiftCards"
);

fs.writeFileSync('components/dining/TableServiceApp.tsx', table);

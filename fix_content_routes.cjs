const fs = require('fs');
let content = fs.readFileSync('components/app/ContentAreaRoutes.tsx', 'utf8');

// CashierPOS
content = content.replace(
  /sharedSchedules=\{props.schedules \|\| \[\]\}/g,
  "sharedSchedules={props.schedules || []}\n          giftCards={props.giftCards}\n          setGiftCards={props.setGiftCards}"
);

// TableServiceApp
content = content.replace(
  /kitchenTickets=\{props.activeTickets \|\| \[\]\}/g,
  "kitchenTickets={props.activeTickets || []}\n          giftCards={props.giftCards}\n          setGiftCards={props.setGiftCards}"
);

fs.writeFileSync('components/app/ContentAreaRoutes.tsx', content);

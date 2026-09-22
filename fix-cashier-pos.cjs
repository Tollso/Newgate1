const fs = require('fs');
let code = fs.readFileSync('components/CashierPOS.tsx', 'utf8');

code = code.replace(
  /const myNotifications = props\.notifications\?\.filter\(n => n\.targetEmployeeId === authenticatedPosUser\.id\) \|\| \[\];/,
  "const myNotifications = props.notifications?.filter(n => n.targetEmployeeId === authenticatedPosUser.id || n.targetEmployeeId === 'all') || [];"
);

fs.writeFileSync('components/CashierPOS.tsx', code);

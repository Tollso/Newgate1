const fs = require('fs');
let c = fs.readFileSync('components/pos/KioskApp.tsx', 'utf8');

const startIdx = c.indexOf('  const renderCartContent = () => (');
const endIdx = c.indexOf('  return (', startIdx);

c = c.substring(0, startIdx) + c.substring(endIdx);
fs.writeFileSync('components/pos/KioskApp.tsx', c);

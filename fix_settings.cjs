const fs = require('fs');
let content = fs.readFileSync('components/admin/Settings.tsx', 'utf8');

content = content.replace(/setKioskConfig\?\: any;\n  ,businesses,\n  giftCards,\n  setGiftCards/g, 'setKioskConfig?: any;');
content = content.replace(/setKioskConfig\n  ,businesses,\n  giftCards,\n  setGiftCards/g, 'setKioskConfig,\n  businesses,\n  giftCards,\n  setGiftCards');

fs.writeFileSync('components/admin/Settings.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('components/app/ContentAreaRoutes.tsx', 'utf8');

// Undo the double replacement
content = content.replace(/removalReasons=\{props\.removalReasons\} kioskConfig=\{props\.kioskConfig\} setKioskConfig=\{props\.setKioskConfig\}/g, 'removalReasons={props.removalReasons}');

fs.writeFileSync('components/app/ContentAreaRoutes.tsx', content);

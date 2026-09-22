const fs = require('fs');
let routesCode = fs.readFileSync('components/app/ContentAreaRoutes.tsx', 'utf8');
routesCode = routesCode.replace(/<Categories categories=\{props\.filteredCategories\} setCategories=\{props\.setCategories\} inventory=\{props\.filteredInventory \|\| props\.inventory\} \/>/, "<Categories categories={props.filteredCategories} setCategories={props.setCategories} inventory={props.inventory} setInventory={props.setInventory} />");
fs.writeFileSync('components/app/ContentAreaRoutes.tsx', routesCode);

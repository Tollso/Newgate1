const fs = require('fs');

// 1. ContentAreaRoutes.tsx
let routes = fs.readFileSync('components/app/ContentAreaRoutes.tsx', 'utf8');
if (!routes.includes('sharedModifierGroups={props.modifierGroups}')) {
  routes = routes.replace(/sharedCategories=\{props\.filteredCategories \|\| \[\]\}/, "sharedCategories={props.filteredCategories || []}\n          sharedModifierGroups={props.modifierGroups || []}");
  fs.writeFileSync('components/app/ContentAreaRoutes.tsx', routes);
}

// 2. CashierPOS.tsx
let cashier = fs.readFileSync('components/CashierPOS.tsx', 'utf8');
if (!cashier.includes('sharedModifierGroups?:')) {
  cashier = cashier.replace(/sharedCategories:\s*Category\[\];/, "sharedCategories: Category[];\n  sharedModifierGroups?: any[];");
}
if (!cashier.includes('modifierGroups={props.sharedModifierGroups}')) {
  cashier = cashier.replace(/categories=\{props\.sharedCategories\}/, "categories={props.sharedCategories}\n               modifierGroups={props.sharedModifierGroups}");
  fs.writeFileSync('components/CashierPOS.tsx', cashier);
}


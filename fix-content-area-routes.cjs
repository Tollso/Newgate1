const fs = require('fs');
let code = fs.readFileSync('components/app/ContentAreaRoutes.tsx', 'utf8');

const targetStr = `        <TableServiceApp
          tables={props.filteredFloorPlanTables}
          activeTableOrders={props.activeTableOrders}
          items={props.filteredInventory}
          categories={props.filteredCategories}
          modifierGroups={props.modifierGroups}
          onUpdateTableOrder={props.handleUpdateTableOrder}
          onUpdateTableStatus={props.handleUpdateTableStatus}
          onFireToKitchen={props.handleFireToKitchen}`;

const replacementStr = `        <TableServiceApp
          tables={props.filteredFloorPlanTables}
          activeTableOrders={props.activeTableOrders}
          items={props.filteredInventory}
          categories={props.filteredCategories}
          modifierGroups={props.modifierGroups}
          onUpdateTableOrder={props.handleUpdateTableOrder}
          onUpdateTableStatus={props.handleUpdateTableStatus}
          onFireToKitchen={props.handleFireToKitchen}
          kitchenTickets={props.activeTickets || []}`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('components/app/ContentAreaRoutes.tsx', code);

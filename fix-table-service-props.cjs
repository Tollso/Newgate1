const fs = require('fs');
let code = fs.readFileSync('components/TableServiceApp.tsx', 'utf8');

if (!code.includes('kitchenTickets?: KitchenTicket[]')) {
  code = code.replace(/onProcessSale\?: \(cart: any\[\], total: number, paymentMethod: string, existingOrderId\?: string, tip\?: number, discount\?: number\) => void;/, "onProcessSale?: (cart: any[], total: number, paymentMethod: string, existingOrderId?: string, tip?: number, discount?: number) => void;\n  kitchenTickets?: KitchenTicket[];\n  onOpenDesigner?: () => void;\n  onOpenSettings?: () => void;");
  
  code = code.replace(/const TableServiceApp: React\.FC<TableServiceAppProps> = \(\{ \n  tables, inventory, categories, currentUser, onExit, onFireToKitchen, \n  activeTableOrders, onUpdateTableOrder, onUpdateTableStatus, onProcessSale \n\}\) => \{/, "const TableServiceApp: React.FC<TableServiceAppProps> = ({ \n  tables, inventory, categories, currentUser, onExit, onFireToKitchen, \n  activeTableOrders, onUpdateTableOrder, onUpdateTableStatus, onProcessSale, kitchenTickets \n}) => {");
  
  const replacer = "<InteractiveTable\n              key={table.id}\n              table={table}\n              onClick={(e, t) => handleTableClick(e as any, t)}\n              kitchenStatus={\n                kitchenTickets && kitchenTickets.some(t => t.table === 'Table ' + table.name && t.status === 'Ready') ? { status: 'Ready' } :\n                kitchenTickets && kitchenTickets.some(t => t.table === 'Table ' + table.name && t.status === 'Prep') ? { status: 'Prep' } :\n                kitchenTickets && kitchenTickets.some(t => t.table === 'Table ' + table.name && t.status === 'Pending') ? { status: 'Pending' } : null\n              }\n            />";

  code = code.replace(/<InteractiveTable\s*key=\{table\.id\}\s*table=\{table\}\s*onClick=\{\(e, t\) => handleTableClick\(e as any, t\)\}\s*\/>/g, replacer);
            
  fs.writeFileSync('components/TableServiceApp.tsx', code);
}

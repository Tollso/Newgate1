const fs = require('fs');
let code = fs.readFileSync('components/TableServiceApp.tsx', 'utf8');

const targetStr = `<InteractiveTable
              key={table.id}
              table={table}
              onClick={(e, t) => handleTableClick(e as any, t)}
              kitchenStatus={
                kitchenTickets && kitchenTickets.some(t => t.table === 'Table ' + table.name && t.status === 'Ready') ? { status: 'Ready' } :
                kitchenTickets && kitchenTickets.some(t => t.table === 'Table ' + table.name && t.status === 'Prep') ? { status: 'Prep' } :
                kitchenTickets && kitchenTickets.some(t => t.table === 'Table ' + table.name && t.status === 'Pending') ? { status: 'Pending' } : null
              }
            />`;

const replacementStr = `
            {
              const tableTicket = (kitchenTickets || []).find(ticket => ticket.table === 'Table ' + table.name && ticket.status !== 'Delivered');
              const kStatus = tableTicket ? { status: tableTicket.status, ticketId: tableTicket.id } : null;
              
              return (
                <InteractiveTable
                  key={table.id}
                  table={table}
                  onClick={(e, t) => handleTableClick(e as any, t)}
                  kitchenStatus={kStatus}
                />
              );
            }
`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('components/TableServiceApp.tsx', code);

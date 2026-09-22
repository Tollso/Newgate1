const fs = require('fs');
let code = fs.readFileSync('components/TableServiceApp.tsx', 'utf8');

const targetBlock = `{tables.filter(t => t.section === activeSection).map(table => (
            
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

          ))}`;

const replacementBlock = `{tables.filter(t => t.section === activeSection).map(table => {
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
          })}`;

code = code.replace(targetBlock, replacementBlock);
fs.writeFileSync('components/TableServiceApp.tsx', code);

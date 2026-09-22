const fs = require('fs');
let code = fs.readFileSync('hooks/useAppState.ts', 'utf8');

const regex = /const handleTicketStatusChange = \(ticketId: string, status: KitchenTicket\['status'\]\) => \{[\s\S]*?^\s*\};/m;

const newFn = `const handleTicketStatusChange = (ticketId: string, status: KitchenTicket['status']) => {
    setActiveTickets(prev => {
      const newTickets = prev.map(t => t.id === ticketId ? { ...t, status } : t);
      
      if (status === 'Ready') {
        const ticket = prev.find(t => t.id === ticketId);
        if (ticket && ticket.status !== 'Ready') {
          // Add notification asynchronously to avoid state update cycle issues
          setTimeout(() => {
            setServerNotifications(notifs => [
              {
                id: \`notif-\${Date.now()}\`,
                type: 'OrderReady',
                message: \`Order #\${ticket.orderNumber}\${ticket.tableNumber ? ' (Table ' + ticket.tableNumber + ')' : ''} is ready in the kitchen!\`,
                targetEmployeeId: 'all',
                timestamp: new Date().toISOString(),
                read: false
              },
              ...notifs
            ]);
          }, 0);
        }
      }
      
      return newTickets;
    });
  };`;

code = code.replace(regex, newFn);
fs.writeFileSync('hooks/useAppState.ts', code);

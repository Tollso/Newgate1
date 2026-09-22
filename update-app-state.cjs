const fs = require('fs');
let code = fs.readFileSync('hooks/useAppState.ts', 'utf8');

const newFn = `  const handleTicketStatusChange = (ticketId: string, status: KitchenTicket['status']) => {
    setActiveTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
    
    if (status === 'Ready') {
      const ticket = activeTickets.find(t => t.id === ticketId);
      if (ticket) {
        setServerNotifications(prev => [
          {
            id: \`notif-\${Date.now()}\`,
            type: 'OrderReady',
            message: \`Order #\${ticket.orderNumber}\${ticket.tableNumber ? ' (Table ' + ticket.tableNumber + ')' : ''} is ready in the kitchen!\`,
            targetEmployeeId: 'all',
            timestamp: new Date().toISOString(),
            read: false
          },
          ...prev
        ]);
      }
    }
  };`;

code = code.replace(/const handleTicketStatusChange = \(ticketId: string, status: KitchenTicket\['status'\]\) => \{\s*setActiveTickets\(prev => prev\.map\(t => t\.id === ticketId \? \{ \.\.\.t, status \} : t\)\);\s*\};/, newFn);

fs.writeFileSync('hooks/useAppState.ts', code);

const fs = require('fs');
let code = fs.readFileSync('components/TableServiceApp.tsx', 'utf8');

// Add onTicketStatusChange to TableServiceAppProps
code = code.replace(/onOpenSettings\?: \(\) => void;/, "onOpenSettings?: () => void;\n  onTicketStatusChange?: (ticketId: string, status: 'Pending' | 'Prep' | 'Ready' | 'Delivered') => void;");

code = code.replace(/onProcessSale, kitchenTickets/, "onProcessSale, kitchenTickets, onTicketStatusChange");

// Import TableServicePaymentModal
code = code.replace(/import \{ TableServiceOrderPanel \} from '\.\/tableservice\/TableServiceOrderPanel';/, "import { TableServiceOrderPanel } from './tableservice/TableServiceOrderPanel';\nimport { TableServicePaymentModal } from './tableservice/TableServicePaymentModal';");

// Add Payment States
code = code.replace(/const \[activeCategory, setActiveCategory\] = useState\('All'\);/, `const [activeCategory, setActiveCategory] = useState('All');
  const [showPayment, setShowPayment] = useState(false);
  const [tableCardPaymentStep, setTableCardPaymentStep] = useState<'NONE' | 'TAP' | 'TIP'>('NONE');
  const [tableSelectedTip, setTableSelectedTip] = useState<number>(0);
  const [tableCustomTipInput, setTableCustomTipInput] = useState<string>('');
  const [billDiscount, setBillDiscount] = useState<{ type: 'Percentage' | 'Fixed'; value: number; name: string } | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);`);

// Update handleCloseCheck
const handleCloseCheckOld = `  const handleCloseCheck = () => {
    if (onProcessSale && activeTable) {
      const subtotalVal = orderItems.reduce((acc, i) => i.isVoided ? acc : acc + (i.price * i.quantity), 0);
      const taxVal = subtotalVal * 0.0825;
      onProcessSale(orderItems, subtotalVal + taxVal, 'Card', activeTable.orderId);
    }

    onUpdateTableStatus({ 
      ...activeTable!, 
      status: 'Available' as const, 
      assignedToName: undefined, 
      timeSeated: undefined, 
      orderId: undefined 
    });
    
    if (activeTableId) onUpdateTableOrder(activeTableId, undefined);
    setActiveTableId(null);
  };`;

const handleCloseCheckNew = `  const handleCloseCheck = (paymentMethod: string, tipAmount: number = 0) => {
    if (onProcessSale && activeTable) {
      const subtotalVal = orderItems.reduce((acc, i) => i.isVoided ? acc : acc + (i.price * i.quantity), 0);
      const taxVal = subtotalVal * 0.0825;
      
      let discountAmount = 0;
      if (billDiscount) {
        if (billDiscount.type === 'Percentage') discountAmount = subtotalVal * (billDiscount.value / 100);
        else discountAmount = billDiscount.value;
      }
      
      onProcessSale(orderItems, subtotalVal - discountAmount + taxVal + tipAmount, paymentMethod, activeTable.orderId, tipAmount, discountAmount);
    }

    onUpdateTableStatus({ 
      ...activeTable!, 
      status: 'Available' as const, 
      assignedToName: undefined, 
      timeSeated: undefined, 
      orderId: undefined 
    });
    
    if (activeTableId) onUpdateTableOrder(activeTableId, undefined);
    setActiveTableId(null);
    setShowPayment(false);
  };`;

code = code.replace(handleCloseCheckOld, handleCloseCheckNew);

// Update handleTableClick to dismiss tickets
const handleTableClickRegex = /const handleTableClick = \(e: React\.MouseEvent \| React\.PointerEvent, table: DiningTable\) => \{\n    e\.stopPropagation\(\);\n    if \(\!table\.isSeatable\) return;/;
const handleTableClickNew = `const handleTableClick = (e: React.MouseEvent | React.PointerEvent, table: DiningTable) => {
    e.stopPropagation();
    if (!table.isSeatable) return;

    if (onTicketStatusChange) {
      const tableTickets = (kitchenTickets || []).filter(ticket => ticket.table === 'Table ' + table.name && ticket.status === 'Ready');
      tableTickets.forEach(ticket => {
        onTicketStatusChange(ticket.id, 'Delivered');
      });
    }`;
code = code.replace(handleTableClickRegex, handleTableClickNew);

// Change onOpenPayment to open modal
code = code.replace(/onOpenPayment=\{handleCloseCheck\}/, "onOpenPayment={() => setShowPayment(true)}");

// Add Modal rendering
const modalComponent = `      {showPayment && (
        <TableServicePaymentModal
          showPayment={showPayment}
          setShowPayment={setShowPayment}
          tableCardPaymentStep={tableCardPaymentStep}
          setTableCardPaymentStep={setTableCardPaymentStep}
          tableSelectedTip={tableSelectedTip}
          setTableSelectedTip={setTableSelectedTip}
          tableCustomTipInput={tableCustomTipInput}
          setTableCustomTipInput={setTableCustomTipInput}
          total={total}
          activeTable={activeTable}
          billDiscount={billDiscount}
          setShowDiscountModal={setShowDiscountModal}
          handleCloseCheck={handleCloseCheck}
          handleSplitCheck={() => {}}
        />
      )}`;

code = code.replace(/<\/div>\n    <\/div>\n  \);\n\};\n\nexport default TableServiceApp;/, `${modalComponent}\n    </div>\n    </div>\n  );\n};\n\nexport default TableServiceApp;`);

fs.writeFileSync('components/TableServiceApp.tsx', code);

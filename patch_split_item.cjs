const fs = require('fs');
let content = fs.readFileSync('components/dining/TableServicePaymentModal.tsx', 'utf-8');

// 1. Add states for Split By Item
content = content.replace(
  "const [splitWays, setSplitWays] = useState(2);",
  `const [splitWays, setSplitWays] = useState(2);
  const [splitChecks, setSplitChecks] = useState([{ id: 'check-1', name: 'Check 1', items: [], paid: false }]);
  const [activeSplitCheckId, setActiveSplitCheckId] = useState('check-1');
  
  const activeSplitCheck = splitChecks.find(c => c.id === activeSplitCheckId);
  const activeSplitCheckSubtotal = activeSplitCheck?.items.reduce((sum, ci) => {
    const originalItem = orderItems.find(i => i.cartId === ci.cartId);
    return sum + ((originalItem ? originalItem.price : 0) * ci.qty);
  }, 0) || 0;
  const activeSplitCheckTotal = activeSplitCheckSubtotal * 1.0825; // with tax

  const addSplitCheck = () => {
    const id = \`check-\${splitChecks.length + 1}\`;
    setSplitChecks([...splitChecks, { id, name: \`Check \${splitChecks.length + 1}\`, items: [], paid: false }]);
    setActiveSplitCheckId(id);
  };

  const assignItemToCheck = (cartId, qty) => {
    if (activeSplitCheck?.paid) return;
    setSplitChecks(checks => checks.map(c => {
      if (c.id === activeSplitCheckId) {
        const existing = c.items.find(i => i.cartId === cartId);
        if (existing) {
          return { ...c, items: c.items.map(i => i.cartId === cartId ? { ...i, qty: i.qty + qty } : i) };
        }
        return { ...c, items: [...c.items, { cartId, qty }] };
      }
      return c;
    }));
  };

  const unassignItemFromCheck = (cartId, qty) => {
    if (activeSplitCheck?.paid) return;
    setSplitChecks(checks => checks.map(c => {
      if (c.id === activeSplitCheckId) {
        const existing = c.items.find(i => i.cartId === cartId);
        if (existing) {
          if (existing.qty <= qty) {
            return { ...c, items: c.items.filter(i => i.cartId !== cartId) };
          }
          return { ...c, items: c.items.map(i => i.cartId === cartId ? { ...i, qty: i.qty - qty } : i) };
        }
      }
      return c;
    }));
  };`
);

// 2. Replace the SPLIT_ITEM UI
const splitItemUI = `
             {paymentMode === 'SPLIT_ITEM' && (
                <div className="animate-fade-in flex flex-col h-[450px]">
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                     <span className="font-bold text-slate-700">Split by Item</span>
                     <button onClick={() => setPaymentMode('SELECT')} className="text-sm font-bold text-slate-500 hover:text-slate-800">Cancel</button>
                  </div>
                  
                  <div className="flex-1 flex gap-4 overflow-hidden">
                    {/* Unassigned Items */}
                    <div className="flex-1 flex flex-col border border-slate-200 rounded-xl overflow-hidden">
                       <div className="bg-slate-100 p-3 border-b border-slate-200 font-bold text-sm text-slate-600">Table Items</div>
                       <div className="flex-1 overflow-y-auto p-2 space-y-2">
                          {orderItems.filter(i => !i.isVoided).map((item) => {
                             const assignedQty = splitChecks.reduce((sum, c) => sum + (c.items.find(ci => ci.cartId === item.cartId)?.qty || 0), 0);
                             const remainingQty = item.quantity - assignedQty;
                             
                             if (remainingQty <= 0) return null;
                             
                             return (
                               <div key={item.cartId} onClick={() => assignItemToCheck(item.cartId, 1)} className="p-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-500 cursor-pointer flex justify-between items-center transition-colors shadow-sm">
                                  <div>
                                    <span className="font-bold text-slate-800 text-sm block">{item.name}</span>
                                    <span className="text-xs text-slate-500 font-medium">\${item.price.toFixed(2)} x {remainingQty}</span>
                                  </div>
                                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">+</div>
                               </div>
                             );
                          })}
                       </div>
                    </div>
                    
                    {/* Split Checks */}
                    <div className="flex-[1.2] flex flex-col border border-indigo-200 rounded-xl overflow-hidden bg-indigo-50/30">
                       <div className="flex border-b border-indigo-200 overflow-x-auto">
                          {splitChecks.map(c => (
                            <button key={c.id} onClick={() => setActiveSplitCheckId(c.id)} className={\`px-4 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors \${activeSplitCheckId === c.id ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:bg-white/50'}\`}>
                               {c.name} {c.paid && '✓'}
                            </button>
                          ))}
                          <button onClick={addSplitCheck} className="px-4 py-3 text-indigo-600 hover:bg-indigo-100 transition-colors"><Plus size={18} /></button>
                       </div>
                       
                       <div className="flex-1 overflow-y-auto p-2 space-y-2">
                          {activeSplitCheck?.items.map(ci => {
                            const originalItem = orderItems.find(i => i.cartId === ci.cartId);
                            if (!originalItem) return null;
                            return (
                               <div key={ci.cartId} onClick={() => unassignItemFromCheck(ci.cartId, 1)} className={\`p-3 bg-white border rounded-lg flex justify-between items-center shadow-sm \${activeSplitCheck.paid ? 'border-slate-200 opacity-70' : 'border-indigo-100 hover:border-red-300 cursor-pointer'}\`}>
                                  <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mr-2 font-bold">-</div>
                                  <div className="flex-1">
                                    <span className="font-bold text-slate-800 text-sm block">{originalItem.name}</span>
                                    <span className="text-xs text-slate-500 font-medium">\${originalItem.price.toFixed(2)} x {ci.qty}</span>
                                  </div>
                                  <span className="font-mono font-bold text-slate-700">\${(originalItem.price * ci.qty).toFixed(2)}</span>
                               </div>
                            )
                          })}
                          {activeSplitCheck?.items.length === 0 && (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">Tap items to add to this check</div>
                          )}
                       </div>
                       
                       <div className="p-4 bg-white border-t border-indigo-200">
                          <div className="flex justify-between items-center mb-3">
                             <span className="font-bold text-slate-600">Check Total</span>
                             <span className="font-black text-xl text-indigo-900">\${activeSplitCheckTotal.toFixed(2)}</span>
                          </div>
                          {!activeSplitCheck?.paid ? (
                             <button onClick={() => { setAmountToPay(activeSplitCheckTotal); setTableCardPaymentStep('TAP'); }} disabled={activeSplitCheckTotal === 0} className="w-full py-3 bg-indigo-600 disabled:bg-indigo-300 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors">
                               Pay Check
                             </button>
                          ) : (
                             <div className="w-full py-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-center">Paid</div>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
             )}
`;

content = content.replace(
  /\{paymentMode === 'SPLIT_ITEM' && \([\s\S]*?\}\)/,
  splitItemUI
);

// 3. Fix the handleCloseCheck partial resets in TAP and GIFT_CARD
content = content.replace(
  "handleCloseCheck('Card', tableSelectedTip, amountToPay);",
  `handleCloseCheck('Card', tableSelectedTip, amountToPay);
                  if (amountToPay < total - 0.01) {
                    setTableCardPaymentStep('NONE');
                    setTableSelectedTip(0);
                    if (paymentMode === 'SPLIT_ITEM') {
                      setSplitChecks(checks => checks.map(c => c.id === activeSplitCheckId ? { ...c, paid: true } : c));
                    }
                  }`
);

content = content.replace(
  "handleCloseCheck('Cash', 0, amountToPay);",
  `handleCloseCheck('Cash', 0, amountToPay);
                  if (amountToPay < total - 0.01) {
                    setTableCardPaymentStep('NONE');
                    if (paymentMode === 'SPLIT_ITEM') {
                      setSplitChecks(checks => checks.map(c => c.id === activeSplitCheckId ? { ...c, paid: true } : c));
                    }
                  }`
);

content = content.replace(
  "handleCloseCheck('Cash', 0, finalTotal);",
  `handleCloseCheck('Cash', 0, finalTotal);
                       if (amountToPay < total - 0.01) {
                         setTableCardPaymentStep('NONE');
                       }`
);

// We need to import Plus from lucide-react if it's not there, but it likely is in other components, maybe not TableServicePaymentModal
// Let's just add it just in case:
content = content.replace(
  "import { Utensils, Receipt, Check, AlertCircle, Phone, X, CreditCard, DollarSign, Tag, Clock, ArrowRight, User, SplitSquareHorizontal } from 'lucide-react';",
  "import { Utensils, Receipt, Check, AlertCircle, Phone, X, CreditCard, DollarSign, Tag, Clock, ArrowRight, User, SplitSquareHorizontal, Plus, ChevronLeft, ChevronRight } from 'lucide-react';"
);

fs.writeFileSync('components/dining/TableServicePaymentModal.tsx', content);
console.log('Patched Split By Item');

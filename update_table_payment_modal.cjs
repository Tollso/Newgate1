const fs = require('fs');
let content = fs.readFileSync('components/dining/TableServicePaymentModal.tsx', 'utf8');

// Add giftCards to props interface
content = content.replace(
  /handleSplitCheck: \(\) => void;\n\}/,
  "handleSplitCheck: () => void;\n  giftCards?: any[];\n  setGiftCards?: any;\n}"
);

// Destructure new props
content = content.replace(
  /handleSplitCheck\n}\) => \{/,
  "handleSplitCheck,\n  giftCards = [],\n  setGiftCards\n}) => {"
);

// Add view state Type extension for GIFT_CARD
content = content.replace(
  /tableCardPaymentStep: 'NONE' \| 'TAP' \| 'TIP';/,
  "tableCardPaymentStep: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD';"
);
content = content.replace(
  /setTableCardPaymentStep: \(val: 'NONE' \| 'TAP' \| 'TIP'\) => void;/,
  "setTableCardPaymentStep: (val: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD') => void;"
);


// Add GC state inside component
content = content.replace(
  /export const TableServicePaymentModal: React.FC<TableServicePaymentModalProps> = \(\{/,
  "import { useState } from 'react';\n\nexport const TableServicePaymentModal: React.FC<TableServicePaymentModalProps> = ({"
);

const gcStateStr = `
  const [gcCode, setGcCode] = useState('');
  const [gcError, setGcError] = useState('');

  const finalTotal = total + tableSelectedTip;

  const handleGiftCardPay = () => {
    setGcError('');
    if (!gcCode.trim()) {
      setGcError('Please enter a gift card code');
      playBeep('error');
      return;
    }
    const gc = giftCards.find(g => g.code === gcCode.trim());
    if (!gc) {
      setGcError('Gift card not found');
      playBeep('error');
      return;
    }
    if (gc.status !== 'Active') {
      setGcError(\`Gift card is \${gc.status}\`);
      playBeep('error');
      return;
    }
    if (gc.balance < finalTotal) {
      setGcError(\`Insufficient funds (Balance: $\${gc.balance.toFixed(2)})\`);
      playBeep('error');
      return;
    }
    
    // Deduct
    if (setGiftCards) {
      const updated = giftCards.map(g => {
        if (g.id === gc.id) {
          const newBal = g.balance - finalTotal;
          return { ...g, balance: newBal, status: newBal <= 0 ? 'Redeemed' : 'Active' };
        }
        return g;
      });
      setGiftCards(updated);
    }
    
    playBeep('success');
    handleCloseCheck('Gift Card', tableSelectedTip);
  };
`;

content = content.replace(
  /return \(/,
  gcStateStr + "\n  return ("
);

// Change Gift Card button click
content = content.replace(
  /\} else \{\n\s*handleCloseCheck\(m, 0\);\n\s*\}/,
  "} else if (m === 'Gift Card') {\n                    setShowPayment(false);\n                    setTableCardPaymentStep('GIFT_CARD');\n                  } else {\n                    handleCloseCheck(m, 0);\n                  }"
);


// Add title logic
content = content.replace(
  /\{tableCardPaymentStep === 'TAP' \? 'Terminal Card Tap' : 'Select Gratuity'\}/,
  "{tableCardPaymentStep === 'TAP' ? 'Terminal Card Tap' : tableCardPaymentStep === 'GIFT_CARD' ? 'Gift Card Pay' : 'Select Gratuity'}"
);

// Add Gift Card view to the ternary render
const gcView = `
          {tableCardPaymentStep === 'GIFT_CARD' ? (
            <div className="flex flex-col items-center justify-center gap-6 py-6">
              <div className="w-full">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Enter Gift Card Code</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={gcCode}
                    onChange={(e) => { setGcCode(e.target.value.toUpperCase()); setGcError(''); }}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-lg tracking-widest uppercase focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    placeholder="GC-XXXX-XXXX-XXXX"
                    autoFocus
                  />
                </div>
                {gcError && (
                  <p className="text-red-500 text-sm font-bold mt-2 animate-shake">{gcError}</p>
                )}
              </div>
              
              <div className="text-center w-full py-3 bg-slate-50 rounded-2xl border border-slate-200 mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Due</span>
                <span className="text-2xl font-black text-slate-900">\${finalTotal.toFixed(2)}</span>
              </div>
              
              <div className="w-full flex gap-3">
                <button 
                  onClick={() => { setTableCardPaymentStep('NONE'); setShowPayment(true); }}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-200 transition-all active:scale-95"
                >
                  Back
                </button>
                <button 
                  onClick={handleGiftCardPay}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Process Pay
                </button>
              </div>
            </div>
          ) : tableCardPaymentStep === 'TAP' ? (
`;

content = content.replace(
  /\{tableCardPaymentStep === 'TAP' \? \(/,
  gcView
);

fs.writeFileSync('components/dining/TableServicePaymentModal.tsx', content);

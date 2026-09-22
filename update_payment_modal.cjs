const fs = require('fs');
let content = fs.readFileSync('components/pos/register_modals/PaymentModal.tsx', 'utf8');

// Add giftCards to props interface
content = content.replace(
  /onPay: \(method: string, tipAmount\?: number\) => void;/,
  "onPay: (method: string, tipAmount?: number) => void;\n  giftCards?: any[];\n  setGiftCards?: any;"
);

// Destructure new props
content = content.replace(
  /export const PaymentModal: React.FC<PaymentModalProps> = \({ total, cart, onClose, onPay }\) => {/,
  "export const PaymentModal: React.FC<PaymentModalProps> = ({ total, cart, onClose, onPay, giftCards = [], setGiftCards }) => {"
);

// Update view state type
content = content.replace(
  /<'METHODS' \| 'SPLIT' \| 'CARD_TAP' \| 'TIP_PROMPT'>\('METHODS'\);/,
  "<'METHODS' | 'SPLIT' | 'CARD_TAP' | 'TIP_PROMPT' | 'GIFT_CARD'>('METHODS');"
);

// Add GC state
content = content.replace(
  /const \[selectedMethod, setSelectedMethod\] = useState<string>\('Card'\);/,
  "const [selectedMethod, setSelectedMethod] = useState<string>('Card');\n  const [gcCode, setGcCode] = useState('');\n  const [gcError, setGcError] = useState('');"
);

// Add GC handling logic
const gcLogic = `
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
    onPay('Gift Card', selectedTip);
  };
`;

content = content.replace(
  /const handleSelectCard = \(method: string = 'Card'\) => {/,
  gcLogic + "\n  const handleSelectCard = (method: string = 'Card') => {"
);

// Change Gift Card button click
content = content.replace(
  /<button onClick=\{\(\) => onPay\('Gift Card', 0\)\} className="p-6 bg-white border-2 border-slate-200 rounded-2xl hover:border-purple-500 hover:shadow-lg transition-all flex flex-col items-center gap-3 group text-center">/,
  "<button onClick={() => setView('GIFT_CARD')} className=\"p-6 bg-white border-2 border-slate-200 rounded-2xl hover:border-purple-500 hover:shadow-lg transition-all flex flex-col items-center gap-3 group text-center\">"
);

// Add Gift Card view to the ternary render
const gcView = `
          ) : view === 'GIFT_CARD' ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
              <div className="w-full max-w-sm">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Enter or Scan Gift Card Code</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={gcCode}
                    onChange={(e) => { setGcCode(e.target.value.toUpperCase()); setGcError(''); }}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-lg tracking-widest uppercase focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    placeholder="GC-XXXX-XXXX-XXXX"
                    autoFocus
                  />
                </div>
                {gcError && (
                  <p className="text-red-500 text-sm font-bold mt-2 animate-shake">{gcError}</p>
                )}
              </div>
              <div className="w-full max-w-sm flex gap-3">
                <button 
                  onClick={() => setView('METHODS')}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-200 transition-all active:scale-95"
                >
                  Back
                </button>
                <button 
                  onClick={handleGiftCardPay}
                  className="flex-[2] py-4 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all active:scale-95"
                >
                  Process Pay
                </button>
              </div>
            </div>
`;

content = content.replace(
  /\{view === 'METHODS' \? \(/,
  "{view === 'METHODS' ? ("
);

content = content.replace(
  /\} \? 'Select Tip' : 'Select Method'\}/,
  "} ? 'Select Tip' : view === 'GIFT_CARD' ? 'Gift Card Pay' : 'Select Method'}"
);

content = content.replace(
  /\) : view === 'CARD_TAP' \? \(/,
  gcView + "          ) : view === 'CARD_TAP' ? ("
);

fs.writeFileSync('components/pos/register_modals/PaymentModal.tsx', content);

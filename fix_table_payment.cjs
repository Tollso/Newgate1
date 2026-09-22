const fs = require('fs');
let content = fs.readFileSync('components/dining/TableServicePaymentModal.tsx', 'utf8');

// I'll extract everything and reassemble.
// I know the structure.
content = content.replace(/  if \(showPayment\) \{\s*const \[gcCode, setGcCode\] = useState\(''\);/, 
`  const [gcCode, setGcCode] = useState('');
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

  if (showPayment) {
    return (`
);

// We need to remove the duplicate `const [gcCode, setGcCode]...` and `handleGiftCardPay` further down if it exists, or wait, my first regex already replaced `return (`.
// Let's just do a clean rewrite since it's a short file.

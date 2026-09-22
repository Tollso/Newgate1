import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { GiftCard, GiftCardsSettingsSectionProps, NewGiftCardForm } from './giftcards/GiftCardTypes';
import { GiftCardIssueModal } from './giftcards/GiftCardIssueModal';
import { GiftCardViewPrintModal } from './giftcards/GiftCardViewPrintModal';
import { GiftCardTable } from './giftcards/GiftCardTable';

export const GiftCardsSettingsSection: React.FC<GiftCardsSettingsSectionProps> = ({
  businesses = [],
  giftCards = [],
  setGiftCards,
}) => {
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<any | null>(null);
  const [validationError, setValidationError] = useState('');
  
  const [newCard, setNewCard] = useState<NewGiftCardForm>({
    type: 'Physical',
    balance: 50,
    businessId: businesses.length > 0 ? businesses[0].id : '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    sendViaEmail: false,
    sendViaSms: false,
    manualCode: '',
    manualSecurityCode: '',
    expirationMode: '6 Months',
    customExpirationDate: '',
  });

  const handleIssueCard = () => {
    if (!setGiftCards) return;
    setValidationError('');
    if (newCard.balance <= 0) return setValidationError('Please enter an amount greater than $0.');
    if (!newCard.businessId) return setValidationError('Please select a store restriction.');
    if (newCard.type === 'Digital') {
      if (newCard.sendViaEmail && !newCard.customerEmail) return setValidationError('Customer email is required.');
      if (newCard.sendViaSms && !newCard.customerPhone) return setValidationError('Customer phone is required.');
    }

    let finalCode = '';
    if (newCard.type === 'Physical' && newCard.manualCode.trim() !== '') {
      finalCode = newCard.manualCode.trim();
      if (giftCards.some(c => c.code === finalCode)) {
        return setValidationError('This gift card code is already in use on the system.');
      }
    } else {
      let isUnique = false;
      while (!isUnique) {
        const raw16Digits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
        finalCode = raw16Digits.match(/.{1,4}/g)?.join('-') || raw16Digits;
        if (!giftCards.some(card => card.code === finalCode)) isUnique = true;
      }
    }

    const securityCode = newCard.manualSecurityCode.trim() || Math.floor(100 + Math.random() * 900).toString();
    let expirationDate: string | undefined = undefined;
    const now = new Date();

    const addDays = (d: Date, days: number) => { const r = new Date(d); r.setDate(r.getDate() + days); return r.toISOString(); };
    const addMonths = (d: Date, m: number) => { const r = new Date(d); r.setMonth(r.getMonth() + m); return r.toISOString(); };
    const addYears = (d: Date, y: number) => { const r = new Date(d); r.setFullYear(r.getFullYear() + y); return r.toISOString(); };

    if (newCard.expirationMode === '15 Days') expirationDate = addDays(now, 15);
    else if (newCard.expirationMode === '1 Month') expirationDate = addMonths(now, 1);
    else if (newCard.expirationMode === '3 Months') expirationDate = addMonths(now, 3);
    else if (newCard.expirationMode === '6 Months') expirationDate = addMonths(now, 6);
    else if (newCard.expirationMode === '1 Year') expirationDate = addYears(now, 1);
    else if (newCard.expirationMode === 'Custom Date') {
      if (!newCard.customExpirationDate) return setValidationError('Please select a custom expiration date.');
      const d = new Date(newCard.customExpirationDate + 'T23:59:59');
      if (isNaN(d.getTime()) || d < now) return setValidationError('Expiration date must be in the future.');
      expirationDate = d.toISOString();
    }

    const card: GiftCard = {
      id: Math.random().toString(36).substr(2, 9),
      code: finalCode,
      securityCode,
      type: newCard.type as any,
      balance: newCard.balance,
      initialBalance: newCard.balance,
      issuedDate: new Date().toISOString(),
      expirationDate,
      status: 'Active',
      businessId: newCard.businessId,
      customerName: newCard.customerName,
      customerEmail: newCard.customerEmail,
      customerPhone: newCard.customerPhone,
    };

    setGiftCards([...giftCards, card]);
    setShowIssueModal(false);
    setShowViewModal({ ...card, _sendViaEmail: newCard.sendViaEmail, _sendViaSms: newCard.sendViaSms });

    setNewCard({
      type: 'Physical', balance: 50, businessId: businesses[0]?.id || '',
      customerName: '', customerEmail: '', customerPhone: '', manualCode: '',
      manualSecurityCode: '', sendViaEmail: false, sendViaSms: false,
      expirationMode: '6 Months', customExpirationDate: '',
    });
  };

  const getBusinessName = (id: string) => {
    const b = businesses.find(b => b.id === id);
    return b ? b.name : 'Unknown Store';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Advanced Gift Cards</h2>
          <p className="text-sm text-slate-500">Manage, issue, and track digital and physical gift cards restricted by store.</p>
        </div>
        <button 
          onClick={() => { setShowIssueModal(true); setValidationError(''); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Issue Gift Card
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by code or customer..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">
              Total Active: {giftCards.filter(g => g.status === 'Active').length}
            </div>
          </div>
        </div>

        <GiftCardTable giftCards={giftCards} getBusinessName={getBusinessName} onViewCard={setShowViewModal} />
      </div>

      <GiftCardIssueModal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        validationError={validationError}
        newCard={newCard}
        setNewCard={setNewCard}
        businesses={businesses}
        onIssueCard={handleIssueCard}
      />

      <GiftCardViewPrintModal
        card={showViewModal}
        onClose={() => setShowViewModal(null)}
        getBusinessName={getBusinessName}
      />
    </div>
  );
};

export default GiftCardsSettingsSection;

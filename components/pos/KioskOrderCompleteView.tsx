import React from 'react';
import { Check } from 'lucide-react';

interface KioskOrderCompleteViewProps {
  orderNumber: string;
  theme: any;
}

export const KioskOrderCompleteView: React.FC<KioskOrderCompleteViewProps> = ({ orderNumber, theme }) => (
  <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center animate-fade-in">
    <div className={`w-32 h-32 rounded-full ${theme.light} flex items-center justify-center mb-8 animate-scale-in`}>
      <Check size={64} className={theme.text} />
    </div>
    <h1 className="text-5xl font-black text-slate-900 mb-4">Order Received!</h1>
    <p className="text-2xl text-slate-600 mb-8">Your order number is</p>
    <div className={`text-8xl font-black ${theme.text} mb-12 animate-pulse`}>#{orderNumber}</div>
    <p className="text-xl text-slate-500">Please take your receipt and wait for your number to be called.</p>
  </div>
);

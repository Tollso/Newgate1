import React from 'react';
import { ShoppingCart, Lock, Link as LinkIcon } from 'lucide-react';

import { CheckoutCustomizationSub } from './transactions/CheckoutCustomizationSub';
import { FraudPreventionSub } from './transactions/FraudPreventionSub';
import { PaymentLinksSub } from './transactions/PaymentLinksSub';

interface CheckoutPaymentsSectionProps {
  subSection: string | null;
  setSubSection: (val: string | null) => void;
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  SettingCard: React.FC<any>;
  checkoutSettings: any;
  setCheckoutSettings: (val: any) => void;
  fraudSettings: any;
  setFraudSettings: (val: any) => void;
  paymentLinks: any[];
  setPaymentLinks: (val: any[]) => void;
}

export const CheckoutPaymentsSection: React.FC<CheckoutPaymentsSectionProps> = ({
  subSection,
  setSubSection,
  renderSectionHeader,
  SettingCard,
  checkoutSettings,
  setCheckoutSettings,
  fraudSettings,
  setFraudSettings,
  paymentLinks,
  setPaymentLinks
}) => {
  if (subSection === 'Checkout customization') {
    return (
      <CheckoutCustomizationSub
        renderSectionHeader={renderSectionHeader}
        checkoutSettings={checkoutSettings}
        setCheckoutSettings={setCheckoutSettings}
      />
    );
  }

  if (subSection === 'Fraud prevention') {
    return (
      <FraudPreventionSub
        renderSectionHeader={renderSectionHeader}
        fraudSettings={fraudSettings}
        setFraudSettings={setFraudSettings}
      />
    );
  }

  if (subSection === 'Payment links') {
    return (
      <PaymentLinksSub
        renderSectionHeader={renderSectionHeader}
        paymentLinks={paymentLinks}
        setPaymentLinks={setPaymentLinks}
      />
    );
  }

  return (
    <div className="max-w-4xl animate-fade-in pb-20">
      {renderSectionHeader("Transactions & Payments", "Configure checkout settings, fraud rules, and digital payment links.")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SettingCard icon={ShoppingCart} title="Checkout customization" description="Branding, custom fields, and webhook configurations for online checkout." onClick={() => setSubSection('Checkout customization')} />
        <SettingCard icon={Lock} title="Fraud prevention" description="AVS, CVV verification, and automated transaction risk thresholds." onClick={() => setSubSection('Fraud prevention')} />
        <SettingCard icon={LinkIcon} title="Payment links" description="Create static and dynamic checkout URLs for catering or deposits." onClick={() => setSubSection('Payment links')} />
      </div>
    </div>
  );
};

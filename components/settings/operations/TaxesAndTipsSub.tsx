import React from 'react';
import { GlobalTaxConfig, TipConfig } from '../../../types';
import { TaxesSub } from './TaxesSub';
import { TipsAndFeesSub } from './TipsAndFeesSub';

interface TaxesAndTipsSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  mode: 'taxes' | 'tips';
  taxConfig?: GlobalTaxConfig;
  setTaxConfig?: React.Dispatch<React.SetStateAction<GlobalTaxConfig>>;
  tipConfig?: TipConfig;
  setTipConfig?: React.Dispatch<React.SetStateAction<TipConfig>>;
}

export const TaxesAndTipsSub: React.FC<TaxesAndTipsSubProps> = ({
  renderSectionHeader,
  mode,
  taxConfig,
  setTaxConfig,
  tipConfig,
  setTipConfig
}) => {
  if (mode === 'taxes') {
    return (
      <TaxesSub
        renderSectionHeader={renderSectionHeader}
        taxConfig={taxConfig}
        setTaxConfig={setTaxConfig}
      />
    );
  }

  return (
    <TipsAndFeesSub
      renderSectionHeader={renderSectionHeader}
      tipConfig={tipConfig}
      setTipConfig={setTipConfig}
    />
  );
};

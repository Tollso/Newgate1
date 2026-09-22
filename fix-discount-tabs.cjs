const fs = require('fs');

const origText = fs.readFileSync('components/inventory/DiscountTabs.txt', 'utf8');

const activeRegex = /      \{activeTab === 'Active' && \([\s\S]*?      \)\}/;
const activeMatch = origText.match(activeRegex);
const activeStr = activeMatch ? activeMatch[0].replace("      {activeTab === 'Active' && (", '').replace(/      \)\}/, '') : '';

const defaultRegex = /      \{activeTab === 'Default' && \([\s\S]*?      \)\}/;
const defaultMatch = origText.match(defaultRegex);
const defaultStr = defaultMatch ? defaultMatch[0].replace("      {activeTab === 'Default' && (", '').replace(/      \)\}/, '') : '';

const giftRegex = /      \{activeTab === 'Gift Cards' && \([\s\S]*?      \)\}/;
const giftMatch = origText.match(giftRegex);
const giftStr = giftMatch ? giftMatch[0].replace("      {activeTab === 'Gift Cards' && (", '').replace(/      \)\}/, '') : '';

const tabsCode = `import React from 'react';
import { Tag, Edit2, Copy, Trash2, ShieldAlert, Plus, Gift, Search } from 'lucide-react';
import { DiscountCode } from '../../types';

export const ActiveDiscountsTab = ({ activeDiscounts, searchTerm, setSearchTerm, handleOpenEdit, handleDuplicate, handleDeleteDiscount }: any) => (
  ${activeStr}
);

export const DefaultDiscountsTab = ({ defaultDiscounts, handleOpenCreate, handleOpenEdit, handleDeleteDiscount }: any) => (
  ${defaultStr}
);

export const GiftCardsTab = () => (
  ${giftStr}
);
`;

fs.writeFileSync('components/inventory/DiscountTabs.tsx', tabsCode);

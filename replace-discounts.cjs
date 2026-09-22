const fs = require('fs');
let c = fs.readFileSync('components/inventory/Discounts.tsx', 'utf8');

c = c.replace(/import \{ DiscountModal \} from '\.\.\/discounts\/DiscountModal';/, "import { DiscountModal } from '../discounts/DiscountModal';\nimport { ActiveDiscountsTab, DefaultDiscountsTab, GiftCardsTab } from './DiscountTabs';");

const regex = /      \{activeTab === 'Active' && \([\s\S]*?      \{activeTab === 'Default' && \([\s\S]*?      \{activeTab === 'Gift Cards' && \([\s\S]*?      \)\}\n    <\/div>/g;
c = c.replace(regex, `      {activeTab === 'Active' && <ActiveDiscountsTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} activeDiscounts={activeDiscounts} handleToggleActive={handleToggleActive} handleOpenEdit={handleOpenEdit} setDiscounts={setDiscounts} />}
      {activeTab === 'Default' && <DefaultDiscountsTab defaultDiscounts={defaultDiscounts} handleOpenEdit={handleOpenEdit} setDiscounts={setDiscounts} />}
      {activeTab === 'Gift Cards' && <GiftCardsTab />}
    </div>`);

fs.writeFileSync('components/inventory/Discounts.tsx', c);

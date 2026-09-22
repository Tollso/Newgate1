const fs = require('fs');
let c = fs.readFileSync('components/items/ItemModal.tsx', 'utf8');

c = c.replace(/import \{ X, Box, Tag, DollarSign, Monitor, AlertTriangle, Image as ImageIcon \} from 'lucide-react';/, "import { X, Box, Tag, DollarSign, Monitor } from 'lucide-react';\nimport { ItemModalGeneralTab, ItemModalOptionsTab, ItemModalPricingTab, ItemModalVisibilityTab } from './ItemModalTabs';");
c = c.replace(/import \{ MOCK_PRINTER_LABELS \} from '\.\.\/\.\.\/constants';\n/, '');

const regex = /          \{activeTab === 'General' && \([\s\S]*?            <\/div>\n          \)\}\n\n          \{activeTab === 'Options' && \([\s\S]*?            <\/div>\n          \)\}\n\n          \{activeTab === 'Pricing' && \([\s\S]*?            <\/div>\n          \)\}\n\n          \{activeTab === 'Visibility' && \([\s\S]*?            <\/div>\n          \)\}/g;

c = c.replace(regex, `          {activeTab === 'General' && <ItemModalGeneralTab formData={formData} setFormData={setFormData} errorMsg={errorMsg} setErrorMsg={setErrorMsg} allCategoryNames={allCategoryNames} handleImageUpload={handleImageUpload} />}
          {activeTab === 'Options' && <ItemModalOptionsTab formData={formData} modifierGroups={modifierGroups} toggleModifierGroup={toggleModifierGroup} togglePrinterLabel={togglePrinterLabel} />}
          {activeTab === 'Pricing' && <ItemModalPricingTab formData={formData} setFormData={setFormData} />}
          {activeTab === 'Visibility' && <ItemModalVisibilityTab formData={formData} setFormData={setFormData} />}`);

fs.writeFileSync('components/items/ItemModal.tsx', c);

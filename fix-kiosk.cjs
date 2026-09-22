const fs = require('fs');

let kioskApp = fs.readFileSync('components/pos/KioskApp.tsx', 'utf8');

// Insert KioskModifierModal import
if (!kioskApp.includes('KioskModifierModal')) {
    kioskApp = kioskApp.replace(/import \{ InventoryItem, Category, ModifierGroup \} from '\.\.\/types';/g, "import { InventoryItem, Category, ModifierGroup } from '../types';\nimport { KioskModifierModal } from './KioskModifierModal';");
}

// Replace Modifier Selection Modal content
const modifierModalRegex = /\{\/\* Modifier Selection Modal \*\/\}[\s\S]*?(?=<\/div>\n  \);\n\};\n\nexport default KioskApp;)/;

const modalReplacement = `{/* Modifier Selection Modal */}
      <KioskModifierModal
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        modifierGroups={modifierGroups}
        selectedModifiers={selectedModifiers}
        toggleModifier={toggleModifier}
        handleConfirmItem={handleConfirmItem}
        theme={theme}
      />
    </div>`;

kioskApp = kioskApp.replace(modifierModalRegex, modalReplacement);
fs.writeFileSync('components/pos/KioskApp.tsx', kioskApp);

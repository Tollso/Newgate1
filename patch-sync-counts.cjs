const fs = require('fs');

// 1. ModifierGroups.tsx
let modifiersCode = fs.readFileSync('components/ModifierGroups.tsx', 'utf8');
if (!modifiersCode.includes('inventory?: InventoryItem[]')) {
  modifiersCode = modifiersCode.replace(/import \{ ModifierGroup \} from '\.\.\/types';/, "import { ModifierGroup, InventoryItem } from '../types';");
  modifiersCode = modifiersCode.replace(/interface ModifierGroupsProps \{/, "interface ModifierGroupsProps {\n  inventory?: InventoryItem[];");
  modifiersCode = modifiersCode.replace(/const ModifierGroups: React\.FC<ModifierGroupsProps> = \(\{ modifierGroups, setModifierGroups \}\) => \{/, "const ModifierGroups: React.FC<ModifierGroupsProps> = ({ modifierGroups, setModifierGroups, inventory = [] }) => {");
  
  // Replace static itemsCount display with dynamic one
  modifiersCode = modifiersCode.replace(/<td className="p-4">\{grp\.itemsCount\} items<\/td>/g, "<td className=\"p-4\">{inventory.filter(i => (i.modifierGroups || []).includes(grp.id)).length} items</td>");
  modifiersCode = modifiersCode.replace(/<span className="text-sm font-bold text-slate-400">\{grp\.itemsCount\} items<\/span>/g, "<span className=\"text-sm font-bold text-slate-400\">{inventory.filter(i => (i.modifierGroups || []).includes(grp.id)).length} items</span>");
  
  fs.writeFileSync('components/ModifierGroups.tsx', modifiersCode);
}

// 2. PrinterLabels.tsx
let printerCode = fs.readFileSync('components/PrinterLabels.tsx', 'utf8');
if (!printerCode.includes('inventory?: InventoryItem[]')) {
  printerCode = printerCode.replace(/import \{ PrinterLabel, PrinterDevice \} from '\.\.\/types';/, "import { PrinterLabel, PrinterDevice, InventoryItem } from '../types';");
  printerCode = printerCode.replace(/const PrinterLabels: React\.FC = \(\) => \{/, "interface PrinterLabelsProps {\n  inventory?: InventoryItem[];\n}\n\nconst PrinterLabels: React.FC<PrinterLabelsProps> = ({ inventory = [] }) => {");
  
  // Replace static itemsCount display with dynamic one
  printerCode = printerCode.replace(/<td className="p-4">\{lbl\.itemsCount\} items<\/td>/g, "<td className=\"p-4\">{inventory.filter(i => (i.printerLabels || []).includes(lbl.id)).length} items</td>");
  printerCode = printerCode.replace(/<span className="text-xs font-bold text-slate-400">\{lbl\.itemsCount\} items<\/span>/g, "<span className=\"text-xs font-bold text-slate-400\">{inventory.filter(i => (i.printerLabels || []).includes(lbl.id)).length} items</span>");
  
  fs.writeFileSync('components/PrinterLabels.tsx', printerCode);
}

// 3. ContentAreaRoutes.tsx
let routesCode = fs.readFileSync('components/app/ContentAreaRoutes.tsx', 'utf8');
if (!routesCode.includes('inventory={props.inventory}')) {
  routesCode = routesCode.replace(/<ModifierGroups modifierGroups=\{props\.modifierGroups\} setModifierGroups=\{props\.setModifierGroups\} \/>/, "<ModifierGroups modifierGroups={props.modifierGroups} setModifierGroups={props.setModifierGroups} inventory={props.inventory} />");
  routesCode = routesCode.replace(/<PrinterLabels \/>/, "<PrinterLabels inventory={props.inventory} />");
  fs.writeFileSync('components/app/ContentAreaRoutes.tsx', routesCode);
}

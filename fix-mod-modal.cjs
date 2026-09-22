const fs = require('fs');
let code = fs.readFileSync('components/modifiers/ModifierGroupModal.tsx', 'utf8');

// Replace the two-column grid with a single column for modifiers count, removing the linked items input
const gridRegex = /<div className="grid grid-cols-2 gap-4">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/;
const replacement = `<div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Modifiers Count</label>
              <input 
                type="number" 
                min="0"
                value={formData.modifiersCount || 0}
                onChange={e => setFormData({ ...formData, modifiersCount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none font-medium text-slate-800"
              />
            </div>
        </div>`;

code = code.replace(gridRegex, replacement);
fs.writeFileSync('components/modifiers/ModifierGroupModal.tsx', code);

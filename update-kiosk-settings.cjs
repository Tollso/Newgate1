const fs = require('fs');
let code = fs.readFileSync('components/settings/KioskSettingsSection.tsx', 'utf8');

const layoutSetting = `
          {/* Category Layout */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
              <LayoutGrid size={16} className="text-slate-400" />
              Category Menu Style
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'top', label: 'Top Horizontal Bar' },
                { id: 'sidebar', label: 'Left Sidebar' },
                { id: 'hidden', label: 'Hidden (All Items)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setKioskConfig({...kioskConfig, categoryLayout: opt.id as any})}
                  className={\`p-4 rounded-xl border-2 text-sm font-bold transition-all flex flex-col items-center justify-center gap-2 \${
                    (kioskConfig.categoryLayout || 'top') === opt.id 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                  }\`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
`;

if (!code.includes('Category Menu Style')) {
  code = code.replace(/\{id: 'grid-only', label: 'Menu Only \(Cart as Popup\)' \},\s*\]\.map\(opt => \(/, 
    "{ id: 'grid-only', label: 'Menu Only (Cart as Popup)' },\n              ].map(opt => (");
  
  code = code.replace(/\{id: 'grid-only', label: 'Menu Only \(Cart as Popup\)' \}/, "{ id: 'grid-only', label: 'Menu Only (Cart as Popup)' }");
  
  code = code.replace(/\{id: 'sidebar-left', label: 'Cart on Left' \}/, "{ id: 'sidebar-left', label: 'Cart on Left' }");
  
  // Just insert it after Layout Option
  code = code.replace(/\{id: 'sidebar-right', label: 'Cart on Right' \},\s*\{id: 'sidebar-left', label: 'Cart on Left' \},\s*\{id: 'grid-only', label: 'Menu Only \(Cart as Popup\)' \}\s*\]\.map\(opt => \(/, 
  "[ { id: 'sidebar-right', label: 'Cart on Right' }, { id: 'sidebar-left', label: 'Cart on Left' }, { id: 'grid-only', label: 'Menu Only (Cart as Popup)' } ].map(opt => (");
  
  // Instead of complex replacement, let's inject after the entire Layout Option block
  // Actually, I can just find {/* Timeout */} or something and insert before it.
  code = code.replace(/\{\/\* Timeout \*\/\}/, layoutSetting + '\n          {/* Timeout */}');
  
  fs.writeFileSync('components/settings/KioskSettingsSection.tsx', code);
}

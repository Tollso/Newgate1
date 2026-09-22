const fs = require('fs');

let code = fs.readFileSync('components/KioskApp.tsx', 'utf8');

// Reverse the broken replacements
code = code.replace(/\$\{config\.themeColor\}/g, "indigo");
code = code.replace(/\`text-\indigo-600\`/g, "'text-indigo-600'");
code = code.replace(/\`bg-\indigo-600\`/g, "'bg-indigo-600'");
code = code.replace(/\`text-\indigo-700\`/g, "'text-indigo-700'");

// Now let's implement theme mapping properly
const themeLogic = `
  const themeMap: Record<string, { bg: string, bgHover: string, bgLight: string, text: string, textLight: string, border: string }> = {
    indigo: { bg: 'bg-indigo-600', bgHover: 'hover:bg-indigo-700', bgLight: 'bg-indigo-50', text: 'text-indigo-600', textLight: 'text-indigo-400', border: 'border-indigo-500' },
    slate: { bg: 'bg-slate-800', bgHover: 'hover:bg-slate-900', bgLight: 'bg-slate-100', text: 'text-slate-800', textLight: 'text-slate-500', border: 'border-slate-800' },
    rose: { bg: 'bg-rose-600', bgHover: 'hover:bg-rose-700', bgLight: 'bg-rose-50', text: 'text-rose-600', textLight: 'text-rose-400', border: 'border-rose-500' },
    emerald: { bg: 'bg-emerald-600', bgHover: 'hover:bg-emerald-700', bgLight: 'bg-emerald-50', text: 'text-emerald-600', textLight: 'text-emerald-400', border: 'border-emerald-500' },
    amber: { bg: 'bg-amber-600', bgHover: 'hover:bg-amber-700', bgLight: 'bg-amber-50', text: 'text-amber-600', textLight: 'text-amber-400', border: 'border-amber-500' }
  };
  const theme = themeMap[config.themeColor] || themeMap.indigo;
`;

if (!code.includes('const themeMap')) {
  code = code.replace(/const filteredItems = useMemo/, themeLogic + '\n  const filteredItems = useMemo');
}

// Map the welcome message
code = code.replace(/<h2 className="text-4xl font-black text-slate-800 tracking-tight mb-3">.*?<\/h2>/, '<h2 className="text-4xl font-black text-slate-800 tracking-tight mb-3">{config.welcomeMessage}</h2>');

// Map layout options
// Currently layout is: 
// <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-2xl shrink-0">
// Let's replace the main wrapper layout
const originalLayoutStr = `<div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-slate-50">`;

// Add layout condition around the cart
const flexLayoutStr = `
      <div className={\`flex-1 flex overflow-hidden \${config.layout === 'sidebar-left' ? 'flex-row-reverse' : ''}\`}>
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-slate-50">`;
        
code = code.replace(originalLayoutStr, flexLayoutStr);

// Show Item Images
code = code.replace(/<div className="h-32 bg-slate-100 rounded-xl mb-4 flex items-center justify-center">/g, 
  `{config.showItemImages && (<div className="h-32 bg-slate-100 rounded-xl mb-4 flex items-center justify-center">`);
code = code.replace(/<Utensils className="text-slate-300" size={32} \/>\n\s*<\/div>/g, 
  `<Utensils className="text-slate-300" size={32} />\n                  </div>)}`);

fs.writeFileSync('components/KioskApp.tsx', code);

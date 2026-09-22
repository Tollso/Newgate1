const fs = require('fs');
let content = fs.readFileSync('components/dining/TableServiceOrderPanel.tsx', 'utf-8');

// 1. Root container (stack vertically on < lg)
content = content.replace(
  '<div className="h-full flex flex-col md:flex-row bg-slate-900 text-white animate-fade-in font-sans overflow-hidden">',
  '<div className="h-full flex flex-col lg:flex-row bg-slate-900 text-white animate-fade-in font-sans overflow-hidden">'
);

// 2. Col 2 (Ticket takes 45vh on < lg, auto on lg)
content = content.replace(
  '<div className="w-full md:w-[320px] xl:w-[360px] h-[45vh] md:h-auto border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-900 shrink-0 relative">',
  '<div className="w-full lg:w-[320px] xl:w-[360px] h-[45vh] lg:h-auto border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col bg-slate-900 shrink-0 relative">'
);

// We need to keep the md:p-6 and md:gap-4 for tablets, but change the structural breakpoints to lg:
content = content.replace(
  '<div className="flex-1 flex flex-col md:flex-row overflow-hidden">',
  '<div className="flex-1 flex flex-col lg:flex-row overflow-hidden">'
);


fs.writeFileSync('components/dining/TableServiceOrderPanel.tsx', content);
console.log('Patched structural layout to lg');

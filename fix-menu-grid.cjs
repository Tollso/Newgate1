const fs = require('fs');
let code = fs.readFileSync('components/POS/Register/MenuGrid.tsx', 'utf8');

const updatedIconBlock = `
                            <div className={\`h-14 w-14 rounded-3xl bg-slate-50 flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 transition-transform shadow-inner overflow-hidden
                                \${!item.inStock ? 'bg-slate-200 text-slate-400' : ''}\`}>
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Tag size={24} />
                                )}
                            </div>
`;

code = code.replace(/<div className=\{\`h-14 w-14 rounded-3xl bg-slate-50 flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 transition-transform shadow-inner\s*\$\{!(?:.*?)inStock \? 'bg-slate-200 text-slate-400' : ''\}\`\}>\s*<Tag size=\{24\} \/>\s*<\/div>/, updatedIconBlock);

fs.writeFileSync('components/POS/Register/MenuGrid.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('components/Items.tsx', 'utf8');

const updatedItemNameCol = `
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <Tag size={16} className="text-slate-400" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 text-base">{item.name}</span>
                      {item.modifierGroups && item.modifierGroups.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                          <Layers size={12} /> {item.modifierGroups.length} Modifier Groups
                        </div>
                      )}
                    </div>
                  </div>
                </td>
`;

code = code.replace(/<td className="px-6 py-4">\s*<div className="flex flex-col">\s*<span className="font-medium text-slate-900 text-base">\{item\.name\}<\/span>[\s\S]*?<\/div>\s*<\/td>/, updatedItemNameCol);

fs.writeFileSync('components/Items.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('components/KioskApp.tsx', 'utf8');

const nameInputHtml = `
              {config.requireCustomerName && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Name for your order <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-slate-800 outline-none transition-all"
                  />
                </div>
              )}
`;

code = code.replace(/<div className="flex justify-between items-center text-xl font-black text-slate-800 mt-6 pt-6 border-t border-slate-200">/, nameInputHtml + '\n              <div className="flex justify-between items-center text-xl font-black text-slate-800 mt-6 pt-6 border-t border-slate-200">');

// Update Pay Button logic to disable if name is required and missing
code = code.replace(/onClick=\{handleProcessPayment\}/, "onClick={handleProcessPayment} disabled={config.requireCustomerName && !customerName.trim()}");

// Make button look disabled if disabled
code = code.replace(/className=\{`w-full flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-3xl border-2 border-slate-200 hover:\$\{theme\.border\} hover:\$\{theme\.bgLight\} hover:shadow-lg transition-all group`\}/g, "className={`w-full flex flex-col items-center justify-center gap-4 bg-white p-8 rounded-3xl border-2 border-slate-200 transition-all ${config.requireCustomerName && !customerName.trim() ? 'opacity-50 cursor-not-allowed' : `hover:${theme.border} hover:${theme.bgLight} hover:shadow-lg group`}`}");

fs.writeFileSync('components/KioskApp.tsx', code);

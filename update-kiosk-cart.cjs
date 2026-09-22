const fs = require('fs');
let code = fs.readFileSync('components/KioskApp.tsx', 'utf8');

const cartSidebarRegex = /\{\/\* Cart Sidebar \*\/\}\s*<div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl z-20">([\s\S]*?)<\/div>\s*<\/div>\s*\)\;\s*\}\;/;
const cartMatch = code.match(cartSidebarRegex);

if (cartMatch) {
  const cartContent = cartMatch[1];
  
  const cartJSX = `
      {/* Cart Content */}
      {config.layout !== 'grid-only' && (
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl z-20 shrink-0">
          ${cartContent}
        </div>
      )}

      {/* Grid Only Floating Button & Modal */}
      {config.layout === 'grid-only' && (
        <>
          {!showCartModal && cart.length > 0 && (
            <button
              onClick={() => setShowCartModal(true)}
              className={\`fixed bottom-8 right-8 py-4 px-8 rounded-full font-black text-lg transition-all flex items-center justify-center gap-3 \${theme.bg} text-white shadow-2xl hover:shadow-xl z-30 animate-scale-in\`}
            >
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              View Cart - \${total.toFixed(2)}
            </button>
          )}

          {showCartModal && (
            <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-in-right">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={24} className="text-slate-800" />
                    <h2 className="text-2xl font-black text-slate-800">Your Order</h2>
                  </div>
                  <button onClick={() => setShowCartModal(false)} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300">
                    <X size={20} />
                  </button>
                </div>
                ${cartContent}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};`;

  code = code.replace(cartSidebarRegex, cartJSX);
  fs.writeFileSync('components/KioskApp.tsx', code);
} else {
  console.log("Could not match cart sidebar regex");
}

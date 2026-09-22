const fs = require('fs');
let code = fs.readFileSync('components/KioskApp.tsx', 'utf8');

// 1. Add showCartModal state
if (!code.includes('showCartModal')) {
  code = code.replace(/const \[orderNumber, setOrderNumber\] = useState<string>\(''\);/, "const [orderNumber, setOrderNumber] = useState<string>('');\n  const [showCartModal, setShowCartModal] = useState(false);");
}

// 2. Replace welcome message
code = code.replace(/<h1 className="text-3xl font-black text-slate-900 mb-6">Welcome! What are you craving\?<\/h1>/, `<h1 className="text-3xl font-black text-slate-900 mb-6">{config.welcomeMessage || 'Welcome! What are you craving?'}</h1>`);

// 3. Flex row reverse for layout
code = code.replace(/<div className="h-full flex bg-slate-50 overflow-hidden">/, `<div className={\`h-full flex bg-slate-50 overflow-hidden \${config.layout === 'sidebar-left' ? 'flex-row-reverse' : ''}\`}>`);

// 4. Cart logic: if grid-only, we should hide the inline sidebar and show a floating button.
const cartSidebarRegex = /\{\/\* Cart Sidebar \*\/\}\s*<div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl z-20">([\s\S]*?)<\/div>\s*<\/div>\s*\)\;\s*\}\;/;
// Wait, the end is: </div>\n    </div>\n  );\n};

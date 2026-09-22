const fs = require('fs');
let code = fs.readFileSync('components/KioskApp.tsx', 'utf8');

// Add props
if (!code.includes('kioskConfig?: any;')) {
  code = code.replace(/taxConfig: GlobalTaxConfig;/, "taxConfig: GlobalTaxConfig;\n  kioskConfig?: any;");
  code = code.replace(/\{ items, categories, taxConfig, onProcessSale \}/, "{ items, categories, taxConfig, onProcessSale, kioskConfig }");
}

// Ensure default fallback for kioskConfig
if (!code.includes('const config = kioskConfig || {')) {
  const configLogic = `
  const config = kioskConfig || {
    welcomeMessage: 'Welcome! What are you craving?',
    themeColor: 'indigo',
    layout: 'sidebar-right',
    requireCustomerName: false,
    showItemImages: true,
    timeoutSeconds: 60
  };
  
  const [customerName, setCustomerName] = useState('');
  `;
  code = code.replace(/const \[orderNumber, setOrderNumber\] = useState<string>\(''\);/, "const [orderNumber, setOrderNumber] = useState<string>('');" + configLogic);
}

// Update primary color classes
code = code.replace(/indigo-600/g, "${config.themeColor}-600");
code = code.replace(/indigo-700/g, "${config.themeColor}-700");
code = code.replace(/indigo-100/g, "${config.themeColor}-100");
code = code.replace(/indigo-50/g, "${config.themeColor}-50");
code = code.replace(/indigo-400/g, "${config.themeColor}-400");
code = code.replace(/indigo-900/g, "${config.themeColor}-900");
code = code.replace(/bg-indigo-600/g, "bg-${config.themeColor}-600");
// Fix literal template replacements
code = code.replace(/'text-indigo-600'/g, "`text-${config.themeColor}-600`");
code = code.replace(/'bg-indigo-600'/g, "`bg-${config.themeColor}-600`");
code = code.replace(/'text-indigo-700'/g, "`text-${config.themeColor}-700`");

// Let's use a simpler Regex replace approach for the JSX
fs.writeFileSync('components/KioskApp.tsx', code);

const fs = require('fs');
let code = fs.readFileSync('hooks/useAppState.ts', 'utf8');

// Add KioskConfig import if needed
if (!code.includes('KioskConfig')) {
  code = code.replace(/TipConfig([^}]*)} from '\.\.\/types';/, "TipConfig, KioskConfig$1} from '../types';");
}

const stateToAdd = `
  const [kioskConfig, setKioskConfig] = useState<KioskConfig>({
    welcomeMessage: 'Welcome! What are you craving?',
    themeColor: 'indigo',
    layout: 'sidebar-right',
    requireCustomerName: false,
    showItemImages: true,
    timeoutSeconds: 60
  });
`;

if (!code.includes('setKioskConfig')) {
  code = code.replace(/const \[taxConfig, setTaxConfig\]/, stateToAdd + '\n  const [taxConfig, setTaxConfig]');
}

// Add to return
if (!code.includes('kioskConfig,')) {
  code = code.replace(/handleDeleteCustomer\n  };/, "handleDeleteCustomer,\n    kioskConfig,\n    setKioskConfig\n  };");
}

fs.writeFileSync('hooks/useAppState.ts', code);

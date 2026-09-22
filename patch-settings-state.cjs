const fs = require('fs');
const file = 'hooks/useSettingsState.ts';
let code = fs.readFileSync(file, 'utf8');

// Add KioskConfig import if needed
if (!code.includes('KioskConfig')) {
  code = code.replace(/TipConfig([^}]*)} from '\.\.\/types';/, "TipConfig, KioskConfig$1} from '../types';");
}

// Add state
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
  code = code.replace(/const \[activeSection, setActiveSection\] = useState<string>\('Overview'\);/, stateToAdd + '\n  const [activeSection, setActiveSection] = useState<string>(\'Overview\');');
}

// Add to return
if (!code.includes('kioskConfig,')) {
  code = code.replace(/filteredAuditLogs\n  };/, "filteredAuditLogs,\n    kioskConfig,\n    setKioskConfig\n  };");
}

fs.writeFileSync(file, code);

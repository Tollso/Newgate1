const fs = require('fs');
let code = fs.readFileSync('components/Settings.tsx', 'utf8');

if (!code.includes('case \'Kiosk\':')) {
  const switchStr = "switch (state.activeSection) {";
  const caseKiosk = `
      case 'Kiosk':
        return <KioskSettingsSection kioskConfig={state.kioskConfig} setKioskConfig={state.setKioskConfig} />;`;
  code = code.replace(switchStr, switchStr + caseKiosk);
  fs.writeFileSync('components/Settings.tsx', code);
}

const fs = require('fs');

// 1. Settings.tsx
let settingsCode = fs.readFileSync('components/Settings.tsx', 'utf8');
if (!settingsCode.includes('kioskConfig?: any;')) {
  settingsCode = settingsCode.replace(/interface SettingsProps \{/, "interface SettingsProps {\n  kioskConfig?: any;\n  setKioskConfig?: any;");
  settingsCode = settingsCode.replace(/onNavigate\n\}\) => \{/, "onNavigate,\n  kioskConfig,\n  setKioskConfig\n}) => {");
  
  // Use props.kioskConfig instead of state.kioskConfig
  settingsCode = settingsCode.replace(/<KioskSettingsSection kioskConfig=\{state\.kioskConfig\} setKioskConfig=\{state\.setKioskConfig\} \/>/, "<KioskSettingsSection kioskConfig={kioskConfig} setKioskConfig={setKioskConfig} />");
  
  fs.writeFileSync('components/Settings.tsx', settingsCode);
}

// 2. useSettingsState.ts (Remove kioskConfig from there as it is in useAppState)
let hookCode = fs.readFileSync('hooks/useSettingsState.ts', 'utf8');
hookCode = hookCode.replace(/\n\s*const \[kioskConfig, setKioskConfig\] = useState<KioskConfig>\(\{[\s\S]*?\}\);\n/, "");
hookCode = hookCode.replace(/kioskConfig,\n\s*setKioskConfig/g, "");
hookCode = hookCode.replace(/,\n\s*kioskConfig,\n\s*setKioskConfig/g, "");
fs.writeFileSync('hooks/useSettingsState.ts', hookCode);

// 3. ContentAreaRoutes.tsx (Pass kioskConfig to Settings)
let routesCode = fs.readFileSync('components/app/ContentAreaRoutes.tsx', 'utf8');
if (!routesCode.includes('kioskConfig={props.kioskConfig}') || !routesCode.match(/<Settings[\s\S]*?kioskConfig=/)) {
  routesCode = routesCode.replace(/<Settings\n/, "<Settings\n          kioskConfig={props.kioskConfig}\n          setKioskConfig={props.setKioskConfig}\n");
  fs.writeFileSync('components/app/ContentAreaRoutes.tsx', routesCode);
}

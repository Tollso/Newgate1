const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('App.tsx', 'utf8');
if (!appCode.includes('kioskConfig, setKioskConfig')) {
  appCode = appCode.replace(/getMergedOrders\n  } = state;/, "getMergedOrders,\n    kioskConfig, setKioskConfig\n  } = state;");
  appCode = appCode.replace(/setRemovalReasons=\{setRemovalReasons\}/, "setRemovalReasons={setRemovalReasons}\n            kioskConfig={kioskConfig}\n            setKioskConfig={setKioskConfig}");
  fs.writeFileSync('App.tsx', appCode);
}

// Patch AppContentArea.tsx
let contentAreaCode = fs.readFileSync('components/app/AppContentArea.tsx', 'utf8');
if (!contentAreaCode.includes('kioskConfig={props.kioskConfig}')) {
  // We need to add kioskConfig to props
  contentAreaCode = contentAreaCode.replace(/businesses:\s*any\[\];/, "businesses: any[];\n  kioskConfig?: any;\n  setKioskConfig?: any;");
  contentAreaCode = contentAreaCode.replace(/businesses=\{props\.businesses\}/, "businesses={props.businesses}\n        kioskConfig={props.kioskConfig}\n        setKioskConfig={props.setKioskConfig}");
  fs.writeFileSync('components/app/AppContentArea.tsx', contentAreaCode);
}

// Patch ContentAreaRoutes.tsx
let routesCode = fs.readFileSync('components/app/ContentAreaRoutes.tsx', 'utf8');
if (!routesCode.includes('kioskConfig?: any')) {
  routesCode = routesCode.replace(/businesses:\s*any\[\];/, "businesses: any[];\n  kioskConfig?: any;\n  setKioskConfig?: any;");
}
if (!routesCode.includes('kioskConfig={props.kioskConfig}')) {
  routesCode = routesCode.replace(/setRemovalReasons=\{props\.setRemovalReasons\}/, "setRemovalReasons={props.setRemovalReasons}\n          kioskConfig={props.kioskConfig}\n          setKioskConfig={props.setKioskConfig}");
  // Also pass to CashierPOS
  routesCode = routesCode.replace(/tipConfig=\{props\.tipConfig\}/, "tipConfig={props.tipConfig}\n          kioskConfig={props.kioskConfig}");
  fs.writeFileSync('components/app/ContentAreaRoutes.tsx', routesCode);
}

// Patch CashierPOS.tsx
let cashierCode = fs.readFileSync('components/CashierPOS.tsx', 'utf8');
if (!cashierCode.includes('kioskConfig?: any')) {
  cashierCode = cashierCode.replace(/onFireToKitchen\?:/, "kioskConfig?: any;\n  onFireToKitchen?:");
}
// Pass to KioskApp
if (!cashierCode.includes('kioskConfig={props.kioskConfig}')) {
  cashierCode = cashierCode.replace(/taxConfig=\{props\.taxConfig/g, "kioskConfig={props.kioskConfig}\n              taxConfig={props.taxConfig");
  fs.writeFileSync('components/CashierPOS.tsx', cashierCode);
}


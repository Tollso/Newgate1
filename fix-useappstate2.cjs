const fs = require('fs');
let c = fs.readFileSync('hooks/useAppState.ts', 'utf8');

c = c.replace(/      if \(data === undefined\) \{\n        const next = \{ \.\.\.prev \};\n        delete next\[tableId\];\n        return next;\n      \}/, '      if (data === undefined) { const next = { ...prev }; delete next[tableId]; return next; }');

fs.writeFileSync('hooks/useAppState.ts', c);

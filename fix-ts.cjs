const fs = require('fs');

let typesCode = fs.readFileSync('types/inventory.ts', 'utf8');
typesCode = typesCode.replace(/location: string;/, "location?: string;");
fs.writeFileSync('types/inventory.ts', typesCode);

let mockCode = fs.readFileSync('src/mocks/mockFloorAndOperationsData.ts', 'utf8');
// For the MOCK_RESERVATIONS array, we'll just add `customerName: 'Guest',` after `id: '...',`
mockCode = mockCode.replace(/id: 'RES-\d+',/g, "$& customerName: 'Guest',");
fs.writeFileSync('src/mocks/mockFloorAndOperationsData.ts', mockCode);


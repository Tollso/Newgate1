const fs = require('fs');

let code = fs.readFileSync('src/mocks/mockFloorAndOperationsData.ts', 'utf8');

// The lines 138-142 are inside MOCK_EMPLOYEE_SALES
// Let's replace any missing properties in MOCK_EMPLOYEE_SALES
code = code.replace(/grossSales: (\d+), discounts: (\d+), netSales: (\d+), tips: (\d+), taxesCollected: (\d+), amountCollected: (\d+), paymentCount: (\d+), avgTicketSize: (\d+)/g, 
  "grossSales: $1, discounts: $2, refunds: 0, nonRevenue: 0, gcActivations: 0, netSales: $3, taxesExpected: $5, taxesCollected: $5, tips: $4, chargesExpected: 0, chargesCollected: 0, amountCollected: $6, paymentCount: $7, voids: 0, avgTicketSize: $8");

// Fix DepositDetails (MOCK_DETAILED_DEPOSITS)
code = code.replace(/fees: (\d+\.\d+), transferred: (\d+\.\d+), status: 'Completed'/g, 
  "fees: $1, chargebacks: 0, paidByOthers: 0, transferred: $2, status: 'Completed'");

// Fix Dispute (MOCK_DISPUTES)
code = code.replace(/customerName: '[^']+', /g, "");

fs.writeFileSync('src/mocks/mockFloorAndOperationsData.ts', code);

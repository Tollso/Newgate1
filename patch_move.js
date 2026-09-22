const fs = require('fs');
const content = fs.readFileSync('components/dining/TableServiceApp.tsx', 'utf-8');

// 1. Add states
let modified = content.replace(
  "const [tableSelectedTip, setTableSelectedTip] = useState<number>(0);",
  "const [tableSelectedTip, setTableSelectedTip] = useState<number>(0);\n  const [movingSourceTable, setMovingSourceTable] = useState<DiningTable | null>(null);\n  const [mergeTargetTable, setMergeTargetTable] = useState<DiningTable | null>(null);"
);

// 2. Modify handleTableClick
modified = modified.replace(
  "if (!table.isSeatable) return;",
  `if (!table.isSeatable) return;

    if (movingSourceTable) {
      if (table.id === movingSourceTable.id) {
        setMovingSourceTable(null); // Cancel
      } else {
        setMergeTargetTable(table);
      }
      return;
    }`
);

// 3. Modify handleTableAction
modified = modified.replace(
  "if (action === 'MARK_RESERVED') {",
  `if (action === 'MOVE_MERGE') {
      setMovingSourceTable(actionTable);
      setActionTable(null);
      return;
    }
    
    if (action === 'MARK_RESERVED') {`
);

// 4. Modify the Move/Merge button to dispatch 'MOVE_MERGE'
modified = modified.replace(
  "alert('Moving/Merging tables allows you to select a destination table from the floor plan to transfer the check.')",
  "handleTableAction('MOVE_MERGE')"
);

// 5. Add Banner and Confirm Modal right after "<div className=\"flex-1 bg-slate-900 overflow-hidden relative\">"
const bannerHtml = `
      {movingSourceTable && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-indigo-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-4 border border-indigo-700 animate-slide-up">
          <span className="flex items-center gap-2">
            <MoveRight size={20} className="text-indigo-300" />
            Select destination table to move/merge <span className="text-indigo-300">Table {movingSourceTable.name}</span>
          </span>
          <button onClick={() => setMovingSourceTable(null)} className="ml-4 p-1 hover:bg-indigo-800 rounded-full transition-colors"><X size={16} /></button>
        </div>
      )}

      {mergeTargetTable && movingSourceTable && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-start mb-4">
               <h3 className="font-black text-xl">{mergeTargetTable.status === 'Available' ? 'Move Table' : 'Merge Tables'}</h3>
               <button onClick={() => setMergeTargetTable(null)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <p className="text-slate-600 font-medium mb-6">
              {mergeTargetTable.status === 'Available' 
                ? \`Move all guests and items from Table \${movingSourceTable.name} to Table \${mergeTargetTable.name}?\`
                : \`Combine guests and items from Table \${movingSourceTable.name} into occupied Table \${mergeTargetTable.name}?\`}
            </p>
            
            <div className="flex gap-3">
               <button onClick={() => setMergeTargetTable(null)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors">
                 Cancel
               </button>
               <button 
                 onClick={() => {
                   const sourceOrder = activeTableOrders[movingSourceTable.id];
                   if (sourceOrder) {
                     if (mergeTargetTable.status === 'Available') {
                       onUpdateTableOrder(mergeTargetTable.id, sourceOrder);
                       onUpdateTableStatus({ 
                         ...mergeTargetTable, 
                         status: movingSourceTable.status, 
                         employeeId: movingSourceTable.employeeId, 
                         assignedToName: movingSourceTable.assignedToName, 
                         timeSeated: movingSourceTable.timeSeated,
                         orderId: movingSourceTable.orderId 
                       });
                     } else {
                       const targetOrder = activeTableOrders[mergeTargetTable.id] || { items: [], guests: [{id:1}] };
                       const maxTargetGuestId = targetOrder.guests.reduce((max, g) => Math.max(max, g.id), 0);
                       const newSourceGuests = sourceOrder.guests.map(g => ({ ...g, id: g.id + maxTargetGuestId }));
                       const newSourceItems = sourceOrder.items.map(i => ({
                         ...i,
                         seatNumber: i.seatNumber === 0 ? 0 : i.seatNumber + maxTargetGuestId
                       }));
                       const mergedOrder = {
                         items: [...targetOrder.items, ...newSourceItems],
                         guests: [...targetOrder.guests, ...newSourceGuests],
                         orderType: targetOrder.orderType,
                         payments: [...(targetOrder.payments || []), ...(sourceOrder.payments || [])]
                       };
                       onUpdateTableOrder(mergeTargetTable.id, mergedOrder);
                     }
                   }
                   
                   onUpdateTableOrder(movingSourceTable.id, undefined);
                   onUpdateTableStatus({ 
                     ...movingSourceTable, 
                     status: 'Available', 
                     assignedToName: undefined, 
                     timeSeated: undefined, 
                     orderId: undefined 
                   });
                   
                   setMergeTargetTable(null);
                   setMovingSourceTable(null);
                 }} 
                 className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
                 Confirm
               </button>
            </div>
          </div>
        </div>
      )}
`;

modified = modified.replace(
  "<div className=\"flex-1 bg-slate-900 overflow-hidden relative\">",
  "<div className=\"flex-1 bg-slate-900 overflow-hidden relative\">\n" + bannerHtml
);

fs.writeFileSync('components/dining/TableServiceApp.tsx', modified);
console.log('Patched TableServiceApp.tsx');

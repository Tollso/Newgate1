const fs = require('fs');
let content = fs.readFileSync('components/pos/KitchenDisplay.tsx', 'utf-8');

const oldTicketCardStart = "const TicketCard: React.FC<{";
const regex = /const TicketCard: React\.FC<\{[\s\S]*?^}$/m;

const newTicketCard = `const TicketCard: React.FC<{ 
    ticket: KitchenTicket, 
    onAction: () => void, 
    actionLabel: string, 
    variant?: 'normal' | 'ready', 
    settings?: KDSSettings,
    activeStation: string 
}> = ({ ticket, onAction, actionLabel, variant = 'normal', settings, activeStation }) => {
    
    // Timer simulation
    const elapsed = '12:30'; 
    const isLate = false; 

    // Group items by guest
    const itemsByGuest = ticket.items.reduce((acc, item) => {
        const seat = item.seatNumber === undefined ? -1 : item.seatNumber;
        if (!acc[seat]) acc[seat] = [];
        acc[seat].push(item);
        return acc;
    }, {} as Record<number, typeof ticket.items>);

    // Order type colors
    const typeColors = {
        'Takeout': 'bg-blue-900/20 border-l-blue-500 border-white/10',
        'Delivery': 'bg-pink-900/20 border-l-pink-500 border-white/10',
        'Kiosk': 'bg-purple-900/20 border-l-purple-500 border-white/10',
        'Dine-in': 'bg-slate-800 border-l-orange-500 border-white/5'
    };

    const typeBadgeColors = {
        'Takeout': 'bg-blue-600',
        'Delivery': 'bg-pink-600',
        'Kiosk': 'bg-purple-600',
        'Dine-in': 'bg-orange-600'
    };

    const typeColor = ticket.type && typeColors[ticket.type] ? typeColors[ticket.type] : typeColors['Dine-in'];
    const badgeColor = ticket.type && typeBadgeColors[ticket.type] ? typeBadgeColors[ticket.type] : typeBadgeColors['Dine-in'];

    return (
        <div className={\`rounded-xl border-l-4 overflow-hidden shadow-sm flex flex-col transition-all hover:translate-y-[-2px]
            \${variant === 'ready' ? 'bg-emerald-900/20 border-l-emerald-500 border-white/10' : typeColor} border\`}>
            
            {/* Header */}
            <div className={\`p-3 flex justify-between items-start border-b \${variant === 'ready' ? 'border-emerald-800/50' : 'border-white/5'}\`}>
                <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono font-bold text-lg">#{ticket.orderId.split('-')[1]}</span>
                        {(settings?.showTable ?? true) && ticket.table && (
                            <span className="bg-slate-700 text-white text-xs px-2 py-0.5 rounded font-bold uppercase">
                                {ticket.table}
                            </span>
                        )}
                        {ticket.type !== 'Dine-in' && (
                            <span className={\`\${badgeColor} text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase flex items-center gap-1\`}>
                                <Package size={10} /> {ticket.type}
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                        {(settings?.showServer ?? true) && (ticket.server ? \`Server: \${ticket.server}\` : 'Online Order')}
                        {ticket.items.some(i => i.seatNumber !== undefined) && \` • \${Math.max(...ticket.items.map(i => i.seatNumber || 0))} Guests\`}
                    </div>
                </div>
                <div className={\`font-mono text-sm font-bold \${isLate ? 'text-red-500 animate-pulse' : 'text-slate-300'}\`}>
                    {elapsed}
                </div>
            </div>

            {/* Items grouped by guest */}
            <div className="p-3 space-y-4 flex-1">
                {Object.entries(itemsByGuest).map(([seatNumStr, items]) => {
                    const seatNum = parseInt(seatNumStr);
                    const seatLabel = seatNum === -1 ? '' : seatNum === 0 ? 'Shared Items' : \`Guest \${seatNum}\`;
                    
                    return (
                        <div key={seatNumStr} className="space-y-2">
                            {seatLabel && (
                                <div className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-700/50 pb-1 mb-2">
                                    {seatLabel}
                                </div>
                            )}
                            {items.map((item, idx) => {
                                const isRelevantToStation = activeStation === 'All Stations' || item.printerLabels?.includes(activeStation);
                                
                                return (
                                    <div key={idx} className={isRelevantToStation ? 'opacity-100' : 'opacity-20 grayscale'}>
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-lg text-slate-300">{item.qty}</span>
                                            <span className="flex-1 ml-3 font-medium text-slate-200">
                                                {item.name}
                                            </span>
                                        </div>
                                        {item.modifiers && item.modifiers.length > 0 && (
                                            <div className="ml-6 text-sm text-slate-400 mt-1 space-y-0.5">
                                                {item.modifiers.map((mod, i) => (
                                                    <div key={i} className="text-orange-400/80">• {mod}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Footer Action */}
            <div className="p-3">
                <button 
                    onClick={onAction}
                    className={\`w-full py-3 rounded-lg font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-colors
                        \${variant === 'ready' 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                            : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}\`}
                >
                    {variant === 'ready' ? <CheckCircle size={16} /> : <Clock size={16} />}
                    {actionLabel}
                </button>
            </div>
        </div>
    );
}`;

content = content.replace(regex, newTicketCard);
fs.writeFileSync('components/pos/KitchenDisplay.tsx', content);
console.log('TicketCard updated');

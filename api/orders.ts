
import { CartItem, DetailedOrder, InventoryItem } from '../types';

// Simulate backend delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const OrdersAPI = {
    /**
     * "Server-side" calculation of the order. 
     * In a real app, this ensures the frontend hasn't tampered with prices.
     */
    processSale: async (items: CartItem[], employeeName: string, locationId: string): Promise<DetailedOrder> => {
        await delay(600); // Network latency simulation

        // 1. Validate Stock (Backend Check)
        // In a real scenario, we would check DB here.
        
        // 2. Calculate Financials
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxRate = 0.0825; // 8.25%
        const tax = subtotal * taxRate;
        const total = subtotal + tax;

        // 3. Generate Order ID
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // 4. Construct Order Object
        const newOrder: DetailedOrder = {
            id: orderId,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            total: total,
            status: 'Paid',
            paymentMethod: 'Card',
            employeeName: employeeName,
            device: 'POS-01',
            type: 'Dine-in',
            items: items.map(i => ({
                id: i.id,
                name: i.name,
                quantity: i.quantity,
                price: i.price,
                modifiers: i.modifiers
            }))
        };

        return newOrder;
    }
};

import { DetailedOrder } from '../../../types';
import { MOCK_SALES_OVERVIEW } from '../../../constants';
import { getMultiplierForDateRange } from '../ReportFilters';

export const calculateDynamicMetrics = (
  orders: DetailedOrder[],
  dateRange: string,
  orderTypeFilter: string,
  employeeFilter: string,
  daypartFilter: string,
  deviceFilter: string
) => {
  let multiplier = getMultiplierForDateRange(dateRange);
  if (orderTypeFilter !== 'All') multiplier *= 0.6;
  if (employeeFilter !== 'All') multiplier *= 0.25;
  if (daypartFilter !== 'All') multiplier *= 0.35;
  if (deviceFilter !== 'All') multiplier *= 0.8;
  
  const paidOrders = orders.filter(o => o.status !== 'Open' && o.status !== 'Void');
  
  const realOrdersCount = paidOrders.length;
  const realGrossSales = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const realDiscounts = paidOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
  const realNetSales = realGrossSales - realDiscounts;
  const realTips = paidOrders.reduce((sum, o) => sum + (o.tip || 0), 0);
  const realAmountCollected = realNetSales + realTips;
  const realGuests = paidOrders.reduce((sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0) || realOrdersCount * 2;

  const base = MOCK_SALES_OVERVIEW.summary;
  const seedOrders = Math.round(base.orders.value * multiplier) + realOrdersCount;
  const seedGross = (base.grossSales.value * multiplier) + realGrossSales;
  const seedNet = (base.netSales.value * multiplier) + realNetSales;
  const seedCollected = (base.amountCollected.value * multiplier) + realAmountCollected;
  const seedGuests = Math.round(base.guests.value * multiplier) + realGuests;
  const avgTicket = seedOrders > 0 ? seedNet / seedOrders : 0;

  return {
    orders: { value: seedOrders, percentageChange: base.orders.percentageChange },
    grossSales: { value: seedGross, percentageChange: base.grossSales.percentageChange },
    netSales: { value: seedNet, percentageChange: base.netSales.percentageChange },
    avgTicketSize: { value: avgTicket, percentageChange: base.avgTicketSize.percentageChange },
    amountCollected: { value: seedCollected, percentageChange: base.amountCollected.percentageChange },
    laborCost: { ...base.laborCost, total: seedGross * 0.22 },
    guests: { value: seedGuests, percentageChange: base.guests.percentageChange }
  };
};

export const calculateCurrentSalesData = (
  orders: DetailedOrder[],
  employeeFilter: string,
  orderTypeFilter: string,
  daypartFilter: string,
  deviceFilter: string
) => {
  let multiplier = 1.0;
  if (employeeFilter !== 'All') multiplier *= 0.5;
  if (orderTypeFilter !== 'All') multiplier *= 0.7;
  if (daypartFilter !== 'All') multiplier *= 0.4;
  if (deviceFilter !== 'All') multiplier *= 0.6;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const realDaySales: Record<string, number> = {};
  days.forEach(d => { realDaySales[d] = 0; });

  const paidOrders = orders.filter(o => o.status !== 'Open' && o.status !== 'Void');
  paidOrders.forEach(o => {
    if (o.date) {
      const dObj = new Date(o.date);
      if (!isNaN(dObj.getTime())) {
        const dayName = dObj.toLocaleDateString('en-US', { weekday: 'short' });
        if (realDaySales[dayName] !== undefined) {
          realDaySales[dayName] += o.total || 0;
        }
      }
    }
  });

  return MOCK_SALES_OVERVIEW.chartData.map(d => {
    const day = d.date;
    const realAdd = realDaySales[day] || 0;
    return {
      ...d,
      current: (d.current * multiplier) + realAdd
    };
  });
};

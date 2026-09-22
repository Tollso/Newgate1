import { DetailedOrder } from '../../../types';
import { MOCK_ORDER_TYPES_EXTENDED, MOCK_TENDER_REPORT_DETAILED } from '../../../constants';
import { getMultiplierForDateRange } from '../ReportFilters';

export const calculateFilteredOrderTypes = (
  orders: DetailedOrder[],
  dateRange: string,
  employeeFilter: string,
  daypartFilter: string,
  deviceFilter: string
) => {
  const typesMap: Record<string, { type: string; ordersCount: number; grossSales: number; netSales: number; avgTicketSize: number }> = {};
  
  const defaultTypes = ['Dine-In', 'Takeout', 'Delivery', 'Drive-Thru'];
  defaultTypes.forEach(t => {
    typesMap[t] = {
      type: t,
      ordersCount: 0,
      grossSales: 0,
      netSales: 0,
      avgTicketSize: 0
    };
  });

  MOCK_ORDER_TYPES_EXTENDED.forEach(ot => {
    let m = getMultiplierForDateRange(dateRange);
    if (employeeFilter !== 'All') m *= 0.45;
    if (daypartFilter !== 'All') m *= 0.35;
    if (deviceFilter !== 'All') m *= 0.8;

    typesMap[ot.type] = {
      type: ot.type,
      ordersCount: Math.round(ot.ordersCount * m),
      grossSales: ot.grossSales * m,
      netSales: ot.netSales * m,
      avgTicketSize: ot.avgTicketSize
    };
  });

  orders.forEach(order => {
    const isPaid = order.status !== 'Void' && order.status !== 'Refunded';
    if (!isPaid) return;

    let typeName = 'Dine-In';
    if (order.type) {
      if (order.type.toLowerCase().includes('dine')) typeName = 'Dine-In';
      else if (order.type.toLowerCase().includes('take') || order.type.toLowerCase().includes('go')) typeName = 'Takeout';
      else if (order.type.toLowerCase().includes('deliver')) typeName = 'Delivery';
      else if (order.type.toLowerCase().includes('drive')) typeName = 'Drive-Thru';
    }

    const gross = order.total || 0;
    const discount = order.discount || 0;
    const net = gross - discount;

    if (typesMap[typeName]) {
      typesMap[typeName].ordersCount += 1;
      typesMap[typeName].grossSales += gross;
      typesMap[typeName].netSales += net;
    } else {
      typesMap[typeName] = {
        type: typeName,
        ordersCount: 1,
        grossSales: gross,
        netSales: net,
        avgTicketSize: net
      };
    }
  });

  return Object.values(typesMap).map(ot => ({
    ...ot,
    avgTicketSize: ot.ordersCount > 0 ? ot.netSales / ot.ordersCount : 0
  }));
};

export const calculateFilteredTenders = (
  orders: DetailedOrder[],
  dateRange: string,
  employeeFilter: string,
  daypartFilter: string,
  orderTypeFilter: string
) => {
  const tenderMap: Record<string, { group: string; totalCount: number; totalAmount: number; networks?: { network: string; count: number; amount: number }[] }> = {};
  
  const defaultTenders = ['Credit', 'Debit', 'Cash', 'Gift Card', 'Mobile Wallet'];
  defaultTenders.forEach(t => {
    tenderMap[t] = {
      group: t,
      totalCount: 0,
      totalAmount: 0,
      networks: t === 'Credit' ? [
        { network: 'Visa', count: 0, amount: 0 },
        { network: 'Mastercard', count: 0, amount: 0 },
        { network: 'Amex', count: 0, amount: 0 },
        { network: 'Discover', count: 0, amount: 0 }
      ] : t === 'Debit' ? [
        { network: 'Interac', count: 0, amount: 0 }
      ] : undefined
    };
  });

  MOCK_TENDER_REPORT_DETAILED.forEach(group => {
    let m = getMultiplierForDateRange(dateRange);
    if (employeeFilter !== 'All') m *= 0.45;
    if (daypartFilter !== 'All') m *= 0.35;
    if (orderTypeFilter !== 'All') m *= 0.7;

    tenderMap[group.group] = {
      group: group.group,
      totalCount: Math.round(group.totalCount * m),
      totalAmount: group.totalAmount * m,
      networks: group.networks?.map(n => ({ ...n, count: Math.round(n.count * m), amount: n.amount * m }))
    };
  });

  orders.forEach(order => {
    const isPaid = order.status !== 'Void' && order.status !== 'Refunded' && order.status !== 'Open';
    if (!isPaid) return;

    let tenderKey = 'Credit';
    if (order.paymentMethod) {
      const pm = order.paymentMethod.toLowerCase();
      if (pm.includes('cash')) tenderKey = 'Cash';
      else if (pm.includes('gift')) tenderKey = 'Gift Card';
      else if (pm.includes('debit')) tenderKey = 'Debit';
      else if (pm.includes('mobile') || pm.includes('link') || pm.includes('apple') || pm.includes('google')) tenderKey = 'Mobile Wallet';
    }

    const amount = order.total || 0;

    if (tenderMap[tenderKey]) {
      tenderMap[tenderKey].totalCount += 1;
      tenderMap[tenderKey].totalAmount += amount;
      if (tenderMap[tenderKey].networks && tenderMap[tenderKey].networks.length > 0) {
        let networkIndex = 0;
        const paymentBrand = (order as any).paymentBrand;
        if (paymentBrand) {
          const brand = paymentBrand.toLowerCase();
          const idx = tenderMap[tenderKey].networks!.findIndex(n => n.network.toLowerCase() === brand);
          if (idx !== -1) networkIndex = idx;
        }
        tenderMap[tenderKey].networks![networkIndex].count += 1;
        tenderMap[tenderKey].networks![networkIndex].amount += amount;
      }
    } else {
      tenderMap[tenderKey] = {
        group: tenderKey,
        totalCount: 1,
        totalAmount: amount,
        networks: [{ network: 'Default', count: 1, amount }]
      };
    }
  });

  return Object.values(tenderMap);
};

import { useMemo } from 'react';
import { DetailedOrder, RevenueItem } from '../../../types';
import { MOCK_REVENUE_ITEMS } from '../../../constants';
import { getMultiplierForDateRange } from '../ReportFilters';

interface UseItemSalesDataParams {
  orders: DetailedOrder[];
  dateRange: string;
  categoryFilter: string;
  employeeFilter: string;
  locationFilter: string;
}

export const useItemSalesData = ({
  orders,
  dateRange,
  categoryFilter,
  employeeFilter,
  locationFilter,
}: UseItemSalesDataParams) => {
  const multiplier = useMemo(() => {
    let m = getMultiplierForDateRange(dateRange);
    if (employeeFilter !== 'All Employees') m *= 0.25;
    if (locationFilter !== 'All Locations') m *= 0.7;
    return m;
  }, [dateRange, employeeFilter, locationFilter]);

  const filteredItems = useMemo(() => {
    const itemMap: Record<string, RevenueItem> = {};

    MOCK_REVENUE_ITEMS.forEach(m => {
      const grossSales = m.grossSales * multiplier;
      const cogs = m.cogs * multiplier;
      const grossProfit = m.grossProfit * multiplier;
      const quantitySold = Math.round(m.quantitySold * multiplier);
      itemMap[m.name] = {
        id: m.id,
        name: m.name,
        category: m.category,
        grossSales,
        netSales: m.netSales ? m.netSales * multiplier : grossSales,
        cogs,
        grossProfit,
        quantitySold,
        quantityRefunded: m.quantityRefunded || 0,
        discounts: m.discounts || 0,
        refunds: m.refunds || 0,
        avgItemSize: quantitySold > 0 ? grossSales / quantitySold : m.avgItemSize || 0,
      };
    });

    orders.forEach(order => {
      const isValid = order.status !== 'Void' && order.status !== 'Refunded';
      if (!isValid) return;

      order.items?.forEach(item => {
        const name = item.name;
        const qty = item.quantity || 1;
        const price = item.price || 0;
        const gross = price * qty;
        const cost = price * 0.3;
        const profit = gross - cost * qty;

        let category = 'Main Course';
        const lower = name.toLowerCase();
        if (lower.includes('beer') || lower.includes('drink') || lower.includes('wine') || lower.includes('soda') || lower.includes('coke')) {
          category = 'Beverages';
        } else if (lower.includes('salad') || lower.includes('fries') || lower.includes('tacos') || lower.includes('calamari') || lower.includes('soup')) {
          category = 'Appetizers';
        } else if (lower.includes('cake') || lower.includes('dessert') || lower.includes('ice cream') || lower.includes('brownie')) {
          category = 'Desserts';
        }

        if (itemMap[name]) {
          itemMap[name].grossSales += gross;
          itemMap[name].netSales = (itemMap[name].netSales || 0) + gross;
          itemMap[name].quantitySold += qty;
          itemMap[name].cogs += cost * qty;
          itemMap[name].grossProfit += profit;
          itemMap[name].avgItemSize = itemMap[name].quantitySold > 0 ? itemMap[name].grossSales / itemMap[name].quantitySold : price;
        } else {
          itemMap[name] = {
            id: item.id || `I-DYN-${name}`,
            name,
            category,
            grossSales: gross,
            netSales: gross,
            cogs: cost * qty,
            grossProfit: profit,
            quantitySold: qty,
            quantityRefunded: 0,
            discounts: 0,
            refunds: 0,
            avgItemSize: price,
          };
        }
      });
    });

    return Object.values(itemMap || {}).filter(
      item => categoryFilter === 'All Categories' || item.category === categoryFilter
    );
  }, [orders, multiplier, categoryFilter]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, RevenueItem[]>);
  }, [filteredItems]);

  const totalGrossSales = filteredItems.reduce((acc, i) => acc + i.grossSales, 0);
  const totalCOGS = filteredItems.reduce((acc, i) => acc + i.cogs, 0);
  const totalGrossProfit = filteredItems.reduce((acc, i) => acc + i.grossProfit, 0);
  const margin = totalGrossSales > 0 ? (totalGrossProfit / totalGrossSales) * 100 : 0;

  const categoryChartData = useMemo(() => {
    return Object.keys(groupedItems || {}).map(category => {
      const catItems = groupedItems[category] || [];
      const grossSales = catItems.reduce((acc, i) => acc + i.grossSales, 0);
      const cogs = catItems.reduce((acc, i) => acc + i.cogs, 0);
      return {
        name: category,
        profit: grossSales - cogs,
        cogs: cogs,
      };
    }).sort((a, b) => b.profit - a.profit);
  }, [groupedItems]);

  const topItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => b.quantitySold - a.quantitySold).slice(0, 5);
  }, [filteredItems]);

  const topMarginItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aMargin = a.grossSales > 0 ? a.grossProfit / a.grossSales : 0;
      const bMargin = b.grossSales > 0 ? b.grossProfit / b.grossSales : 0;
      return bMargin - aMargin;
    }).slice(0, 5);
  }, [filteredItems]);

  return {
    filteredItems,
    groupedItems,
    totalGrossSales,
    totalCOGS,
    totalGrossProfit,
    margin,
    categoryChartData,
    topItems,
    topMarginItems,
  };
};

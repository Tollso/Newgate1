import { DetailedOrder } from '../../../types';
import { MOCK_HOURLY_BREAKDOWN } from '../../../constants';
import { getMultiplierForDateRange } from '../ReportFilters';

export const getDaypart = (hourStr: string) => {
  const parts = hourStr.split(' ');
  if (parts.length < 2) return 'Lunch';
  const [time, period] = parts;
  let hourValue = parseInt(time.split(':')[0]);
  if (period === 'PM' && hourValue !== 12) hourValue += 12;
  if (period === 'AM' && hourValue === 12) hourValue = 0;
  if (hourValue >= 6 && hourValue < 11) return 'Breakfast';
  if (hourValue >= 11 && hourValue < 16) return 'Lunch';
  if (hourValue >= 16 && hourValue < 21) return 'Dinner';
  return 'Late Night';
};

export const calculateFilteredHourlyData = (
  orders: DetailedOrder[],
  dateRange: string,
  employeeFilter: string,
  orderTypeFilter: string,
  daypartFilter: string,
  deviceFilter: string
) => {
  let multiplier = getMultiplierForDateRange(dateRange);
  if (employeeFilter !== 'All') multiplier *= 0.45;
  if (orderTypeFilter !== 'All') multiplier *= 0.7;
  if (deviceFilter !== 'All') multiplier *= 0.5;

  const realHourly: Record<string, { gross: number; net: number; refunds: number; tax: number; tips: number; collected: number }> = {};
  const paidOrders = orders.filter(o => o.status !== 'Open' && o.status !== 'Void');
  
  paidOrders.forEach(o => {
    let hourBucket = '12:00 PM';
    if (o.time) {
      const match = o.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        hourBucket = `${match[1]}:00 ${match[3].toUpperCase()}`;
      } else {
        const parts = o.time.split(':');
        if (parts.length >= 2) {
          const h = parseInt(parts[0]);
          if (!isNaN(h)) {
            if (h >= 12) {
              const displayH = h === 12 ? 12 : h - 12;
              hourBucket = `${displayH}:00 PM`;
            } else {
              const displayH = h === 0 ? 12 : h;
              hourBucket = `${displayH}:00 AM`;
            }
          }
        }
      }
    }
    if (!realHourly[hourBucket]) {
      realHourly[hourBucket] = { gross: 0, net: 0, refunds: 0, tax: 0, tips: 0, collected: 0 };
    }

    const gross = o.total || 0;
    const disc = o.discount || 0;
    const net = gross - disc;
    const tip = o.tip || 0;
    const tax = o.fees || (net * 0.0825);

    realHourly[hourBucket].gross += gross;
    realHourly[hourBucket].net += net;
    realHourly[hourBucket].tips += tip;
    realHourly[hourBucket].tax += tax;
    realHourly[hourBucket].collected += net + tip;
  });

  const OPERATING_HOURS = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
    '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '1:00 AM', '2:00 AM'
  ];

  let baseData = MOCK_HOURLY_BREAKDOWN && MOCK_HOURLY_BREAKDOWN.length > 0
    ? MOCK_HOURLY_BREAKDOWN
    : OPERATING_HOURS.map(h => ({
        hour: h,
        grossSales: 0,
        refunds: 0,
        netSales: 0,
        taxes: 0,
        tips: 0,
        amountCollected: 0
      }));

  if (daypartFilter !== 'All') {
    baseData = baseData.filter(h => getDaypart(h.hour) === daypartFilter);
  }

  return baseData.map(d => {
    const real = realHourly[d.hour] || { gross: 0, net: 0, refunds: 0, tax: 0, tips: 0, collected: 0 };
    return {
      ...d,
      grossSales: (d.grossSales * multiplier) + real.gross,
      refunds: (d.refunds * multiplier) + real.refunds,
      netSales: (d.netSales * multiplier) + real.net,
      taxes: (d.taxes * multiplier) + real.tax,
      tips: (d.tips * multiplier) + real.tips,
      amountCollected: (d.amountCollected * multiplier) + real.collected
    };
  });
};

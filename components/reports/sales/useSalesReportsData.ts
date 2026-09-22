import { useMemo } from 'react';
import { DetailedOrder } from '../../../types';
import { calculateFilteredHourlyData } from './salesHourlyHelpers';
import { calculateFilteredOrderTypes, calculateFilteredTenders } from './salesTenderAndTypeHelpers';
import { calculateDynamicMetrics, calculateCurrentSalesData } from './salesMetricsHelpers';

interface UseSalesReportsDataProps {
  orders: DetailedOrder[];
  dateRange: string;
  employeeFilter: string;
  orderTypeFilter: string;
  daypartFilter: string;
  deviceFilter: string;
}

export const useSalesReportsData = ({
  orders,
  dateRange,
  employeeFilter,
  orderTypeFilter,
  daypartFilter,
  deviceFilter,
}: UseSalesReportsDataProps) => {
  const filterHash = `${dateRange}-${employeeFilter}-${orderTypeFilter}-${daypartFilter}-${deviceFilter}`;

  const filteredHourlyData = useMemo(() => {
    return calculateFilteredHourlyData(
      orders,
      dateRange,
      employeeFilter,
      orderTypeFilter,
      daypartFilter,
      deviceFilter
    );
  }, [orders, filterHash, daypartFilter, employeeFilter, orderTypeFilter, deviceFilter, dateRange]);

  const filteredOrderTypesData = useMemo(() => {
    return calculateFilteredOrderTypes(
      orders,
      dateRange,
      employeeFilter,
      daypartFilter,
      deviceFilter
    );
  }, [orders, filterHash, dateRange, employeeFilter, daypartFilter, deviceFilter]);

  const filteredTenderTypesData = useMemo(() => {
    return calculateFilteredTenders(
      orders,
      dateRange,
      employeeFilter,
      daypartFilter,
      orderTypeFilter
    );
  }, [orders, filterHash, dateRange, employeeFilter, daypartFilter, orderTypeFilter]);

  const dynamicMetrics = useMemo(() => {
    return calculateDynamicMetrics(
      orders,
      dateRange,
      orderTypeFilter,
      employeeFilter,
      daypartFilter,
      deviceFilter
    );
  }, [orders, filterHash, dateRange, orderTypeFilter, employeeFilter, daypartFilter, deviceFilter]);

  const currentSalesData = useMemo(() => {
    return calculateCurrentSalesData(
      orders,
      employeeFilter,
      orderTypeFilter,
      daypartFilter,
      deviceFilter
    );
  }, [orders, dateRange, filterHash, employeeFilter, orderTypeFilter, daypartFilter, deviceFilter]);

  return {
    filteredHourlyData,
    filteredOrderTypesData,
    filteredTenderTypesData,
    dynamicMetrics,
    currentSalesData,
  };
};

export interface TipPoolingReportTabProps {
  onNavigateToPolicy?: () => void;
}

export interface PayrollDay {
  id: string;
  date: string;
  employees: number;
  total: number;
  status: string;
  sentDate?: string;
}

export interface ShiftEmployee {
  id: string;
  name: string;
  job: string;
  hours: number;
  before: number;
  after: number;
}

export interface EmployeeContributionItem {
  category: string;
  sales: number;
  rate: number;
  amount: number;
}

export interface EmployeeDetail {
  name: string;
  job: string;
  collected: {
    cash: number;
    nonCash: number;
    total: number;
    cashGrat: number;
    nonCashGrat: number;
    totalGrat: number;
  };
  sales: {
    liquor: number;
    food: number;
    total: number;
  };
  contributions: {
    total: number;
    breakdown: EmployeeContributionItem[];
  };
  earnings: {
    cash: number;
    nonCash: number;
    cashGrat: number;
    nonCashGrat: number;
    total: number;
  };
}

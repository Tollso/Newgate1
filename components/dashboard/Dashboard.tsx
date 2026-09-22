import React, { useState } from 'react';
import { Clock, Info } from 'lucide-react';
import { HourlySales, SalesSummary, Employee } from '../../types';
import { DashboardQuickActions } from './DashboardQuickActions';
import { DashboardKpiCards } from './DashboardKpiCards';
import { DashboardDataPanels } from './DashboardDataPanels';
import { DashboardModals } from './DashboardModals';

interface DashboardProps {
  hourlySales?: HourlySales[];
  salesSummary?: SalesSummary[];
  onNavigate?: (tab: string) => void;
  currentUser?: Employee;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  hourlySales = [], 
  salesSummary = [], 
  onNavigate, 
  currentUser 
}) => {
  const userName = currentUser?.name || 'Seckin';

  // Modal States
  const [showInstantDepositModal, setShowInstantDepositModal] = useState(false);
  const [showTimeFilterModal, setShowTimeFilterModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showCapitalModal, setShowCapitalModal] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Today vs. Yesterday');
  const [depositSuccess, setDepositSuccess] = useState(false);

  // Pagination / Carousel States
  const [awardSlide, setAwardSlide] = useState(0);
  const [itemPage, setItemPage] = useState(0);
  const [breakdownPage, setBreakdownPage] = useState(0);
  const [capitalSlide, setCapitalSlide] = useState(0);

  // Data
  const netSalesValue = 5384.77;
  const netSalesTrendPct = "+43%";
  const laborCostPct = 7.33;
  const laborCostTrendPct = "-26%";
  const discountsValue = 55.58;
  const discountsTrendPct = "No significant change";
  const instantDepositAmount = 1017.81;

  // Carousel Data
  const awardsSlides = [
    {
      title: "Vote for your best restaurant on tablehere.com",
      desc: "We received thousands of nominations from restaurants in the U.S. and the U.K. — last chance for you to vote. Voting is open through August 3.",
      btnText: "Vote now",
      action: () => setShowVoteModal(true)
    },
    {
      title: "Summer Menu Optimization Guide",
      desc: "Discover how top dining venues boost high-margin drink sales by 18% during peak patio season using dynamic POS combo recommendations.",
      btnText: "Read guide",
      action: () => onNavigate?.('Item Library')
    },
    {
      title: "New Automated Labor Sync Feature",
      desc: "Connect your shift schedules directly to kitchen throughput metrics. Reduce overtime costs and balance prep station loads effortlessly.",
      btnText: "View settings",
      action: () => onNavigate?.('Schedule')
    }
  ];

  const itemSalesPages = [
    [
      { name: 'Mix Kebab', price: '$351.65' },
      { name: 'Shish Kebab', price: '$315.35' },
      { name: 'Beyti Sarma', price: '$215.60' },
      { name: 'Cafe De Paris', price: '$203.60' },
    ],
    [
      { name: 'Adana Kebab', price: '$195.40' },
      { name: 'Mezze Plate', price: '$180.50' },
      { name: 'Lumi Special Kebab', price: '$165.60' },
      { name: 'Truffle Fries', price: '$140.20' },
    ]
  ];

  const breakdownPages = [
    [
      { time: '11:00 AM', sales: '$450.20', laborCost: '$32.99', laborPct: '7.3%' },
      { time: '12:00 PM', sales: '$1,250.50', laborCost: '$91.66', laborPct: '7.3%' },
      { time: '1:00 PM', sales: '$980.75', laborCost: '$71.88', laborPct: '7.3%' },
      { time: '2:00 PM', sales: '$650.00', laborCost: '$47.64', laborPct: '7.3%' },
    ],
    [
      { time: '6:00 PM', sales: '$890.30', laborCost: '$65.25', laborPct: '7.3%' },
      { time: '7:00 PM', sales: '$1,650.80', laborCost: '$120.94', laborPct: '7.3%' },
      { time: '8:00 PM', sales: '$1,420.45', laborCost: '$104.11', laborPct: '7.3%' },
    ]
  ];

  const capitalSlides = [
    {
      title: "Eligible for $25k",
      desc: "Access fast, flexible funding to grow your restaurant. Pre-approved offers based directly on your The Newgate Pos sales volume.",
      badge: "NEWGATE CAPITAL"
    },
    {
      title: "Same-Day Card Deposit*",
      desc: "Eliminate bank delays and unlock immediate cash flow for inventory & payroll.",
      badge: "INSTANT PAYOUTS"
    },
    {
      title: "Equipment Financing Plan",
      desc: "Upgrade kitchen hardware & POS terminals with 0% introductory APR financing.",
      badge: "EQUIPMENT LEASING"
    }
  ];

  const handleInstantDeposit = () => {
    setDepositSuccess(true);
    setTimeout(() => {
      setDepositSuccess(false);
      setShowInstantDepositModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f2f3f5] text-slate-800 p-4 md:p-8 animate-fade-in font-sans">
      
      {/* Top Welcome & Time Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {userName}!
          </h1>
          <p className="text-indigo-600 font-extrabold text-xs uppercase tracking-widest mt-0.5">
            The Newgate Pos Live Analytics & Reporting
          </p>
          <p className="text-slate-500 font-bold text-sm mt-1 flex items-center gap-2">
            <span>{timeFilter}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live System
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-xs">
            <span>Data up to 9:48 PM</span>
            <Info size={14} className="text-slate-400 cursor-help" />
          </div>
          <button 
            onClick={() => setShowTimeFilterModal(true)}
            className="flex items-center gap-2 text-xs font-extrabold text-indigo-700 bg-white hover:bg-indigo-50/50 border border-slate-200/80 px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Clock size={15} className="text-indigo-600" />
            Edit time filter
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <DashboardQuickActions 
          onNavigate={onNavigate}
          onShowInstantDepositModal={() => setShowInstantDepositModal(true)}
        />
        <DashboardKpiCards
          netSalesValue={netSalesValue}
          netSalesTrendPct={netSalesTrendPct}
          laborCostPct={laborCostPct}
          laborCostTrendPct={laborCostTrendPct}
          discountsValue={discountsValue}
          discountsTrendPct={discountsTrendPct}
          instantDepositAmount={instantDepositAmount}
          awardsSlides={awardsSlides}
          awardSlide={awardSlide}
          setAwardSlide={setAwardSlide}
          onNavigate={onNavigate}
          onShowInstantDepositModal={() => setShowInstantDepositModal(true)}
        />
      </div>

      {/* Bottom Data Panels */}
      <DashboardDataPanels
        itemSalesPages={itemSalesPages}
        itemPage={itemPage}
        setItemPage={setItemPage}
        breakdownPages={breakdownPages}
        breakdownPage={breakdownPage}
        setBreakdownPage={setBreakdownPage}
        capitalSlides={capitalSlides}
        capitalSlide={capitalSlide}
        setCapitalSlide={setCapitalSlide}
        onNavigate={onNavigate}
        onShowCapitalModal={() => setShowCapitalModal(true)}
      />

      {/* Modals */}
      <DashboardModals
        showInstantDepositModal={showInstantDepositModal}
        setShowInstantDepositModal={setShowInstantDepositModal}
        depositSuccess={depositSuccess}
        instantDepositAmount={instantDepositAmount}
        handleInstantDeposit={handleInstantDeposit}
        showTimeFilterModal={showTimeFilterModal}
        setShowTimeFilterModal={setShowTimeFilterModal}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        showVoteModal={showVoteModal}
        setShowVoteModal={setShowVoteModal}
        showCapitalModal={showCapitalModal}
        setShowCapitalModal={setShowCapitalModal}
      />

    </div>
  );
};

export default Dashboard;

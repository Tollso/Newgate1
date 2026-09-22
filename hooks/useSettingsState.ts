import React, { useState, useEffect } from 'react';
import { GlobalTaxConfig, TipConfig, KioskConfig, AuditLog } from '../types';
import { AuditService } from '../services/auditService';

export const useSettingsState = (
  removalReasons: string[] = [],
  setRemovalReasons?: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const [activeSection, setActiveSection] = useState<string>('Overview');
  const [subSection, setSubSection] = useState<string | null>(null);

  const [localRemovalReasons, setLocalRemovalReasons] = useState<string[]>(
    removalReasons.length > 0 ? removalReasons : [
      'Customer Changed Mind',
      'Quality Issue / Cold Food',
      'Incorrect Order Entry',
      'Accidental Duplicate',
      'System Test / Demo'
    ]
  );
  const [newReason, setNewReason] = useState('');

  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyActionFilter, setHistoryActionFilter] = useState('All');
  const [historyEmployeeFilter, setHistoryEmployeeFilter] = useState('All');
  const [historyDateRange, setHistoryDateRange] = useState('All time');

  const [diningSections, setDiningSections] = useState(['Main Dining', 'Patio', 'Bar', 'VIP Lounge']);

  const [businessHours, setBusinessHours] = useState([
    { day: 'Monday', open: '09:00', close: '22:00', closed: false },
    { day: 'Tuesday', open: '09:00', close: '22:00', closed: false },
    { day: 'Wednesday', open: '09:00', close: '22:00', closed: false },
    { day: 'Thursday', open: '09:00', close: '22:00', closed: false },
    { day: 'Friday', open: '09:00', close: '23:00', closed: false },
    { day: 'Saturday', open: '10:00', close: '23:00', closed: false },
    { day: 'Sunday', open: '10:00', close: '21:00', closed: false },
  ]);

  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    emailReceipts: true,
    dailySummary: true,
    inventoryAlerts: true,
    securityAlerts: true,
  });

  const [onlineStoreSettings, setOnlineStoreSettings] = useState({
    onlineOrderingType: 'Branded website',
    expandedSection: 'Homepage',
    welcomeMessage: 'Welcome to Lumi Restaurant & Bar! Fresh ingredients, authentic taste.',
    actionButtonText: 'Order online',
    actionButtonDestination: 'Order Online',
    facebookProfile: 'facebook.com/lumirestaurant',
    instagramProfile: '@lumirestaurant',
    domainName: 'lumirestaurant',
    itemTileTemplate: 'Grid',
    featuredCategory: 'Popular Items',
    aboutUsText: 'Lumi was founded with a passion for bringing modern culinary excellence...'
  });

  const [checkoutSettings, setCheckoutSettings] = useState({
    businessName: 'Lumi Restaurant & Bar',
    webhookUrl: 'https://api.lumirestaurant.com/v1/webhooks/pos',
  });

  const [fraudSettings, setFraudSettings] = useState({
    avsLevel: 'strict',
    cvvCheck: true,
  });

  const [paymentLinks, setPaymentLinks] = useState([
    { id: '1', name: 'Private Event Deposit ($250)', amount: 250, active: true },
    { id: '2', name: 'Catering Advance ($500)', amount: 500, active: true },
  ]);

  const [passcodeSettings, setPasscodeSettings] = useState({
    passcodeLength: 4,
    requireAlpha: false,
    expirationDays: 90,
  });
  const [tempPasscodeSettings, setTempPasscodeSettings] = useState({ ...passcodeSettings });

  const handleAddReason = () => {
    if (newReason.trim()) {
      const updated = [...localRemovalReasons, newReason.trim()];
      setLocalRemovalReasons(updated);
      if (setRemovalReasons) setRemovalReasons(updated);
      setNewReason('');
    }
  };

  const handleDeleteReason = (reasonToDelete: string) => {
    const updated = localRemovalReasons.filter(r => r !== reasonToDelete);
    setLocalRemovalReasons(updated);
    if (setRemovalReasons) setRemovalReasons(updated);
  };

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    let isMounted = true;
    AuditService.getAuditLogsForUI().then(logs => {
      if (isMounted) setAuditLogs(logs);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = historySearchQuery === '' || 
      log.details.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(historySearchQuery.toLowerCase());

    const matchesAction = historyActionFilter === 'All' || log.action === historyActionFilter;
    const matchesUser = historyEmployeeFilter === 'All' || log.user === historyEmployeeFilter;

    return matchesSearch && matchesAction && matchesUser;
  });

  return {
    activeSection,
    setActiveSection,
    subSection,
    setSubSection,
    localRemovalReasons,
    newReason,
    setNewReason,
    handleAddReason,
    handleDeleteReason,
    historySearchQuery,
    setHistorySearchQuery,
    historyActionFilter,
    setHistoryActionFilter,
    historyEmployeeFilter,
    setHistoryEmployeeFilter,
    historyDateRange,
    setHistoryDateRange,
    diningSections,
    setDiningSections,
    businessHours,
    setBusinessHours,
    notifications,
    setNotifications,
    onlineStoreSettings,
    setOnlineStoreSettings,
    checkoutSettings,
    setCheckoutSettings,
    fraudSettings,
    setFraudSettings,
    paymentLinks,
    setPaymentLinks,
    passcodeSettings,
    setPasscodeSettings,
    tempPasscodeSettings,
    setTempPasscodeSettings,
    filteredAuditLogs
  };
};

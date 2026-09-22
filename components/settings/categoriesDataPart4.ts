import { SettingCategory } from './categoriesData';

export const SETTINGS_CATEGORIES_PART4: SettingCategory[] = [
  {
    id: 'online_ecommerce',
    num: 13,
    title: 'Online Ordering & Ecommerce',
    iconName: 'Globe',
    description: 'Online storefront branding, pickup & delivery zones, capacity throttling, and channel sync.',
    pages: [
      { id: 'online_storefront', name: 'Online Storefront', optionsInside: ['Branding', 'Domain', 'Menu visibility', 'Contact info'], description: 'Web ordering portal theme.' },
      { id: 'ordering_channels', name: 'Ordering Channels', optionsInside: ['Website', 'QR ordering', 'Kiosk', 'Connected marketplaces'], description: 'DoorDash, UberEats, QR table ordering.' },
      { id: 'pickup_config', name: 'Pickup Configuration', optionsInside: ['Hours', 'Preparation time (20 mins)', 'Instructions', 'Order limits'], description: 'Curbside & counter pickup rules.' },
      { id: 'delivery_config', name: 'Delivery Configuration', optionsInside: ['Zones', 'Fees', 'Minimum order', 'Availability', 'Instructions'], description: 'In-house delivery radii.' },
      { id: 'order_scheduling', name: 'Order Scheduling', optionsInside: ['Advance-order horizon', 'Cutoff', 'Available slots'], description: 'Pre-order scheduling windows.' },
      { id: 'capacity_controls', name: 'Capacity Controls', optionsInside: ['Orders per slot', 'Lead-time adjustments', 'Temporary pause'], description: 'Kitchen throttling when busy.' },
      { id: 'order_acceptance', name: 'Order Acceptance', optionsInside: ['Automatic/manual acceptance', 'Timeout behavior'], description: 'Auto-confirm incoming web orders.' },
      { id: 'online_checkout', name: 'Online Checkout', optionsInside: ['Supported payments', 'Required fields', 'Guest/account checkout'], description: 'Online guest checkout options.' },
      { id: 'hosted_checkout', name: 'Hosted Checkout', optionsInside: ['Branding', 'Approved return destinations', 'Confirmation page'], description: 'Stripe hosted payment pages.' },
      { id: 'payment_links', name: 'Payment Links', optionsInside: ['Templates', 'Expiration', 'Fixed/custom amounts'], description: 'SMS/Email payment link generation.' },
      { id: 'custom_checkout_fields', name: 'Custom Checkout Fields', optionsInside: ['Field type', 'Required status', 'Permitted use'], description: 'Dietary & delivery instruction notes.' },
      { id: 'customer_messages', name: 'Customer Messages', optionsInside: ['Confirmation', 'Status changes', 'Pickup/delivery instructions'], description: 'Order status SMS updates.' },
      { id: 'channel_sync', name: 'Channel Synchronization', optionsInside: ['Menu', 'Price', 'Availability', 'Order sync status'], description: 'POS to DoorDash menu sync.' }
    ]
  },
  {
    id: 'customers_loyalty',
    num: 14,
    title: 'Customers, Loyalty & Gift Cards',
    iconName: 'HeartHandshake',
    description: 'Profiles, privacy consent, loyalty points earning & rewards, gift cards, and house accounts.',
    pages: [
      { id: 'customer_profiles', name: 'Customer Profiles', optionsInside: ['Required fields', 'Duplicate detection', 'Tags'], description: 'CRM customer records.' },
      { id: 'privacy_consent', name: 'Privacy & Consent', optionsInside: ['Operational/marketing preferences', 'Consent records'], description: 'GDPR / CCPA consent.' },
      { id: 'customer_data_controls', name: 'Customer Data Controls', optionsInside: ['Export permissions', 'Retention', 'Deletion-request workflow'], description: 'Right-to-be-forgotten requests.' },
      { id: 'loyalty_earning', name: 'Loyalty Earning', optionsInside: ['Points basis ($1 = 1 pt)', 'Eligible purchases', 'Exclusions'], description: 'Point accumulation rules.' },
      { id: 'loyalty_rewards', name: 'Loyalty Rewards', optionsInside: ['Redemption thresholds (100 pts = $10)', 'Reward types', 'Expiry rules'], description: 'Reward vouchers and discounts.' },
      { id: 'gift_cards', name: 'Gift Cards', optionsInside: ['Physical/digital availability', 'Denominations', 'Sale limits'], description: 'Physical e-gift card issuance.' },
      { id: 'gift_card_controls', name: 'Gift Card Controls', optionsInside: ['Reload', 'Redemption', 'Adjustment', 'Deactivation rules'], description: 'Card balances and reloading.' },
      { id: 'house_accounts', name: 'House Accounts', optionsInside: ['Eligibility', 'Credit limits', 'Billing terms'], description: 'Corporate charge accounts.' },
      { id: 'customer_credits', name: 'Customer Credits', optionsInside: ['Issuance reasons', 'Approval limits', 'Balance reporting'], description: 'Store credit balances.' },
      { id: 'feedback', name: 'Feedback & Ratings', optionsInside: ['Survey templates', 'Timing', 'Recipients', 'Escalation'], description: 'Post-meal SMS feedback surveys.' },
      { id: 'marketing_prefs', name: 'Marketing Preferences', optionsInside: ['Audience rules', 'Approved channels', 'Unsubscribe handling'], description: 'Email/SMS campaign opt-outs.' }
    ]
  },
  {
    id: 'inventory_purchasing',
    num: 15,
    title: 'Inventory & Purchasing',
    iconName: 'Package',
    description: 'Stock tracking, unit conversions, recipe depletion, purchase orders, waste logs, and suppliers.',
    pages: [
      { id: 'stock_tracking', name: 'Stock Tracking', optionsInside: ['Tracked items', 'Ingredients', 'Storage areas'], description: 'Raw ingredient & item inventory.' },
      { id: 'units_conversions', name: 'Units & Conversions', optionsInside: ['Purchase', 'Storage', 'Recipe units (Case -> Oz)'], description: 'Unit conversion matrices.' },
      { id: 'recipe_deduction', name: 'Recipe Deduction', optionsInside: ['Ingredient quantities', 'Yields', 'Substitutions'], description: 'Automatic inventory depletion on sale.' },
      { id: 'stock_alerts', name: 'Stock Alerts', optionsInside: ['Minimum levels', 'Reorder points', 'Recipients'], description: 'Low stock notifications.' },
      { id: 'inventory_counts', name: 'Inventory Counts', optionsInside: ['Count schedules', 'Blind counts', 'Variance review'], description: 'Cycle counts and physical audits.' },
      { id: 'waste_tracking', name: 'Waste Tracking', optionsInside: ['Reason codes', 'Approval thresholds', 'Cost tracking'], description: 'Spoilage & spill log accounting.' },
      { id: 'transfers', name: 'Location Transfers', optionsInside: ['Authorized locations', 'Dispatch/receipt confirmation'], description: 'Inter-store inventory moves.' },
      { id: 'suppliers', name: 'Suppliers & Vendors', optionsInside: ['Vendor details', 'Purchase units', 'Lead times'], description: 'Vendor contact directory.' },
      { id: 'purchase_orders', name: 'Purchase Orders', optionsInside: ['Numbering', 'Approval limits', 'Receiving rules'], description: 'PO creation and receiving.' },
      { id: 'inventory_costing', name: 'Costing & Margins', optionsInside: ['Costing method (FIFO/Average)', 'Recipe costs', 'Margin visibility'], description: 'COGS calculations.' },
      { id: 'availability_sync', name: 'Availability Sync', optionsInside: ['Rules connecting stock to item availability (86-ing)'], description: 'Auto-86 item when stock hits 0.' }
    ]
  },
  {
    id: 'invoices_catering',
    num: 16,
    title: 'Invoices, Estimates & Catering',
    iconName: 'FileText',
    description: 'B2B billing templates, estimates, catering packages, event scheduling, and cancellation rules.',
    pages: [
      { id: 'document_templates', name: 'Document Templates', optionsInside: ['Branding', 'Numbering', 'Required fields'], description: 'Custom invoice layout branding.' },
      { id: 'estimates', name: 'Estimates & Quotes', optionsInside: ['Validity period', 'Approval/signature', 'Conversion to invoice'], description: 'Catering price quotes.' },
      { id: 'invoice_terms', name: 'Invoice Terms', optionsInside: ['Due dates (Net 30)', 'Payment methods', 'Reminders'], description: 'Payment due terms.' },
      { id: 'catering_deposits', name: 'Deposits & Schedules', optionsInside: ['Amount/percentage', 'Schedule', 'Balance due'], description: 'Milestone event deposit collection.' },
      { id: 'catering_events', name: 'Catering Events', optionsInside: ['Event types', 'Required details', 'Resource availability'], description: 'Event calendar scheduling.' },
      { id: 'catering_packages', name: 'Catering Packages', optionsInside: ['Menus', 'Minimum spend', 'Staffing or equipment charges'], description: 'Bundled banquet packages.' },
      { id: 'cancellation_policies', name: 'Cancellation Policies', optionsInside: ['Policy text', 'Deadlines', 'Approval handling'], description: 'Event cancellation terms.' },
      { id: 'internal_routing', name: 'Internal Routing', optionsInside: ['Kitchen', 'Event manager', 'Finance notifications'], description: 'BFO banquet order dispatch.' },
      { id: 'document_corrections', name: 'Document Corrections', optionsInside: ['Credit notes', 'Cancellation reasons', 'Audit history'], description: 'Credit memos and corrections.' }
    ]
  },
  {
    id: 'reports_accounting',
    num: 17,
    title: 'Reports, Accounting & Notifications',
    iconName: 'BarChart3',
    description: 'Report defaults, QuickBooks/Xero mappings, scheduled email reports, and operational alerts.',
    pages: [
      { id: 'report_defaults', name: 'Report Defaults', optionsInside: ['Business day', 'Date ranges', 'Location', 'Revenue center'], description: 'Global analytics view defaults.' },
      { id: 'metric_definitions', name: 'Metric Definitions', optionsInside: ['Gross/net sales', 'Discounts', 'Refunds', 'Taxes', 'Charges'], description: 'Formula audit definitions.' },
      { id: 'dashboard_layout', name: 'Dashboard Layout', optionsInside: ['Widgets', 'Permitted metrics', 'Saved views'], description: 'Executive dashboard arrangement.' },
      { id: 'scheduled_reports', name: 'Scheduled Reports', optionsInside: ['Report', 'Filters', 'Frequency', 'Authorized recipients'], description: 'Automated nightly PDF emails.' },
      { id: 'report_exports', name: 'Report Exports', optionsInside: ['Formats (CSV/Excel/PDF)', 'Columns', 'Permitted data'], description: 'Export permissions.' },
      { id: 'accounting_connection', name: 'Accounting Connection', optionsInside: ['Provider (QuickBooks / Xero)', 'Sync schedule', 'Status'], description: 'General ledger sync connection.' },
      { id: 'account_mapping', name: 'Account Mapping', optionsInside: ['Sales', 'Tax', 'Tips', 'Fees', 'Tenders', 'Refunds', 'Clearing'], description: 'Chart of Accounts GL mapping.' },
      { id: 'reconciliation', name: 'Reconciliation', optionsInside: ['Missing matches', 'Sync errors', 'Duplicate prevention'], description: 'GL sync variance audit.' },
      { id: 'operational_alerts', name: 'Operational Alerts', optionsInside: ['Printer offline', 'Stale orders', 'Sold-out items', 'Cash exceptions'], description: 'Real-time store alerts.' },
      { id: 'financial_alerts', name: 'Financial Alerts', optionsInside: ['Refunds', 'Unusual discounts', 'Settlement failures'], description: 'Loss prevention threshold alerts.' },
      { id: 'employee_alerts', name: 'Employee Alerts', optionsInside: ['Schedule', 'Attendance', 'Timecard requests'], description: 'Labor exception alerts.' },
      { id: 'notification_routing', name: 'Notification Routing', optionsInside: ['Recipient roles', 'Channels', 'Quiet hours', 'Escalation'], description: 'Alert dispatch recipient rules.' }
    ]
  },
  {
    id: 'devices_connectivity',
    num: 18,
    title: 'Devices, Connectivity & Display',
    iconName: 'MonitorSmartphone',
    description: 'Terminal directory, device profiles (Bar/Kitchen/Counter), Wi-Fi, offline mode, and diagnostics.',
    pages: [
      { id: 'device_directory', name: 'Device Directory', optionsInside: ['Name', 'Location', 'Status', 'Software version', 'Last sync'], description: 'Active POS register roster.' },
      { id: 'device_profiles', name: 'Device Profiles', optionsInside: ['Bar', 'Counter', 'Handheld', 'Kiosk', 'Kitchen'], description: 'Reusable register configuration templates.' },
      { id: 'device_assignments', name: 'Device Assignments', optionsInside: ['Default service area', 'Menu', 'Printer', 'Cash drawer'], description: 'Per-hardware mapping defaults.' },
      { id: 'display_settings', name: 'Display Settings', optionsInside: ['Theme', 'Text size', 'Accessibility', 'Orientation'], description: 'Touchscreen scaling and theme.' },
      { id: 'device_security', name: 'Device Security', optionsInside: ['Auto-lock (60s)', 'Allowed modes', 'Employee switching'], description: 'Terminal inactivity timeout.' },
      { id: 'connectivity', name: 'Connectivity & Network', optionsInside: ['Wi-Fi/Ethernet status', 'Approved network configuration'], description: 'Network health status.' },
      { id: 'cellular', name: 'Cellular Failover', optionsInside: ['Data plan', 'Usage', 'Failover status'], description: '4G/5G backup SIM setup.' },
      { id: 'enterprise_wifi', name: 'Enterprise Wi-Fi', optionsInside: ['Certificates', 'Enrollment', 'Expiry alerts'], description: '802.1X enterprise security.' },
      { id: 'updates', name: 'Software Updates', optionsInside: ['Update status', 'Approved maintenance windows'], description: 'Over-the-air firmware updates.' },
      { id: 'offline_operation', name: 'Offline Operation', optionsInside: ['Available offline functions', 'Sync status', 'Conflicts'], description: 'Store-and-forward status.' },
      { id: 'diagnostics', name: 'Diagnostics', optionsInside: ['Printer test', 'Reader test', 'Connectivity checks'], description: 'Hardware ping and test utility.' },
      { id: 'device_removal', name: 'Device Removal', optionsInside: ['Revoke access', 'Safely unpair supported hardware'], description: 'De-authorize stolen or retired terminals.' }
    ]
  },
  {
    id: 'banking_billing',
    num: 19,
    title: 'Banking, Billing & Statements',
    iconName: 'Landmark',
    description: 'Linked bank account, payout schedules, subscription plans, official 1099-K tax documents, and statements.',
    pages: [
      { id: 'bank_accounts', name: 'Bank Accounts', optionsInside: ['Masked linked account', 'Verification status', 'Change flow'], description: 'Deposit payout destination account.' },
      { id: 'deposit_schedule', name: 'Deposit Schedule', optionsInside: ['Standard payout schedule (Daily / Weekly)'], description: 'Merchant settlement cadence.' },
      { id: 'instant_deposits', name: 'Instant / Rapid Deposits', optionsInside: ['Availability', 'Provider fees (1.5%)', 'Limits', 'Initiation'], description: '30-minute debit card payouts.' },
      { id: 'deposit_history', name: 'Deposit History', optionsInside: ['Payout amounts', 'Status', 'Settlement references'], description: 'Historical ACH bank deposits.' },
      { id: 'subscription_plan', name: 'Subscription Plan', optionsInside: ['Current plan', 'Included features', 'Limits'], description: 'BytePOS software tier.' },
      { id: 'subscription_addons', name: 'Add-ons & Modules', optionsInside: ['Enabled modules', 'Prices', 'Renewal terms'], description: 'KDS, Online Ordering, Marketing modules.' },
      { id: 'billing_method', name: 'Billing Method', optionsInside: ['Subscription payment method', 'Billing address'], description: 'Software billing payment card.' },
      { id: 'statements_invoices', name: 'Statements & Invoices', optionsInside: ['Download provider statements and invoices'], description: 'Monthly processing fee statements.' },
      { id: 'tax_documents', name: 'Tax Documents (1099-K)', optionsInside: ['Provider-issued 1099-K tax forms'], description: 'Official IRS processor tax filings.' },
      { id: 'billing_contacts', name: 'Billing Contacts', optionsInside: ['Authorized contacts', 'Notification recipients'], description: 'Invoice email recipients.' }
    ]
  },
  {
    id: 'integrations_admin',
    num: 20,
    title: 'Integrations, Data & System Administration',
    iconName: 'ShieldAlert',
    description: 'App Market connections, API credentials, Webhooks, Data CSV imports/exports, audit logs, and configuration rollback.',
    pages: [
      { id: 'connected_apps', name: 'Connected Applications', optionsInside: ['Installed integrations', 'Status', 'Permissions'], description: 'DoorDash, 7shifts, QuickBooks apps.' },
      { id: 'api_credentials', name: 'API Credentials', optionsInside: ['Create', 'Restrict', 'Rotate', 'Revoke API keys'], description: 'OAuth & Secret keys.' },
      { id: 'webhooks', name: 'Webhooks', optionsInside: ['Event subscriptions', 'Endpoint verification', 'Delivery history'], description: 'Real-time JSON event listeners.' },
      { id: 'integration_envs', name: 'Integration Environments', optionsInside: ['Separate test (sandbox) and live configuration'], description: 'Sandbox testing keys.' },
      { id: 'data_imports', name: 'Data Imports', optionsInside: ['Employees', 'Menus', 'Customers', 'Inventory CSV import'], description: 'Bulk CSV setup wizards.' },
      { id: 'data_exports', name: 'Data Exports', optionsInside: ['Authorized datasets', 'Formats', 'Export history'], description: 'Full account data backup.' },
      { id: 'custom_fields', name: 'Custom Fields', optionsInside: ['Field definitions', 'Visibility', 'Validation'], description: 'Order & item custom metadata.' },
      { id: 'config_history', name: 'Configuration History', optionsInside: ['Who changed what', 'Previous value', 'New value', 'Reason'], description: 'Full settings edit audit log.' },
      { id: 'drafts_publishing', name: 'Drafts & Publishing', optionsInside: ['Save drafts', 'Review changes', 'Publish', 'Schedule'], description: 'Stage setting changes safely.' },
      { id: 'config_rollback', name: 'Configuration Rollback', optionsInside: ['Restore prior settings without rewriting transactions'], description: 'One-click emergency undo.' },
      { id: 'location_templates', name: 'Location Templates', optionsInside: ['Shared defaults', 'Locks', 'Local overrides'], description: 'Franchise master configuration.' },
      { id: 'data_recovery', name: 'Data Recovery', optionsInside: ['Backup status', 'Recovery procedures', 'Controlled restore'], description: 'Cloud backup snapshot restore.' },
      { id: 'audit_logs', name: 'Audit Logs', optionsInside: ['Employee actions', 'Approvals', 'Access changes', 'Activity'], description: 'System-wide activity logs.' },
      { id: 'support_access', name: 'Support Access', optionsInside: ['Time-limited support access', 'Scope', 'Revocation'], description: 'Grant BytePOS agent access.' },
      { id: 'account_lifecycle', name: 'Account Lifecycle', optionsInside: ['Ownership transfer', 'Location deactivation', 'Account closure'], description: 'Account transfer or closing.' }
    ]
  }
];

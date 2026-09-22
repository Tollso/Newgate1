import { SettingCategory } from './categoriesData';

export const SETTINGS_CATEGORIES_PART3: SettingCategory[] = [
  {
    id: 'payments_fraud',
    num: 9,
    title: 'Payments, Refunds & Fraud Controls',
    iconName: 'CreditCard',
    description: 'Payment processors, card readers, preauthorization, offline payments, refund limits, and chargebacks.',
    pages: [
      { id: 'payment_provider', name: 'Payment Provider', optionsInside: ['Connected provider', 'Merchant account', 'Supported features', 'Connection status'], description: 'Stripe/Square/Clover processor link.' },
      { id: 'accepted_tenders', name: 'Accepted Tenders', optionsInside: ['Cash', 'Card', 'Gift card', 'House account', 'Approved custom tenders'], description: 'Payment method toggles.' },
      { id: 'checkout_flow', name: 'Checkout Flow', optionsInside: ['Tender order', 'Split payments', 'Receipt prompt', 'Guest-facing display'], description: 'Customer checkout sequence.' },
      { id: 'card_readers', name: 'Card Readers', optionsInside: ['Pairing', 'Terminal assignment', 'Supported payment capabilities'], description: 'Bluetooth & Ethernet card reader setup.' },
      { id: 'manual_card_entry', name: 'Manual Card Entry', optionsInside: ['Enable through supported provider', 'Access requirements'], description: 'Keyed-in card permissions.' },
      { id: 'preauthorization', name: 'Preauthorization', optionsInside: ['Supported tab authorization', 'Incremental authorization', 'Release handling'], description: 'Bar tab hold authorization limits.' },
      { id: 'offline_payments', name: 'Offline Payments', optionsInside: ['Enablement', 'Limits', 'Queue status', 'Failure alerts'], description: 'Offline store-and-forward transactions.' },
      { id: 'refund_policy', name: 'Refund Policy', optionsInside: ['Partial/full refunds', 'Age limits', 'Reasons', 'Approvals'], description: 'Refund approval thresholds.' },
      { id: 'refund_exceptions', name: 'Refund Exceptions', optionsInside: ['Unlinked/alternative-tender support'], description: 'Non-matching payment card refund rules.' },
      { id: 'virtual_terminal', name: 'Virtual Terminal', optionsInside: ['Access', 'Required customer fields', 'Receipts'], description: 'Phone order browser card processing.' },
      { id: 'fraud_controls', name: 'Fraud Controls', optionsInside: ['Verification', 'Velocity limits', 'Risk alerts', 'Review workflow'], description: 'CVV/AVS checks & velocity rules.' },
      { id: 'disputes', name: 'Disputes', optionsInside: ['Provider dispute status', 'Notifications', 'Evidence access'], description: 'Chargeback records and evidence.' },
      { id: 'payment_reconciliation', name: 'Payment Reconciliation', optionsInside: ['Match payments', 'Refunds', 'Settlement', 'Processor fees'], description: 'Batch settlement match.' }
    ]
  },
  {
    id: 'taxes_fees_tips',
    num: 10,
    title: 'Taxes, Service Fees, Discounts & Tips',
    iconName: 'Receipt',
    description: 'Tax rules, auto gratuity thresholds, service charges, comps, tip prompts, and tip pooling rules.',
    pages: [
      { id: 'tax_rates', name: 'Tax Rates', optionsInside: ['Names', 'Rates', 'Effective dates', 'Applicable locations'], description: 'State, city, and liquor sales tax rates.' },
      { id: 'tax_assignments', name: 'Tax Assignments', optionsInside: ['Item/category', 'Order type', 'Channel', 'Exemptions'], description: 'Mapping taxes to menu items.' },
      { id: 'tax_calculation', name: 'Tax Calculation', optionsInside: ['Inclusive/exclusive treatment', 'Calculation order', 'Rounding'], description: 'Inclusive vs additive tax math.' },
      { id: 'service_charges', name: 'Service Charges', optionsInside: ['Name', 'Flat/percentage amount', 'Calculation basis'], description: 'Fixed or percentage delivery/service fees.' },
      { id: 'automatic_charges', name: 'Automatic Charges', optionsInside: ['Party-size threshold', 'Order type', 'Service area', 'Channel', 'Schedule'], description: 'Auto-gratuity for large parties (6+ guests).' },
      { id: 'charge_adjustments', name: 'Charge Adjustments', optionsInside: ['Removal/edit permissions', 'Reason codes', 'Approval requirements'], description: 'Rules for waiving service charges.' },
      { id: 'charge_presentation', name: 'Charge Presentation', optionsInside: ['Receipt label', 'Guest disclosure', 'Separate reporting classification'], description: 'Line-item guest receipt formatting.' },
      { id: 'discounts', name: 'Discounts', optionsInside: ['Percentage/fixed amount', 'Eligible items', 'Dates', 'Codes'], description: 'Staff, military, and promotional discounts.' },
      { id: 'discount_restrictions', name: 'Discount Restrictions', optionsInside: ['Minimum spend', 'Maximum amount', 'Stacking', 'Usage limits'], description: 'Prevent coupon stacking.' },
      { id: 'comps', name: 'Comps', optionsInside: ['Comp reasons', 'Approval thresholds', 'Reporting categories'], description: 'Manager promotional comp allowances.' },
      { id: 'tip_screen', name: 'Tip Screen', optionsInside: ['Preset percentages/amounts', 'Custom and no-tip choices'], description: 'Touchscreen tip prompts (18%, 20%, 22%).' },
      { id: 'tip_calculation', name: 'Tip Calculation', optionsInside: ['Calculation basis', 'Rounding', 'Interaction with service charges'], description: 'Pre-tax vs post-tax tip calculation.' },
      { id: 'auto_gratuity', name: 'Automatic Gratuity', optionsInside: ['Applicability', 'Display', 'Handling alongside optional tips'], description: 'Large party autograt distribution.' },
      { id: 'tip_adjustment', name: 'Tip Adjustment', optionsInside: ['Adjustment windows', 'Permissions', 'Audit history'], description: 'Post-close shift tip adjustments.' },
      { id: 'tip_distribution', name: 'Tip Distribution', optionsInside: ['Eligible jobs', 'Distribution method', 'Approval', 'Payout records'], description: 'Point-based tip pool sharing.' }
    ]
  },
  {
    id: 'cash_closeout',
    num: 11,
    title: 'Cash Management & Closeout',
    iconName: 'DollarSign',
    description: 'Cash drawer assignments, blind counts, drops, shift checkout, and operational vs processor settlement.',
    pages: [
      { id: 'drawer_assignment', name: 'Drawer Assignment', optionsInside: ['Employee/shared drawers', 'Allowed devices'], description: 'Single-user or shared drawer lock.' },
      { id: 'opening_cash', name: 'Opening Cash', optionsInside: ['Default starting balance ($200)', 'Adjustment permissions'], description: 'Standard float start amount.' },
      { id: 'no_sale_openings', name: 'No-Sale Openings', optionsInside: ['Allowed roles', 'Required reasons'], description: 'Audited cash drawer pop-open rules.' },
      { id: 'cash_movements', name: 'Cash Movements', optionsInside: ['Cash-in', 'Payout', 'Drop reasons and limits'], description: 'Mid-shift safe drops and petty cash.' },
      { id: 'cash_counting', name: 'Cash Counting', optionsInside: ['Blind counts', 'Denominations', 'Recount requirements'], description: 'Drawer reconciliation counting.' },
      { id: 'discrepancies', name: 'Discrepancies', optionsInside: ['Over/short thresholds', 'Approval', 'Notifications'], description: 'Drawer over/short variance thresholds.' },
      { id: 'shift_checkout', name: 'Shift Checkout', optionsInside: ['Required tip declaration', 'Cash count', 'Check transfers'], description: 'Server end-of-shift report.' },
      { id: 'day_closeout', name: 'Day Closeout', optionsInside: ['Manual/automatic operational close', 'Cutoff', 'Reminders'], description: 'Nightly Z-report and register close.' },
      { id: 'open_check_handling', name: 'Open-Check Handling', optionsInside: ['Warn', 'Transfer', 'Resolve unpaid checks'], description: 'Prevent closing day with uncollected tabs.' },
      { id: 'payment_settlement', name: 'Payment Settlement', optionsInside: ['Batch settings', 'Settlement status'], description: 'Merchant processor credit card batching.' },
      { id: 'closeout_delivery', name: 'Closeout Delivery', optionsInside: ['Report recipients', 'Print/email preferences'], description: 'Automated end-of-day email reports.' },
      { id: 'historical_corrections', name: 'Historical Corrections', optionsInside: ['Approval', 'Reasons', 'Preserved values'], description: 'Past day close audit edits.' }
    ]
  },
  {
    id: 'receipts_displays',
    num: 12,
    title: 'Receipts & Customer Displays',
    iconName: 'Printer',
    description: 'Receipt headers, order and payment receipt templates, customer facing display (CFD), and footer notes.',
    pages: [
      { id: 'receipt_branding', name: 'Receipt Branding', optionsInside: ['Logo', 'Business name', 'Address', 'Contact details'], description: 'Header graphics and business info.' },
      { id: 'order_receipts', name: 'Order Receipts', optionsInside: ['Table', 'Server', 'Guests', 'Courses', 'Order name', 'Prep details'], description: 'Guest check ticket layout.' },
      { id: 'payment_receipts', name: 'Payment Receipts', optionsInside: ['Tender info', 'Masked card details', 'Taxes', 'Charges', 'Tips'], description: 'Final credit card signature slip.' },
      { id: 'receipt_layout', name: 'Receipt Layout', optionsInside: ['Paper width (80mm / 58mm)', 'Font size', 'Item grouping', 'Modifiers'], description: 'Thermal printer line item formatting.' },
      { id: 'digital_receipts', name: 'Digital Receipts', optionsInside: ['Email/SMS availability', 'Templates', 'Delivery status'], description: 'Paperless receipt delivery.' },
      { id: 'receipt_defaults', name: 'Receipt Defaults', optionsInside: ['Print automatically', 'Ask', 'Digital only', 'Duplicate copies'], description: 'Post-payment print prompts.' },
      { id: 'footer_content', name: 'Footer Content', optionsInside: ['Thank-you message', 'Return policy', 'Survey or booking link'], description: 'Promotional footer text and QR code.' },
      { id: 'customer_display', name: 'Customer Display (CFD)', optionsInside: ['Order summary', 'Pricing', 'Tip prompt', 'Confirmation'], description: 'Secondary customer-facing screen graphics.' },
      { id: 'document_numbering', name: 'Document Numbering', optionsInside: ['Receipt/invoice identifiers', 'Location prefixes'], description: 'Sequential receipt numbering.' }
    ]
  }
];

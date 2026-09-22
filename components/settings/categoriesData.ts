export interface SettingOption {
  id: string;
  name: string;
  optionsInside: string[];
  description: string;
}

export interface SettingCategory {
  id: string;
  num: number;
  title: string;
  iconName: string;
  description: string;
  pages: SettingOption[];
}

export const SETTINGS_CATEGORIES: SettingCategory[] = [
  {
    id: 'profile_security',
    num: 1,
    title: 'My Profile & Security',
    iconName: 'UserCheck',
    description: 'Manage personal details, 2FA, PINs, active sessions, and notification preferences.',
    pages: [
      { id: 'personal_profile', name: 'Personal Profile', optionsInside: ['Name', 'Email', 'Phone', 'Photo', 'Preferred Language'], description: 'Manage personal contact information and language preferences.' },
      { id: 'login_password', name: 'Login & Password', optionsInside: ['Change password', 'Account recovery', 'Sign-in methods'], description: 'Security credentials and password recovery options.' },
      { id: 'two_factor', name: 'Two-Factor Authentication', optionsInside: ['Enroll authentication method', 'Recovery codes', 'Trusted devices'], description: 'Add extra layers of login security.' },
      { id: 'personal_pos', name: 'Personal POS Access', optionsInside: ['Change own PIN', 'View assigned access cards'], description: 'Manage terminal PIN and security cards.' },
      { id: 'active_sessions', name: 'Active Sessions', optionsInside: ['View signed-in devices', 'Sign out individual sessions', 'Sign out everywhere'], description: 'Monitor and terminate open sessions.' },
      { id: 'personal_prefs', name: 'Personal Preferences', optionsInside: ['Theme', 'Text size', 'Date/time display', 'Default location'], description: 'Customize user interface rendering.' },
      { id: 'my_notifications', name: 'My Notifications', optionsInside: ['Email', 'Push', 'SMS preferences for permitted notifications'], description: 'Control personal notification channels.' }
    ]
  },
  {
    id: 'business_locations',
    num: 2,
    title: 'Business Information & Locations',
    iconName: 'Building2',
    description: 'Configure multi-unit branding, business hours, service windows, and business-day rollover.',
    pages: [
      { id: 'business_profile', name: 'Business Profile', optionsInside: ['Legal name', 'Trading name', 'Business type', 'Logo', 'Website', 'Contact information'], description: 'Core business entity registration.' },
      { id: 'location_details', name: 'Location Details', optionsInside: ['Location name', 'Address', 'Phone', 'Timezone', 'Default language'], description: 'Physical store address and localization.' },
      { id: 'regional_settings', name: 'Regional Settings', optionsInside: ['Currency', 'Date format', 'Number format', 'Measurement units'], description: 'Currency and formatting specifications.' },
      { id: 'business_hours', name: 'Business Hours', optionsInside: ['Regular hours', 'Split opening periods', 'Seasonal schedules'], description: 'Standard operational schedule.' },
      { id: 'holiday_special', name: 'Holiday & Special Hours', optionsInside: ['Closures', 'Special openings', 'Temporary exceptions'], description: 'Calendar overrides and event hours.' },
      { id: 'service_hours', name: 'Service Hours', optionsInside: ['Dine-in', 'Kitchen', 'Bar', 'Pickup', 'Delivery', 'Booking hours'], description: 'Departmental operational windows.' },
      { id: 'business_day', name: 'Business Day & Rollover', optionsInside: ['Business-day rollover time (e.g. 4:00 AM)', 'Reporting week start'], description: 'Nightclub & bar overnight settlement boundaries.' },
      { id: 'revenue_centers', name: 'Revenue Centers', optionsInside: ['Dining room', 'Patio', 'Bar', 'Catering', 'Other reporting areas'], description: 'Segment sales and labor reporting.' },
      { id: 'location_groups', name: 'Location Groups', optionsInside: ['Group locations', 'Assign shared settings', 'Allow selected local overrides'], description: 'Multi-store group management.' },
      { id: 'business_docs', name: 'Business Documents', optionsInside: ['Store business documents with restricted access'], description: 'Store permits, licenses, and contracts.' }
    ]
  },
  {
    id: 'employees_permissions',
    num: 3,
    title: 'Employees, Jobs & Permissions',
    iconName: 'Users',
    description: 'Directory, job definitions, role permission matrix, access scopes, and PIN management.',
    pages: [
      { id: 'employee_directory', name: 'Employee Directory', optionsInside: ['Create', 'Invite', 'Edit', 'Deactivate', 'Assign locations'], description: 'Staff roster and profile records.' },
      { id: 'job_definitions', name: 'Job Definitions', optionsInside: ['Job titles', 'Departments', 'Operational responsibilities'], description: 'Establish organizational positions.' },
      { id: 'role_templates', name: 'Role Templates', optionsInside: ['Manager', 'Supervisor', 'Server', 'Cashier', 'Kitchen', 'Custom roles'], description: 'Pre-configured permission bundles.' },
      { id: 'role_permissions', name: 'Role Permissions', optionsInside: ['Full categorized permission matrix'], description: 'Granular system access controls.' },
      { id: 'employee_overrides', name: 'Employee Overrides', optionsInside: ['Inherit', 'Allow', 'Require approval', 'Deny', 'Expiration'], description: 'Custom per-staff permission exceptions.' },
      { id: 'access_scope', name: 'Access Scope', optionsInside: ['Own orders', 'Assigned section', 'Location', 'Selected locations'], description: 'Data visibility boundaries.' },
      { id: 'approval_rules', name: 'Approval Rules', optionsInside: ['Authorized approvers', 'Action types', 'Dollar/percentage limits'], description: 'Manager void and discount thresholds.' },
      { id: 'active_job_access', name: 'Active-Job Access', optionsInside: ['Apply permissions for the job currently being worked'], description: 'Dynamic permission switching by clocked-in job.' },
      { id: 'pins_cards', name: 'PINs & Access Cards', optionsInside: ['PIN requirements', 'Card issuance', 'Replacement', 'Revocation'], description: 'POS authentication credentials.' },
      { id: 'login_rules', name: 'Employee Login Rules', optionsInside: ['Clock-in requirements', 'Inactivity lock', 'Failed-attempt limits'], description: 'Terminal session security.' },
      { id: 'access_review', name: 'Access Review', optionsInside: ['Preview effective permissions', 'Identify overrides', 'Review changes'], description: 'Audit effective staff permissions.' }
    ]
  },
  {
    id: 'labor_timecards',
    num: 4,
    title: 'Labor, Timecards & Scheduling',
    iconName: 'Clock',
    description: 'Time clock enforcement, break rules, overtime calculations, shift scheduling, and payroll export.',
    pages: [
      { id: 'time_clock', name: 'Time Clock', optionsInside: ['Approved clock-in devices', 'Location restrictions', 'Job selection'], description: 'Clock-in terminal rules and geofencing.' },
      { id: 'attendance_rules', name: 'Attendance Rules', optionsInside: ['Early/late clock-in thresholds', 'Alerts', 'Exception approval'], description: 'Punctuality policy thresholds.' },
      { id: 'break_config', name: 'Break Configuration', optionsInside: ['Break types', 'Reminders', 'Paid/unpaid classification', 'Restrictions'], description: 'Mandatory break enforcement.' },
      { id: 'timecard_corrections', name: 'Timecard Corrections', optionsInside: ['Employee requests', 'Approval workflow', 'Edit reasons'], description: 'Historical timecard adjustment requests.' },
      { id: 'pay_periods', name: 'Pay Periods', optionsInside: ['Period frequency', 'Start dates', 'Payroll cutoff'], description: 'Payroll cycle schedules.' },
      { id: 'wage_settings', name: 'Wage Settings', optionsInside: ['Rates by employee/job', 'Effective dates', 'Restricted visibility'], description: 'Hourly wage and tip-credit rates.' },
      { id: 'overtime_config', name: 'Overtime Configuration', optionsInside: ['Applicable rules', 'Payroll-system mapping'], description: 'Daily and weekly overtime calculations.' },
      { id: 'scheduling', name: 'Scheduling', optionsInside: ['Availability', 'Shift templates', 'Required coverage'], description: 'Shift planning and roster publishing.' },
      { id: 'shift_changes', name: 'Shift Changes', optionsInside: ['Swap requests', 'Open shifts', 'Time-off approvals'], description: 'Peer shift exchanges and requests.' },
      { id: 'payroll_integration', name: 'Payroll Integration', optionsInside: ['Provider connection', 'Job mapping', 'Export fields', 'Sync status'], description: 'Gusto/ADP/Paychex sync pipelines.' }
    ]
  }
];

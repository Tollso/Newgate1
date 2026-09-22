import { SettingCategory } from './categoriesData';

export const SETTINGS_CATEGORIES_PART2: SettingCategory[] = [
  {
    id: 'register_order_behavior',
    num: 5,
    title: 'Register & Order Behavior',
    iconName: 'ShoppingCart',
    description: 'Register modes, order requirements, course handling, open items, bar tabs, and void rules.',
    pages: [
      { id: 'register_mode', name: 'Register Mode', optionsInside: ['Table service', 'Quick service', 'Bar', 'Cashier', 'Kiosk'], description: 'Terminal operational layout mode.' },
      { id: 'order_requirements', name: 'Order Requirements', optionsInside: ['Require table', 'Guest count', 'Employee', 'Customer name', 'Order name'], description: 'Mandatory order creation fields.' },
      { id: 'order_numbering', name: 'Order Numbering', optionsInside: ['Prefixes', 'Sequence rules', 'Reset schedule'], description: 'Custom receipt and ticket sequence IDs.' },
      { id: 'order_types', name: 'Order Types', optionsInside: ['Dine-in', 'Takeout', 'Pickup', 'Delivery', 'Catering'], description: 'Supported fulfillment workflows.' },
      { id: 'default_order_behavior', name: 'Default Order Behavior', optionsInside: ['Default menu', 'Dining option', 'Section', 'Receipt behavior'], description: 'Automated initial checkout defaults.' },
      { id: 'item_entry', name: 'Item Entry', optionsInside: ['Quantity entry', 'Repeated items', 'Special requests', 'Modifier prompts'], description: 'Keypad and touch item behaviors.' },
      { id: 'open_items', name: 'Open Items', optionsInside: ['Enabled categories', 'Required name/reason', 'Allowed price limits'], description: 'Custom non-menu price entry rules.' },
      { id: 'sent_item_changes', name: 'Sent-Item Changes', optionsInside: ['Kitchen notification', 'Approval requirements', 'Change reasons'], description: 'Post-fire ticket edit authorizations.' },
      { id: 'check_management', name: 'Check Management', optionsInside: ['Split/merge rules', 'Item splitting', 'Transfers', 'Ownership'], description: 'Guest check splitting and table moves.' },
      { id: 'voids_corrections', name: 'Voids & Corrections', optionsInside: ['Reason codes', 'Approval requirements', 'Reopen limits'], description: 'Void and error correction audits.' },
      { id: 'course_handling', name: 'Course Handling', optionsInside: ['Default courses', 'Hold/fire behavior', 'Automatic sending'], description: 'Appetizer/Main/Dessert timing controls.' },
      { id: 'bar_tabs', name: 'Bar Tabs', optionsInside: ['Tab names', 'Supported preauthorization', 'Authorization status'], description: 'Pre-auth card storage and tab holding.' },
      { id: 'order_warnings', name: 'Order Warnings', optionsInside: ['Unsent items', 'Unpaid checks', 'Stale tabs', 'Duplicate submission'], description: 'Proactive cashier warning prompts.' },
      { id: 'search_history', name: 'Search & History', optionsInside: ['Default date range', 'Visible locations', 'Historical access scope'], description: 'Past order lookup boundaries.' }
    ]
  },
  {
    id: 'guest_tables_reservations',
    num: 6,
    title: 'Guest Manager, Tables & Reservations',
    iconName: 'Utensils',
    description: 'Floor plan designer, table statuses, server section rotation, waitlist, and reservation policies.',
    pages: [
      { id: 'floor_plans', name: 'Floor Plans', optionsInside: ['Multiple rooms', 'Patio/bar areas', 'Background plans', 'Grid/snap controls'], description: 'Multi-room spatial layouts.' },
      { id: 'table_design', name: 'Table Design', optionsInside: ['Shapes', 'Sizes', 'Rotation', 'Capacities', 'Table numbers/names'], description: 'Physical table geometries.' },
      { id: 'table_labels', name: 'Table Labels', optionsInside: ['Font size', 'Wrapping', 'Minimum readable size', 'Visible information'], description: 'Floor plan typography & labels.' },
      { id: 'table_status', name: 'Table Status', optionsInside: ['Available', 'Seated', 'Ordered', 'Served', 'Payment due', 'Dirty', 'Reserved'], description: 'Real-time table lifecycle states.' },
      { id: 'table_appearance', name: 'Table Appearance', optionsInside: ['Status colors plus text/icons', 'Elapsed-time indicators'], description: 'Visual indicators for meal pace.' },
      { id: 'table_click_behavior', name: 'Table Click Behavior', optionsInside: ['Open action panel or check', 'Show guest, server, order, payment'], description: 'Touch interactions on floor plans.' },
      { id: 'seating_rules', name: 'Seating Rules', optionsInside: ['Capacity limits', 'Allowed table combinations', 'Accessible seating'], description: 'Party size and table joining rules.' },
      { id: 'server_sections', name: 'Server Sections', optionsInside: ['Section definitions', 'Assignments', 'Rotation rules'], description: 'Fair turn-based server section distribution.' },
      { id: 'turn_time_estimates', name: 'Turn-Time Estimates', optionsInside: ['Expected duration by party size', 'Meal period', 'Section'], description: 'Predicted seating hold times.' },
      { id: 'reservation_avail', name: 'Reservation Availability', optionsInside: ['Booking intervals', 'Lead time', 'Booking horizon', 'Capacity'], description: 'Online booking slot limits.' },
      { id: 'booking_restrictions', name: 'Booking Restrictions', optionsInside: ['Min/max party size', 'Restricted dates', 'Approval exceptions'], description: 'Large group policies.' },
      { id: 'deposits_cancellations', name: 'Deposits & Cancellations', optionsInside: ['Supported deposit collection', 'Policies', 'Grace periods', 'No-show handling'], description: 'Reservation commitment fees.' },
      { id: 'waitlist', name: 'Waitlist', optionsInside: ['Required details', 'Wait estimates', 'Ready notification', 'Response window'], description: 'Walk-in queue management.' },
      { id: 'guest_preferences', name: 'Guest Preferences', optionsInside: ['Tags', 'Dietary notes', 'Occasions', 'Restricted-note visibility'], description: 'VIP and allergy tracking.' },
      { id: 'reservation_comms', name: 'Reservation Communications', optionsInside: ['Confirmation/reminder templates', 'Timing', 'Channels'], description: 'Automated SMS/Email reminders.' }
    ]
  },
  {
    id: 'menus_pricing',
    num: 7,
    title: 'Menus, Modifiers & Pricing',
    iconName: 'BookOpen',
    description: 'Menu hierarchy, modifier groups, price levels, happy hour schedules, and sold-out rules.',
    pages: [
      { id: 'menu_structure', name: 'Menu Structure', optionsInside: ['Menus', 'Categories', 'Subcategories', 'Ordering'], description: 'Catalog layout and nesting.' },
      { id: 'menu_availability', name: 'Menu Availability', optionsInside: ['Location', 'Channel', 'Service period', 'Date/time schedules'], description: 'Time-of-day menu shifts.' },
      { id: 'item_defaults', name: 'Item Defaults', optionsInside: ['Sales category', 'Course', 'Printer station', 'Tax assignment'], description: 'Standard properties for new items.' },
      { id: 'modifier_rules', name: 'Modifier Rules', optionsInside: ['Required/optional groups', 'Min/max choices', 'Default selections'], description: 'Option forces and limits.' },
      { id: 'modifier_pricing', name: 'Modifier Pricing', optionsInside: ['Included choices', 'Extra charges', 'Substitutions', 'Nested options'], description: 'Add-on and substitution fees.' },
      { id: 'item_variations', name: 'Item Variations', optionsInside: ['Sizes', 'Portions', 'Variants', 'Associated prices'], description: 'Item size matrices.' },
      { id: 'price_levels', name: 'Price Levels', optionsInside: ['Dine-in', 'Delivery', 'Catering', 'Location-specific prices'], description: 'Multi-channel pricing overrides.' },
      { id: 'scheduled_pricing', name: 'Scheduled Pricing', optionsInside: ['Happy hours', 'Seasonal prices', 'Start/end times'], description: 'Automated discount time windows.' },
      { id: 'menu_presentation', name: 'Menu Presentation', optionsInside: ['Names', 'Images', 'Descriptions', 'Button colors', 'Sorting'], description: 'Visual tile design on POS touchscreen.' },
      { id: 'dietary_info', name: 'Dietary Information', optionsInside: ['Allergen fields', 'Dietary tags', 'Preparation notes'], description: 'Gluten-free, vegan, and nut alerts.' },
      { id: 'sold_out_behavior', name: 'Sold-Out Behavior', optionsInside: ['Hide or label unavailable items', 'Channel sync', 'Reset rules'], description: '86-item touchscreen behavior.' },
      { id: 'menu_publishing', name: 'Menu Publishing', optionsInside: ['Drafts', 'Preview', 'Scheduled release', 'Change history'], description: 'Staged menu deployment.' }
    ]
  },
  {
    id: 'kitchen_printers',
    num: 8,
    title: 'Kitchen, Printers & Preparation',
    iconName: 'ChefHat',
    description: 'Preparation stations, KDS ticket layouts, course timing, print failover, and order-ready displays.',
    pages: [
      { id: 'prep_stations', name: 'Preparation Stations', optionsInside: ['Grill', 'Cold station', 'Bar', 'Dessert', 'Expo'], description: 'Departmental kitchen prep lines.' },
      { id: 'item_routing', name: 'Item Routing', optionsInside: ['Routing by item/category', 'Order type', 'Location', 'Service area'], description: 'Direct ticket dispatch logic.' },
      { id: 'kitchen_display', name: 'Kitchen Display (KDS)', optionsInside: ['Ticket layout', 'Text size', 'Sorting', 'Visible fields'], description: 'KDS touchscreen layout.' },
      { id: 'ticket_timing', name: 'Ticket Timing', optionsInside: ['Warning thresholds', 'Overdue indicators', 'Preparation targets'], description: 'Target ticket turn times.' },
      { id: 'course_coordination', name: 'Course Coordination', optionsInside: ['Hold/fire controls', 'Course sequencing', 'Pacing'], description: 'Expo course pacing.' },
      { id: 'fulfillment_behavior', name: 'Fulfillment Behavior', optionsInside: ['Item-level completion', 'Ticket completion', 'Expo confirmation'], description: 'Bumping and confirmation rules.' },
      { id: 'recall_reprints', name: 'Recall & Reprints', optionsInside: ['Recall rules', 'Duplicate labels', 'Reprint destinations'], description: 'Bump recall and ticket reprints.' },
      { id: 'change_notifications', name: 'Change Notifications', optionsInside: ['Alerts for modified or voided sent items'], description: 'Kitchen chime alerts on ticket edits.' },
      { id: 'kitchen_printing', name: 'Kitchen Printing', optionsInside: ['Paper size', 'Copies', 'Modifiers', 'Notes', 'Seat/course labels'], description: 'Impact & thermal ticket formatting.' },
      { id: 'printer_failover', name: 'Printer Failover', optionsInside: ['Backup destination', 'Failure alerts', 'Retry handling'], description: 'Automatic rerouting on paper-out.' },
      { id: 'order_ready_display', name: 'Order-Ready Display', optionsInside: ['Display names/numbers', 'Visibility duration'], description: 'Customer pick-up screen monitors.' }
    ]
  }
];

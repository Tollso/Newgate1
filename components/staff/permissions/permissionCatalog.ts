import { CATEGORIES_PART_1 } from './categoriesPart1';
import { CATEGORIES_PART_2 } from './categoriesPart2';
import { CATEGORIES_PART_3 } from './categoriesPart3';
import { PermissionCategoryDef, PermissionDef } from './types';

export const ALL_PERMISSION_CATEGORIES: PermissionCategoryDef[] = [
  ...CATEGORIES_PART_1,
  ...CATEGORIES_PART_2,
  ...CATEGORIES_PART_3,
];

export function getAllPermissions(): PermissionDef[] {
  return ALL_PERMISSION_CATEGORIES.flatMap((cat) => cat.permissions);
}

export function getPermissionById(id: string): PermissionDef | undefined {
  for (const cat of ALL_PERMISSION_CATEGORIES) {
    const perm = cat.permissions.find((p) => p.id === id);
    if (perm) return perm;
  }
  return undefined;
}

export function getCategoryForPermission(permissionId: string): PermissionCategoryDef | undefined {
  return ALL_PERMISSION_CATEGORIES.find((cat) =>
    cat.permissions.some((p) => p.id === permissionId)
  );
}

export function getLinkedPosOptionId(permissionId: string): string | null {
  if (permissionId.startsWith('pos_access_')) {
    return null;
  }
  if (permissionId.startsWith('ord_')) {
    return 'pos_access_register';
  }
  if (permissionId.startsWith('tbl_')) {
    if (
      [
        'tbl_view_floor_plan',
        'tbl_seat_guests',
        'tbl_update_status',
        'tbl_move_occupied',
        'tbl_combine_separate',
        'tbl_assign_servers_sections',
      ].includes(permissionId)
    ) {
      return 'pos_access_table_service';
    }
    if (
      [
        'tbl_create_reservations',
        'tbl_edit_reservations',
        'tbl_cancel_reservations',
        'tbl_override_res_limits',
        'tbl_manage_waitlist',
        'tbl_change_waitlist_priority',
        'tbl_config_res_settings',
      ].includes(permissionId)
    ) {
      return 'pos_access_reservations';
    }
    return 'pos_access_guest_mgr';
  }
  if (permissionId.startsWith('pay_')) {
    return 'pos_access_payment_terminal';
  }
  if (permissionId.startsWith('dsc_')) {
    return 'pos_access_register';
  }
  if (permissionId.startsWith('csh_')) {
    return 'pos_access_register';
  }
  if (permissionId.startsWith('tip_')) {
    return 'pos_access_register';
  }
  if (permissionId.startsWith('mnu_')) {
    return 'pos_access_back_office';
  }
  if (permissionId.startsWith('inv_')) {
    return 'pos_access_back_office';
  }
  if (permissionId.startsWith('kds_')) {
    if (
      [
        'kds_view_tickets',
        'kds_update_prep_status',
        'kds_bump_tickets',
        'kds_recall_tickets',
        'kds_change_priority',
        'kds_view_other_stations',
        'kds_config_workflow',
      ].includes(permissionId)
    ) {
      return 'pos_access_kitchen_display';
    }
    return 'pos_access_orders_hub';
  }
  if (permissionId.startsWith('emp_')) {
    if (
      [
        'emp_clock_in_out',
        'emp_start_end_breaks',
        'emp_view_own_timecards',
        'emp_req_timecard_corr',
      ].includes(permissionId)
    ) {
      return 'pos_access_register';
    }
    return 'pos_access_back_office';
  }
  if (permissionId.startsWith('rpt_')) {
    return 'pos_access_back_office';
  }
  if (permissionId.startsWith('gft_')) {
    return 'pos_access_payment_terminal';
  }
  if (permissionId.startsWith('dlv_')) {
    if (
      [
        'dlv_view_assigned',
        'dlv_update_assigned',
        'dlv_view_all',
        'dlv_dispatch_drivers',
        'dlv_cancel_dispatch',
        'dlv_correct_deliveries',
        'dlv_config_delivery_catering',
      ].includes(permissionId)
    ) {
      return 'pos_access_delivery_mgmt';
    }
    return 'pos_access_orders_hub';
  }
  if (permissionId.startsWith('sys_')) {
    return 'pos_access_back_office';
  }
  return null;
}

export function getPosOptionName(posOptionId: string): string {
  switch (posOptionId) {
    case 'pos_access_register':
      return 'Access POS Register';
    case 'pos_access_table_service':
      return 'Access Table Service';
    case 'pos_access_quick_order':
      return 'Access Quick Order';
    case 'pos_access_guest_mgr':
      return 'Access Guest Manager';
    case 'pos_access_reservations':
      return 'Access Reservations & Waitlist';
    case 'pos_access_orders_hub':
      return 'Access Orders Hub';
    case 'pos_access_payment_terminal':
      return 'Access Payment Terminal';
    case 'pos_access_kitchen_display':
      return 'Access Kitchen Display';
    case 'pos_access_delivery_mgmt':
      return 'Access Delivery Management';
    case 'pos_access_back_office':
      return 'Access Back Office';
    case 'pos_access_help_support':
      return 'Access Help & Support';
    default:
      return 'Primary POS Access';
  }
}

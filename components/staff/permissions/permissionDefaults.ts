import { ALL_PERMISSION_CATEGORIES } from './permissionCatalog';
import { RolePermissionAccess, RolePermissionMatrixState } from './types';

// Default roles list: Manager, Supervisor, Server, Cashier, Kitchen, Host, Bartender, Bookkeeper, Admin
export const DEFAULT_ROLE_COLUMNS = [
  { id: 'R-ADMIN', name: 'Admin', isSystem: true },
  { id: 'R-MANAGER', name: 'Manager', isSystem: true },
  { id: 'R-SUPERVISOR', name: 'Supervisor', isSystem: true },
  { id: 'R-SERVER', name: 'Server', isSystem: true },
  { id: 'R-CASHIER', name: 'Cashier', isSystem: true },
  { id: 'R-KITCHEN', name: 'Kitchen', isSystem: true },
  { id: 'R-HOST', name: 'Host', isSystem: false },
  { id: 'R-BARTENDER', name: 'Bartender', isSystem: false },
  { id: 'R-BOOKKEEPER', name: 'Bookkeeper', isSystem: false },
];

export function getDefaultRolePermissionState(): RolePermissionMatrixState {
  const matrix: RolePermissionMatrixState = {};

  DEFAULT_ROLE_COLUMNS.forEach((role) => {
    matrix[role.id] = {};
  });

  ALL_PERMISSION_CATEGORIES.forEach((cat) => {
    cat.permissions.forEach((perm) => {
      // Admin gets ALLOW for everything
      matrix['R-ADMIN'][perm.id] = 'ALLOW';

      // Manager default rules
      if (
        cat.id === 'cat-15' && (perm.id.includes('manage_api') || perm.id.includes('subs') || perm.id.includes('bank'))
      ) {
        matrix['R-MANAGER'][perm.id] = 'DENY';
      } else {
        matrix['R-MANAGER'][perm.id] = 'ALLOW';
      }

      // Supervisor default rules
      if (cat.id === 'cat-1' || cat.id === 'cat-2' || cat.id === 'cat-3' || cat.id === 'cat-4' || cat.id === 'cat-5' || cat.id === 'cat-6' || cat.id === 'cat-7') {
        if (perm.id.includes('void') || perm.id.includes('refund') || perm.id.includes('delete') || perm.id.includes('close_biz')) {
          matrix['R-SUPERVISOR'][perm.id] = 'ALLOW';
        } else {
          matrix['R-SUPERVISOR'][perm.id] = 'ALLOW';
        }
      } else if (cat.id === 'cat-15' || cat.id === 'cat-12') {
        matrix['R-SUPERVISOR'][perm.id] = 'DENY';
      } else {
        matrix['R-SUPERVISOR'][perm.id] = 'ALLOW';
      }

      // Server default rules
      if (perm.id === 'pos_access_register' || perm.id === 'pos_access_table_service' || perm.id === 'ord_create_orders' || perm.id === 'ord_view_own_orders' || perm.id === 'ord_edit_own_orders' || perm.id === 'ord_remove_unsent_items' || perm.id === 'ord_send_to_kitchen' || perm.id === 'tbl_view_floor_plan' || perm.id === 'tbl_seat_guests' || perm.id === 'pay_accept_card' || perm.id === 'pay_accept_cash' || perm.id === 'tip_view_own' || perm.id === 'tip_enter_own' || perm.id === 'emp_clock_in_out') {
        matrix['R-SERVER'][perm.id] = 'ALLOW';
      } else {
        matrix['R-SERVER'][perm.id] = 'DENY';
      }

      // Cashier default rules
      if (cat.id === 'cat-1' || cat.id === 'cat-4' || cat.id === 'cat-6') {
        if (perm.id.includes('close_biz') || perm.id.includes('over_short')) {
          matrix['R-CASHIER'][perm.id] = 'DENY';
        } else {
          matrix['R-CASHIER'][perm.id] = 'ALLOW';
        }
      } else if (perm.id === 'emp_clock_in_out' || perm.id === 'ord_create_orders') {
        matrix['R-CASHIER'][perm.id] = 'ALLOW';
      } else {
        matrix['R-CASHIER'][perm.id] = 'DENY';
      }

      // Kitchen default rules
      if (cat.id === 'cat-10' || perm.id === 'pos_access_kitchen_display' || perm.id === 'emp_clock_in_out') {
        matrix['R-KITCHEN'][perm.id] = 'ALLOW';
      } else {
        matrix['R-KITCHEN'][perm.id] = 'DENY';
      }

      // Host default rules
      if (cat.id === 'cat-3' || perm.id === 'pos_access_reservations' || perm.id === 'pos_access_guest_mgr' || perm.id === 'emp_clock_in_out') {
        matrix['R-HOST'][perm.id] = 'ALLOW';
      } else {
        matrix['R-HOST'][perm.id] = 'DENY';
      }

      // Bartender default rules
      if (cat.id === 'cat-1' || cat.id === 'cat-2' || cat.id === 'cat-4' || cat.id === 'cat-6' || cat.id === 'cat-7') {
        matrix['R-BARTENDER'][perm.id] = 'ALLOW';
      } else if (perm.id === 'emp_clock_in_out') {
        matrix['R-BARTENDER'][perm.id] = 'ALLOW';
      } else {
        matrix['R-BARTENDER'][perm.id] = 'DENY';
      }

      // Bookkeeper default rules
      if (cat.id === 'cat-12' || cat.id === 'cat-6' || cat.id === 'cat-7' || perm.id.includes('report') || perm.id.includes('export')) {
        matrix['R-BOOKKEEPER'][perm.id] = 'ALLOW';
      } else if (perm.id === 'emp_clock_in_out') {
        matrix['R-BOOKKEEPER'][perm.id] = 'ALLOW';
      } else {
        matrix['R-BOOKKEEPER'][perm.id] = 'DENY';
      }
    });
  });

  return matrix;
}

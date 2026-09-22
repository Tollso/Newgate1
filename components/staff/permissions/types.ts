export type RolePermissionAccess = 'ALLOW' | 'DENY';
export type EmployeePermissionSetting = 'INHERIT' | 'ALLOW' | 'DENY';
export type PermissionScope = 'OWN_RECORDS' | 'ASSIGNED_SECTION' | 'ENTIRE_LOCATION';

export interface PermissionDef {
  id: string;
  name: string;
  description: string;
  hasScope?: boolean;
  hasDollarLimit?: boolean;
  hasPercentLimit?: boolean;
  hasAgeLimit?: boolean;
}

export interface PermissionCategoryDef {
  id: string;
  number: number;
  name: string;
  description: string;
  permissions: PermissionDef[];
}

export interface EmployeeOverride {
  employeeId: string;
  permissionId: string;
  setting: EmployeePermissionSetting;
  scope?: PermissionScope;
  dollarLimit?: number;
  percentLimit?: number;
  maxDaysLimit?: number;
}

export interface RolePermissionMatrixState {
  [roleId: string]: {
    [permissionId: string]: RolePermissionAccess;
  };
}

import React from 'react';
import { GlobalTaxConfig, TipConfig, Role, RolePermission } from '../../types';
import { RolePermissionMatrixState } from '../staff/permissions/types';
import { SettingsEnterpriseContainer } from '../settings/v2/SettingsEnterpriseContainer';

interface SettingsProps {
  kioskConfig?: any;
  businesses?: any;
  giftCards?: any;
  setGiftCards?: any;
  setKioskConfig?: any;
  taxConfig?: GlobalTaxConfig;
  setTaxConfig?: React.Dispatch<React.SetStateAction<GlobalTaxConfig>>;
  tipConfig?: TipConfig;
  setTipConfig?: React.Dispatch<React.SetStateAction<TipConfig>>;
  removalReasons?: string[];
  setRemovalReasons?: React.Dispatch<React.SetStateAction<string[]>>;
  onNavigate?: (tab: string) => void;
  roles?: Role[];
  setRoles?: React.Dispatch<React.SetStateAction<Role[]>>;
  rolePermissions?: RolePermission[];
  setRolePermissions?: React.Dispatch<React.SetStateAction<RolePermission[]>>;
  matrixState?: RolePermissionMatrixState;
  setMatrixState?: React.Dispatch<React.SetStateAction<RolePermissionMatrixState>>;
}

const Settings: React.FC<SettingsProps> = (props) => {
  return <SettingsEnterpriseContainer {...props} />;
};

export default Settings;

with open('components/settings/employees/EmployeePermissionsSub.tsx', 'r') as f:
    c = f.read()

c = c.replace("""  const handleChangePermission = (roleId: string, permissionId: string, value: RolePermissionAccess) => {
    if (setMatrixState) {
      setMatrixState((prev: RolePermissionMatrixState) => ({
      ...prev,
      [roleId]: {
        ...(prev[roleId] || {}),
        [permissionId]: value,
      },
    }));
  };""", """  const handleChangePermission = (roleId: string, permissionId: string, value: RolePermissionAccess) => {
    if (setMatrixState) {
      setMatrixState((prev: RolePermissionMatrixState) => ({
        ...prev,
        [roleId]: {
          ...(prev[roleId] || {}),
          [permissionId]: value,
        },
      }));
    }
  };""")

c = c.replace("""  const handleAddRole = (roleName: string, cloneFromRoleId?: string) => {
    const newRoleId = `R-${Date.now()}`;
    const newRole: Role = {
      id: newRoleId,
      name: roleName,
      type: 'Custom',
      isSystem: false,
      description: 'Custom added role',
    };
    setRoles((prev) => [...prev, newRole]);
    setMatrixState((prev) => {
      const cloned = cloneFromRoleId && prev[cloneFromRoleId] ? { ...prev[cloneFromRoleId] } : {};
      return {
        ...prev,
        [newRoleId]: cloned,
      };
    });
    setToast(`Added new role "${roleName}" to permission matrix.`);
    setTimeout(() => setToast(null), 3000);
  };""", """  const handleAddRole = (roleName: string, cloneFromRoleId?: string) => {
    const newRoleId = `R-${Date.now()}`;
    const newRole: Role = {
      id: newRoleId,
      name: roleName,
      type: 'Custom',
      isSystem: false,
      description: 'Custom added role',
    };
    if (setRoles) setRoles((prev) => [...prev, newRole]);
    if (setMatrixState) {
      setMatrixState((prev) => {
        const cloned = cloneFromRoleId && prev[cloneFromRoleId] ? { ...prev[cloneFromRoleId] } : {};
        return {
          ...prev,
          [newRoleId]: cloned,
        };
      });
    }
    setToast(`Added new role "${roleName}" to permission matrix.`);
    setTimeout(() => setToast(null), 3000);
  };""")

with open('components/settings/employees/EmployeePermissionsSub.tsx', 'w') as f:
    f.write(c)

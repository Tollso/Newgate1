import re

with open('components/settings/employees/EmployeePermissionsSub.tsx', 'r') as f:
    c = f.read()

# Replace the inner const [roles, setRoles] ... to just use the props
c = re.sub(r"  const \[roles, setRoles\] = useState<Role\[\]>\([\s\S]*?\}\)\)\n  \);", "", c)
c = re.sub(r"  const \[matrixState, setMatrixState\] = useState<RolePermissionMatrixState>\(getDefaultRolePermissionState\(\)\);", "", c)

# Fix the handleChangePermission function
c = re.sub(r"  const handleChangePermission = \(roleId: string, permissionId: string, value: RolePermissionAccess\) => \{\n    setMatrixState", r"""  const handleChangePermission = (roleId: string, permissionId: string, value: RolePermissionAccess) => {
    if (setMatrixState) {
      setMatrixState""", c)

c = re.sub(r"      \}, \n    \}\)\);\n  \};", r"""      }, 
    }));
    }
  };""", c)

# Fix the handleAddRole
c = re.sub(r"    setRoles\(\(prev\) => \[\.\.\.prev, newRole\]\);\n    setMatrixState\(\(prev\) => \{", r"""    if (setRoles) setRoles((prev) => [...prev, newRole]);
    if (setMatrixState) {
      setMatrixState((prev) => {""", c)

c = re.sub(r"      \};\n    \}\);\n    setToast", r"""      };
      });
    }
    setToast""", c)

c = c.replace('actualRoles', 'roles')
c = c.replace('actualMatrixState', 'matrixState')
c = c.replace('setMatrixState((prev) => ({', 'setMatrixState((prev: RolePermissionMatrixState) => ({')

with open('components/settings/employees/EmployeePermissionsSub.tsx', 'w') as f:
    f.write(c)

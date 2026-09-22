with open('components/settings/employees/EmployeePermissionsSub.tsx', 'r') as f:
    c = f.read()

c = c.replace('    setRoles((prev) => [...prev, newRole]);', '    if (setRoles) setRoles((prev) => [...prev, newRole]);')
c = c.replace('    setMatrixState((prev) => {', '    if (setMatrixState) setMatrixState((prev) => {')

with open('components/settings/employees/EmployeePermissionsSub.tsx', 'w') as f:
    f.write(c)

with open('components/admin/Settings.tsx', 'r') as f:
    c = f.read()

c = c.replace("""  onNavigate,
  kioskConfig,""", """  onNavigate,
  roles, setRoles, rolePermissions, setRolePermissions, matrixState, setMatrixState,
  kioskConfig,""")

with open('components/admin/Settings.tsx', 'w') as f:
    f.write(c)

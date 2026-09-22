with open('components/settings/EmployeesSettingsSection.tsx', 'r') as f:
    c = f.read()

c = c.replace("""  if (subSection === 'Employee roles') {
    return <EmployeeRolesSub renderSectionHeader={renderSectionHeader} />;
  }
  if (subSection === 'Employee permissions') {
    return <EmployeePermissionsSub renderSectionHeader={renderSectionHeader} />;
  }""", """  if (subSection === 'Employee roles') {
    return <EmployeeRolesSub renderSectionHeader={renderSectionHeader} roles={roles} setRoles={setRoles} />;
  }
  if (subSection === 'Employee permissions') {
    return <EmployeePermissionsSub renderSectionHeader={renderSectionHeader} roles={roles} setRoles={setRoles} matrixState={matrixState} setMatrixState={setMatrixState} />;
  }""")

with open('components/settings/EmployeesSettingsSection.tsx', 'w') as f:
    f.write(c)

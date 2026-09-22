import re

with open('components/settings/employees/EmployeeRolesSub.tsx', 'r') as f:
    c = f.read()

# Update imports
c = c.replace("import React, { useState } from 'react';\nimport { Users, Plus, Shield, CheckCircle2, Trash2 } from 'lucide-react';", 
"import React, { useState } from 'react';\nimport { Users, Plus, Shield, CheckCircle2, Trash2 } from 'lucide-react';\nimport { Role } from '../../../types';")

# Replace interface EmployeeRolesSubProps
props = """interface EmployeeRolesSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  roles?: Role[];
  setRoles?: React.Dispatch<React.SetStateAction<Role[]>>;
}

export const EmployeeRolesSub: React.FC<EmployeeRolesSubProps> = ({ 
  renderSectionHeader,
  roles = [],
  setRoles
}) => {"""

c = re.sub(r"interface EmployeeRolesSubProps \{[\s\S]*?=> \{", props, c)

# Remove local roles state
c = re.sub(r"  const \[roles, setRoles\] = useState<RoleItem\[\]>\(\[[\s\S]*?\]\);", "", c)

# Remove RoleItem interface
c = re.sub(r"interface RoleItem \{[\s\S]*?\}", "", c)

# update handleAddRole
c = c.replace("""      const newR: RoleItem = {
        id: Date.now().toString(),
        name: newRoleName.trim(),
        hourlyRate: newRoleRate,
        pinRequired: true,
        systemRole: false
      };
      setRoles([...roles, newR]);""", """      const newR: Role = {
        id: `R-${Date.now()}`,
        name: newRoleName.trim(),
        type: 'Custom',
        isSystem: false,
        hourlyRate: newRoleRate,
        pinRequired: true
      };
      if (setRoles) setRoles([...roles, newR]);""")

# update handleDeleteRole
c = c.replace("""  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter(r => r.id !== id));
  };""", """  const handleDeleteRole = (id: string) => {
    if (setRoles) setRoles(roles.filter(r => r.id !== id));
  };""")

# update map logic
c = c.replace("r.systemRole", "r.isSystem")
c = c.replace("r.hourlyRate.toFixed(2)", "(r.hourlyRate || 0).toFixed(2)")

# update checkbox
c = c.replace("""                      const updated = roles.map(item => item.id === r.id ? { ...item, pinRequired: e.target.checked } : item);
                      setRoles(updated);""", """                      const updated = roles.map(item => item.id === r.id ? { ...item, pinRequired: e.target.checked } : item);
                      if (setRoles) setRoles(updated);""")

with open('components/settings/employees/EmployeeRolesSub.tsx', 'w') as f:
    f.write(c)

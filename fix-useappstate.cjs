const fs = require('fs');
let c = fs.readFileSync('hooks/useAppState.ts', 'utf8');

const origStr = `    if (user) {
      handleLogin(user);
      setShowRoleSwitcher(false);
      setIsProfileMenuOpen(false);
    } else if (roleName === UserRole.SUPER_ADMIN) {
      const sa = MOCK_EMPLOYEES.find(u => u.role === UserRole.SUPER_ADMIN);
      if (sa) {
        handleLogin(sa);
        setShowRoleSwitcher(false);
        setIsProfileMenuOpen(false);
      }
    }`;

const newStr = `    const userToLogin = user || (roleName === UserRole.SUPER_ADMIN ? MOCK_EMPLOYEES.find(u => u.role === UserRole.SUPER_ADMIN) : null);
    if (userToLogin) {
      handleLogin(userToLogin);
      setShowRoleSwitcher(false);
      setIsProfileMenuOpen(false);
    }`;

c = c.replace(origStr, newStr);
fs.writeFileSync('hooks/useAppState.ts', c);

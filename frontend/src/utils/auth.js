// User authentication and role utilities

export const ROLES = {
  FLEET_MANAGER: 'fleet-manager',
  DISPATCHER: 'dispatcher',
  SAFETY_OFFICER: 'safety-officer',
  FINANCE: 'finance'
};

export const ROLE_CONFIG = {
  [ROLES.FLEET_MANAGER]: {
    name: 'Fleet Manager',
    defaultRoute: '/fleet',
    allowedRoutes: ['/fleet', '/maintenance']
  },
  [ROLES.DISPATCHER]: {
    name: 'Dispatcher',
    defaultRoute: '/dashboard',
    allowedRoutes: ['/dashboard', '/trips']
  },
  [ROLES.SAFETY_OFFICER]: {
    name: 'Safety Officer',
    defaultRoute: '/drivers',
    allowedRoutes: ['/drivers', '/compliance']
  },
  [ROLES.FINANCE]: {
    name: 'Financial Analyst',
    defaultRoute: '/fuel',
    allowedRoutes: ['/fuel', '/analytics']
  }
};

export const getUser = () => {
  const user = localStorage.getItem('transitops_user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem('transitops_user', JSON.stringify(user));
};

export const clearUser = () => {
  localStorage.removeItem('transitops_user');
};

export const isRouteAllowed = (user, path) => {
  if (!user || !user.role) return false;
  const config = ROLE_CONFIG[user.role];
  if (!config) return false;
  return config.allowedRoutes.includes(path);
};

export const getDefaultRoute = (role) => {
  const config = ROLE_CONFIG[role];
  return config ? config.defaultRoute : '/auth';
};

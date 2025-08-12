// Configuración de la aplicación
export const APP_CONFIG = {
  // URLs base según el entorno
  BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://www.formularioelite.store'
    : 'http://localhost:3002',
  
  // Rutas de la aplicación
  ROUTES: {
    HOME: '/',
    ADMIN: '/admin',
    SUB_ADMIN: '/sub-admin',
    SUB_ADMIN_LOGIN: '/sub-admin/login',
    SUB_ADMIN_DASHBOARD: '/sub-admin/dashboard',
    SUB_ADMIN_REGISTRO: '/sub-admin/registro',
  },
  
  // APIs
  API: {
    REGISTROS: '/api/registros',
    MIGRAR_REGISTRADOR: '/api/migrar-registrador',
  },
  
  // Sistema de usuarios sin base de datos
  USERS: {
    // Admin Principal - Jhon
    ADMIN: {
      EMAIL: 'macleanjhon8@gmail.com',
      PASSWORD: 'Ooomy2808.',
      NAME: 'Jhon Maclean',
      ROLE: 'admin'
    },
    // Sub-Admin - Ricardo
    SUB_ADMIN: {
      EMAIL: 'ricardo.prescott@gmail.com',
      PASSWORD: 'Ricardo2024!',
      NAME: 'Ricardo Prescott',
      ROLE: 'sub-admin'
    }
  },

  // Lista de administradores autorizados
  ADMIN_EMAILS: [
    'macleanjhon8@gmail.com', // Admin principal - Jhon
    'ricardo.prescott@gmail.com' // Sub-admin - Ricardo
  ]
};

// Helper para construir URLs completas
export const getFullUrl = (path: string) => {
  return `${APP_CONFIG.BASE_URL}${path}`;
};

// Helper para APIs
export const getApiUrl = (endpoint: string) => {
  return `${APP_CONFIG.BASE_URL}${endpoint}`;
};

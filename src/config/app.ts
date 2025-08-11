// Configuración de la aplicación
export const APP_CONFIG = {
  // URLs base según el entorno
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://tudominio.com'  // 👈 CAMBIAR POR TU DOMINIO REAL
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
  
  // Credenciales de Sub-Admin (en producción deberían venir de variables de entorno)
  SUB_ADMIN: {
    EMAIL: process.env.SUB_ADMIN_EMAIL || 'ricardo.prescott@gmail.com',
    // En producción, la password debería estar hasheada y verificada contra base de datos
    PASSWORD: process.env.NODE_ENV === 'production' 
      ? process.env.SUB_ADMIN_PASSWORD || 'Ricardo2024!'
      : 'Ricardo2024!',
  },
  
  // Admin Principal
  ADMIN: {
    EMAIL: process.env.ADMIN_EMAIL || 'macleanjhon8@gmail.com',
  }
};

// Helper para construir URLs completas
export const getFullUrl = (path: string) => {
  return `${APP_CONFIG.BASE_URL}${path}`;
};

// Helper para APIs
export const getApiUrl = (endpoint: string) => {
  return `${APP_CONFIG.BASE_URL}${endpoint}`;
};

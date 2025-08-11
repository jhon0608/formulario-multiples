// Utilidades de autenticación para producción

// Hash de passwords simple (para desarrollo - en producción usar bcryptjs)
export const hashPassword = async (password: string): Promise<string> => {
  // Implementación simple para desarrollo
  // En producción, instalar bcryptjs y usar: await bcrypt.hash(password, 12);
  return btoa(password); // Base64 encoding simple
};

// Verificar password hasheada
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  // Implementación simple para desarrollo
  // En producción, usar: await bcrypt.compare(password, hashedPassword);
  return btoa(password) === hashedPassword;
};

// Validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar password strength
export const isStrongPassword = (password: string): boolean => {
  // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Generar token JWT (para futuras mejoras)
export const generateToken = (payload: any): string => {
  // Implementar JWT en el futuro
  return btoa(JSON.stringify(payload));
};

// Verificar token JWT
export const verifyToken = (token: string): any => {
  try {
    return JSON.parse(atob(token));
  } catch {
    return null;
  }
};

// Rate limiting simple (para prevenir ataques de fuerza bruta)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const attempts = loginAttempts.get(ip);
  
  if (!attempts) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset después de 15 minutos
  if (now - attempts.lastAttempt > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Máximo 5 intentos por 15 minutos
  if (attempts.count >= 5) {
    return false;
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  return true;
};

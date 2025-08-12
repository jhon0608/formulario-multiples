'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // VALIDACIÓN DIRECTA SIN API - NO MÁS ERRORES
    const emailLower = email.toLowerCase().trim();
    let isValid = false;
    let userData = null;

    // Admin Principal - Jhon
    if (emailLower === 'macleanjhon8@gmail.com' && password === 'Ooomy2808.') {
      isValid = true;
      userData = {
        id: 'admin_jhon',
        correo: 'macleanjhon8@gmail.com',
        nombre: 'Jhon',
        nombreCompleto: 'Jhon Maclean',
        isAdmin: true,
        role: 'admin'
      };
    }
    // Sub-Admin - Ricardo
    else if (emailLower === 'ricardo.prescott@gmail.com' && password === 'Ricardo2024!') {
      isValid = true;
      userData = {
        id: 'admin_ricardo',
        correo: 'ricardo.prescott@gmail.com',
        nombre: 'Ricardo',
        nombreCompleto: 'Ricardo Prescott',
        isAdmin: true,
        role: 'sub-admin'
      };
    }

    if (isValid && userData) {
      // Guardar sesión
      localStorage.setItem('admin_user', JSON.stringify(userData));
      // Redirigir al panel de admin
      router.push('/admin');
    } else {
      setError('Credenciales incorrectas');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-600 mt-2">Acceso para administradores</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Credenciales de prueba:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Admin Principal:</strong></p>
            <p>Email: macleanjhon8@gmail.com</p>
            <p>Contraseña: Ooomy2808.</p>
            <br />
            <p><strong>Sub-Admin:</strong></p>
            <p>Email: ricardo.prescott@gmail.com</p>
            <p>Contraseña: Ricardo2024!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

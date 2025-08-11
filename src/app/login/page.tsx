"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Verificar credenciales usando la API
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.isAdmin) {
        console.log("✅ Credenciales correctas, redirigiendo...");

        // Actualizar datos existentes para marcar como admin
        const macleanUser = localStorage.getItem('maclean_user');
        if (macleanUser) {
          const userData = JSON.parse(macleanUser);
          if (userData.email === data.email) {
            userData.isAdmin = true;
            localStorage.setItem('maclean_user', JSON.stringify(userData));
          }
        }

        const runningpipsUser = localStorage.getItem('runningpips_user');
        if (runningpipsUser) {
          const userData = JSON.parse(runningpipsUser);
          if (userData.email === data.email) {
            userData.isAdmin = true;
            localStorage.setItem('runningpips_user', JSON.stringify(userData));
          }
        }

        // Guardar sesión de admin
        localStorage.setItem("adminUser", data.email);
        localStorage.setItem("isAuthenticated", "true");

        // Redirigir al panel de admin
        router.push("/admin");
      } else {
        console.log("❌ Credenciales incorrectas");
        setError(data.message || "Credenciales incorrectas. Verifica tu email y contraseña.");
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError("Error de conexión. Por favor intenta de nuevo.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20 backdrop-blur-sm">
            <svg className="h-8 w-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Acceso Administrativo
          </h1>
          <p className="text-purple-200">
            Ingresa tu correo para acceder al panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-purple-500/20">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-purple-400/30 rounded-xl text-white placeholder-purple-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-purple-400/30 rounded-xl text-white placeholder-purple-300 outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:from-purple-400 hover:to-pink-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/25"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </div>
            ) : (
              "Iniciar Sesión"
            )}
          </button>

          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-purple-300 hover:text-white transition-colors text-sm"
            >
              ← Volver al inicio
            </Link>
          </div>


        </form>
      </div>
    </div>
  );
}

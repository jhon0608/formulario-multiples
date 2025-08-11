"use client";

import { useState } from "react";
import Link from "next/link";

export default function AccesoRunningPips() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validar acceso usando el endpoint correcto
      const response = await fetch('/api/usuarios/validar-acceso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          plataforma: 'runningpips'
        })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar datos del usuario en localStorage
        localStorage.setItem('runningpips_user', JSON.stringify({
          id: data.usuario.id,
          nombre: data.usuario.nombreCompleto || data.usuario.nombre,
          email: data.usuario.correo,
          edad: data.usuario.edad,
          celular: data.usuario.celular || '',
          fechaRegistro: data.usuario.fechaRegistro ? new Date(data.usuario.fechaRegistro).toLocaleDateString() : ''
        }));

        // Redirigir al dashboard
        window.location.href = '/runningpips/dashboard';
      } else {
        setError(data.message || "Error de acceso");
      }
    } catch (error) {
      console.error('Error:', error);
      setError("Error de conexión. Por favor intenta de nuevo.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white hover:text-blue-200 transition-colors">
            ← Volver al Inicio
          </Link>
          <div className="text-lg font-semibold text-blue-200">Acceso RunningPips</div>
        </div>
      </nav>

      <main className="flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 backdrop-blur-sm">
              <svg className="h-8 w-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Acceder a RunningPips
            </h1>
            <p className="text-blue-200">
              Ingresa tu email para acceder a tu dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-blue-500/20">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:from-blue-400 hover:to-blue-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-blue-500/25"
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
                "Acceder a mi Dashboard"
              )}
            </button>

            <div className="mt-6 text-center">
              <p className="text-blue-300 text-sm">
                ¿No tienes cuenta?{" "}
                <Link href="/registro-runningpips" className="text-blue-200 hover:text-white font-semibold">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

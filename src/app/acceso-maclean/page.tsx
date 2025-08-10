"use client";

import { useState } from "react";
import Link from "next/link";

interface Registro {
  id: string;
  correo: string;
  plataforma: string;
  nombre: string;
  edad: string;
  celular: string;
  fechaRegistro: string;
}

export default function AccesoMaclean() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Buscar el usuario en la base de datos
      const response = await fetch('/api/registros');
      const registros = await response.json();
      
      const usuario = registros.find((reg: Registro) =>
        reg.correo.toLowerCase() === email.toLowerCase() &&
        reg.plataforma === 'maclean'
      );

      if (usuario) {
        // Guardar datos del usuario en localStorage
        localStorage.setItem('maclean_user', JSON.stringify({
          nombre: usuario.nombre,
          email: usuario.correo,
          edad: usuario.edad,
          celular: usuario.celular,
          fechaRegistro: new Date(usuario.fechaRegistro).toLocaleDateString()
        }));
        
        // Redirigir al dashboard
        window.location.href = '/ia-maclean/dashboard';
      } else {
        setError("No encontramos tu registro. ¿Ya te registraste en IA Maclean?");
      }
    } catch (error) {
      console.error('Error:', error);
      setError("Error de conexión. Por favor intenta de nuevo.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-yellow-800 to-orange-900">
      {/* Navigation */}
      <nav className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white hover:text-yellow-200 transition-colors">
            ← Volver al Inicio
          </Link>
          <div className="text-lg font-semibold text-yellow-200">Acceso IA Maclean</div>
        </div>
      </nav>

      <main className="flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 backdrop-blur-sm">
              <svg className="h-8 w-8 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Acceder a IA Maclean
            </h1>
            <p className="text-yellow-200">
              Ingresa tu email para acceder a tu dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-yellow-500/20">
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-yellow-200 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-yellow-400/30 rounded-xl text-white placeholder-yellow-300 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
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
              className="w-full mt-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:from-yellow-400 hover:to-orange-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-yellow-500/25"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              <p className="text-yellow-300 text-sm">
                ¿No tienes cuenta?{" "}
                <Link href="/registro-maclean" className="text-yellow-200 hover:text-white font-semibold">
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function RunningPipsDashboard() {
  const [user, setUser] = useState<any>({
    nombre: "Usuario",
    email: "usuario@ejemplo.com",
    edad: "25",
    celular: "+1234567890",
    fechaRegistro: "Hoy"
  });

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const userData = localStorage.getItem('runningpips_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);

      // Verificar si es el usuario especial y marcar como admin si no está marcado
      if (parsedUser.email === 'macleanjhon8@gmail.com' && !parsedUser.isAdmin) {
        parsedUser.isAdmin = true;
        localStorage.setItem('runningpips_user', JSON.stringify(parsedUser));
      }

      setUser(parsedUser);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-blue-800/50 backdrop-blur-sm border-b border-blue-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">RunningPips Academy</h1>
                <p className="text-blue-200 text-sm">Dashboard</p>
              </div>
            </div>
            <Link
              href="/"
              className="text-blue-200 hover:text-white transition-colors"
            >
              ← Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-blue-800/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-blue-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                ¡Bienvenido, {user.nombre}! 🎉
              </h2>
              <p className="text-blue-200 text-lg">
                Gracias por unirte a RunningPips Academy. Tu registro ha sido exitoso.
              </p>
            </div>

            {/* Botón Admin - Solo para usuario especial */}
            {user.isAdmin && (
              <div className="ml-8">
                <Link
                  href="/admin"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-red-500/25"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Acceder Administrador
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Tu Información</h3>
            <div className="space-y-3">
              <div>
                <span className="text-blue-300">Nombre:</span>
                <span className="text-white ml-2">{user.nombre}</span>
              </div>
              <div>
                <span className="text-blue-300">Email:</span>
                <span className="text-white ml-2">{user.email}</span>
              </div>
              <div>
                <span className="text-blue-300">Edad:</span>
                <span className="text-white ml-2">{user.edad} años</span>
              </div>
              <div>
                <span className="text-blue-300">Celular:</span>
                <span className="text-white ml-2">{user.celular}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Estado de Cuenta</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <span className="text-white">Cuenta Activa</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                <span className="text-white">Miembro desde {user.fechaRegistro}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-white">Acceso Básico</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20">
          <h3 className="text-2xl font-semibold text-white mb-6">Próximos Pasos</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Recursos Educativos</h4>
              <p className="text-blue-200 text-sm">Accede a nuestros materiales de trading</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Comunidad</h4>
              <p className="text-blue-200 text-sm">Únete a nuestra comunidad de traders</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Soporte</h4>
              <p className="text-blue-200 text-sm">Contacta con nuestro equipo</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

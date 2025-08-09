"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function IAMacleanDashboard() {
  const [user, setUser] = useState<any>({
    nombre: "Usuario",
    email: "usuario@ejemplo.com",
    edad: "25",
    celular: "+1234567890",
    fechaRegistro: "Hoy"
  });

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const userData = localStorage.getItem('maclean_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);

      // Verificar si es el usuario especial y marcar como admin si no está marcado
      if (parsedUser.email === 'macleanjhon8@gmail.com' && !parsedUser.isAdmin) {
        parsedUser.isAdmin = true;
        localStorage.setItem('maclean_user', JSON.stringify(parsedUser));
      }

      setUser(parsedUser);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      {/* Header */}
      <header className="bg-orange-800/50 backdrop-blur-sm border-b border-orange-700/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">IA Maclean</h1>
                <p className="text-orange-200 text-sm">Dashboard</p>
              </div>
            </div>
            <Link
              href="/"
              className="text-orange-200 hover:text-white transition-colors"
            >
              ← Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-orange-800/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-orange-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                ¡Bienvenido, {user.nombre}! 🤖
              </h2>
              <p className="text-orange-200 text-lg">
                Gracias por unirte a IA Maclean. Tu registro ha sido exitoso y estás listo para explorar nuestros servicios de inteligencia artificial.
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
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Tu Información</h3>
            <div className="space-y-3">
              <div>
                <span className="text-orange-300">Nombre:</span>
                <span className="text-white ml-2">{user.nombre}</span>
              </div>
              <div>
                <span className="text-orange-300">Email:</span>
                <span className="text-white ml-2">{user.email}</span>
              </div>
              <div>
                <span className="text-orange-300">Edad:</span>
                <span className="text-white ml-2">{user.edad} años</span>
              </div>
              <div>
                <span className="text-orange-300">Celular:</span>
                <span className="text-white ml-2">{user.celular}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">Estado de Cuenta</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                <span className="text-white">Cuenta Activa</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                <span className="text-white">Miembro desde {user.fechaRegistro}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                <span className="text-white">Plan Básico</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Services */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
          <h3 className="text-2xl font-semibold text-white mb-6">Servicios de IA Disponibles</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Análisis de Datos</h4>
              <p className="text-orange-200 text-sm">Procesamiento inteligente de información</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Chatbot IA</h4>
              <p className="text-orange-200 text-sm">Asistente virtual personalizado</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Automatización</h4>
              <p className="text-orange-200 text-sm">Optimización de procesos</p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20">
          <h3 className="text-2xl font-semibold text-white mb-4">Contacto Directo</h3>
          <p className="text-orange-200 mb-6">
            Nuestro equipo se pondrá en contacto contigo pronto para personalizar tu experiencia con IA.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-orange-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email: {user.email}
            </div>
            <div className="flex items-center text-orange-200">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Teléfono: {user.celular}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

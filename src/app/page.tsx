"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Admin Access Buttons - Fixed Position */}
      <div className="fixed top-4 right-4 z-50 flex space-x-2">
        <Link
          href="/sub-admin"
          className="inline-flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-orange-800/80 rounded-lg transition-all duration-200 backdrop-blur-sm border border-orange-700/50"
          title="Sub-Administrador"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Sub-Admin
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/80 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-700/50"
          title="Acceso Administrativo Principal"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Admin
        </Link>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        </div>
        
        <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              <span className="block">Plataformas de</span>
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Registro
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-300 sm:text-2xl">
              Regístrate una vez y accede a nuestras plataformas especializadas
            </p>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="relative px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* RunningPips Academy Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20 backdrop-blur-sm">
                  <svg className="h-8 w-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">RunningPips Academy</h3>
                <p className="mb-6 text-blue-100">
                  Regístrate para formar parte de nuestra comunidad de trading y recibir información exclusiva.
                </p>
                <ul className="mb-8 space-y-2 text-blue-100">
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Registro rápido y fácil
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Información exclusiva
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Acceso prioritario
                  </li>
                </ul>
                <div className="flex gap-3">
                  <Link
                    href="/registro-runningpips"
                    className="flex-1 inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-base font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:scale-105"
                  >
                    Registrarse
                  </Link>
                  <Link
                    href="/acceso-runningpips"
                    className="flex-1 inline-flex items-center justify-center rounded-xl bg-white/20 px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/30 border border-white/30"
                  >
                    Acceder
                  </Link>
                </div>
              </div>
            </div>

            {/* IA Maclean Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 p-8 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/25">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 backdrop-blur-sm">
                  <svg className="h-8 w-8 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">IA Maclean</h3>
                <p className="mb-6 text-yellow-100">
                  Regístrate para recibir información sobre nuestros servicios de inteligencia artificial.
                </p>
                <ul className="mb-8 space-y-2 text-yellow-100">
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Proceso simple
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Información personalizada
                  </li>
                  <li className="flex items-center">
                    <svg className="mr-2 h-4 w-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Contacto directo
                  </li>
                </ul>
                <div className="flex gap-3">
                  <Link
                    href="/registro-maclean"
                    className="flex-1 inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-base font-semibold text-orange-600 transition-all duration-200 hover:bg-orange-50 hover:scale-105"
                  >
                    Registrarse
                  </Link>
                  <Link
                    href="/acceso-maclean"
                    className="flex-1 inline-flex items-center justify-center rounded-xl bg-white/20 px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-white/30 border border-white/30"
                  >
                    Acceder
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Plataformas de Registro. Todos los derechos reservados.
            </p>
            {/* Botón Admin Discreto */}
            <div className="mt-4">
              <Link
                href="/login"
                className="inline-flex items-center px-3 py-1 text-xs text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-200"
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Administración
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

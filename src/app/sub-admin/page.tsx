"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SubAdminHome() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si ya está logueado
    const subAdminUser = localStorage.getItem("subAdminUser");
    if (subAdminUser === "ricardo.prescott@gmail.com") {
      router.push("/sub-admin/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Sistema de Sub-Administradores</h1>
          <p className="text-lg text-gray-600 mb-6">
            Panel especializado para registradores autorizados
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <div className="text-blue-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Registro de Usuarios</h3>
            <p className="text-gray-600 mb-4">
              Registra nuevos usuarios en ambas plataformas: RunningPips e IA MacLean
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Registro rápido y sencillo</li>
              <li>• Validación automática de datos</li>
              <li>• Activación por administrador principal</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <div className="text-green-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Panel de Control</h3>
            <p className="text-gray-600 mb-4">
              Visualiza y gestiona todos los usuarios que has registrado
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Vista de todos tus usuarios</li>
              <li>• Estado de activación en tiempo real</li>
              <li>• Filtros y búsqueda avanzada</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 mb-8">
          <div className="flex items-start space-x-4">
            <div className="text-yellow-600 flex-shrink-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Información Importante</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Solo usuarios autorizados pueden acceder a este sistema</li>
                <li>• Los usuarios registrados aparecerán en el panel principal para activación</li>
                <li>• Puedes ver el estado de tus usuarios pero no editarlos directamente</li>
                <li>• El administrador principal mantiene el control total de activaciones</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/sub-admin/login"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Iniciar Sesión
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ¿Problemas para acceder?{" "}
            <a href="mailto:macleanjhon8@gmail.com" className="text-blue-600 hover:underline">
              Contactar administrador principal
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

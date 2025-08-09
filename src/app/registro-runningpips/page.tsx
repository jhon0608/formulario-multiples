"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegistroRunningPips() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    edad: "",
    celular: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/registros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          plataforma: 'runningpips'
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Verificar si es el usuario especial
        const isSpecialUser = formData.correo === 'macleanjhon8@gmail.com';

        // Guardar datos del usuario en localStorage para el dashboard
        localStorage.setItem('runningpips_user', JSON.stringify({
          nombre: formData.nombre,
          email: formData.correo,
          edad: formData.edad,
          celular: formData.celular,
          fechaRegistro: new Date().toLocaleDateString(),
          isAdmin: isSpecialUser // Marcar como admin si es el usuario especial
        }));

        // Redirigir al dashboard
        window.location.href = '/runningpips/dashboard';
      } else {
        alert('Error al registrar: ' + (result.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Por favor intenta de nuevo.');
    }

    setIsSubmitting(false);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white hover:text-blue-200 transition-colors">
            ← Volver al Inicio
          </Link>
          <div className="text-lg font-semibold text-blue-200">Registro RunningPips</div>
        </div>
      </nav>

      <main className="flex items-center justify-center px-3 sm:px-4 pb-8 sm:pb-16 pt-4 sm:pt-0">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mb-4 sm:mb-6 inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-500/20 backdrop-blur-sm">
              <svg className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Únete a RunningPips Academy
            </h1>
            <p className="text-blue-200 text-sm sm:text-base">
              Completa tu registro y comienza tu viaje en el trading
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg p-4 sm:p-8 rounded-2xl shadow-2xl border border-blue-500/20">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-blue-200 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ingresa tu nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-blue-200 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  placeholder="tu@email.com"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="edad" className="block text-sm font-medium text-blue-200 mb-2">
                  Edad
                </label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  placeholder="25"
                  min="18"
                  max="100"
                  value={formData.edad}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="celular" className="block text-sm font-medium text-blue-200 mb-2">
                  Número de Celular
                </label>
                <input
                  type="tel"
                  id="celular"
                  name="celular"
                  placeholder="+1 234 567 8900"
                  value={formData.celular}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-300 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:from-blue-400 hover:to-cyan-400 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-blue-500/25"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </div>
              ) : (
                "Registrarse en la Academia"
              )}
            </button>

            <p className="mt-6 text-center text-sm text-blue-300">
              Al registrarte, aceptas nuestros términos y condiciones
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}


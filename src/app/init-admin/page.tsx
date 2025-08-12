"use client";

import { useState } from "react";

export default function InitAdmin() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    usuario?: {
      correo: string;
      nombreCompleto: string;
      activado: boolean;
    };
  } | null>(null);
  const [error, setError] = useState("");

  const initializeAdmin = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch('/api/init-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Inicializar Administrador
          </h1>
          <p className="text-blue-200">
            Crear usuario administrador en la base de datos
          </p>
        </div>

        <div className="space-y-6">
          <button
            onClick={initializeAdmin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Inicializando..." : "Crear Administrador"}
          </button>

          {result && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <h3 className="text-green-300 font-semibold mb-2">✅ Éxito</h3>
              <p className="text-green-200 text-sm">{result.message}</p>
              {result.usuario && (
                <div className="mt-2 text-green-200 text-sm">
                  <p><strong>Email:</strong> {result.usuario.correo}</p>
                  <p><strong>Nombre:</strong> {result.usuario.nombreCompleto}</p>
                  <p><strong>Activado:</strong> {result.usuario.activado ? 'Sí' : 'No'}</p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <h3 className="text-red-300 font-semibold mb-2">❌ Error</h3>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="text-center">
            <p className="text-blue-300 text-sm">
              Después de crear el administrador, puedes acceder con:
            </p>
            <p className="text-white text-sm font-mono mt-1">
              macleanjhon8@gmail.com
            </p>
          </div>

          <div className="text-center">
            <a 
              href="/acceso-runningpips" 
              className="text-blue-300 hover:text-white text-sm underline"
            >
              ← Ir a RunningPips
            </a>
            <span className="text-blue-300 mx-2">|</span>
            <a 
              href="/acceso-maclean" 
              className="text-blue-300 hover:text-white text-sm underline"
            >
              Ir a IA Maclean →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

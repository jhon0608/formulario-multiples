"use client";

import { useState } from "react";

export default function Diagnostico() {
  const [diagnostico, setDiagnostico] = useState<object | null>(null);
  const [testPost, setTestPost] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runDiagnostico = async () => {
    setLoading(true);
    setError("");
    setDiagnostico(null);

    try {
      const response = await fetch('/api/diagnostico', {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        setDiagnostico(data);
      } else {
        const text = await response.text();
        setError(`Error ${response.status}: ${text}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testPostEndpoint = async () => {
    setLoading(true);
    setError("");
    setTestPost(null);

    try {
      const response = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: 'macleanjhon8@gmail.com',
          plataforma: 'runningpips'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTestPost(data);
      } else {
        const text = await response.text();
        setError(`Error ${response.status}: ${text}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const testValidarAcceso = async () => {
    setLoading(true);
    setError("");

    try {
      console.log('Probando /api/usuarios/validar-acceso...');
      
      const response = await fetch('/api/usuarios/validar-acceso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: 'macleanjhon8@gmail.com',
          plataforma: 'runningpips'
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const text = await response.text();
      console.log('Response text:', text);

      try {
        const data = JSON.parse(text);
        setTestPost({ validarAcceso: data });
      } catch {
        setError(`Respuesta no es JSON válido: ${text.substring(0, 500)}...`);
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            🔍 Diagnóstico del Sistema
          </h1>

          <div className="space-y-4 mb-8">
            <button
              onClick={runDiagnostico}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Ejecutando..." : "🔍 Diagnóstico General"}
            </button>

            <button
              onClick={testPostEndpoint}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Probando..." : "📡 Test POST Diagnóstico"}
            </button>

            <button
              onClick={testValidarAcceso}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Probando..." : "🚨 Test Validar Acceso (El que falla)"}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <h3 className="text-red-300 font-semibold mb-2">❌ Error</h3>
              <pre className="text-red-200 text-sm whitespace-pre-wrap">{error}</pre>
            </div>
          )}

          {diagnostico && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
              <h3 className="text-green-300 font-semibold mb-2">✅ Diagnóstico General</h3>
              <pre className="text-green-200 text-sm whitespace-pre-wrap">
                {JSON.stringify(diagnostico, null, 2)}
              </pre>
            </div>
          )}

          {testPost && (
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 mb-6">
              <h3 className="text-blue-300 font-semibold mb-2">📡 Resultado Test</h3>
              <pre className="text-blue-200 text-sm whitespace-pre-wrap">
                {JSON.stringify(testPost, null, 2)}
              </pre>
            </div>
          )}

          <div className="text-center mt-8">
            <a 
              href="/init-admin" 
              className="text-blue-300 hover:text-white text-sm underline mr-4"
            >
              ← Ir a Init Admin
            </a>
            <a 
              href="/acceso-runningpips" 
              className="text-blue-300 hover:text-white text-sm underline"
            >
              Ir a RunningPips →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubAdminRegistro() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    correo: "",
    contrasena: "",
    edad: "",
    plataforma: "runningpips"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const router = useRouter();

  // Verificar autenticación
  useEffect(() => {
    const subAdminUser = localStorage.getItem("subAdminUser");
    if (!subAdminUser || subAdminUser !== "ricardo.prescott@gmail.com") {
      router.push("/sub-admin/login");
      return;
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch('/api/registros', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          registradoPor: "ricardo.prescott@gmail.com"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Usuario ${formData.nombreCompleto} registrado exitosamente. Esperando activación del administrador principal.`);
        setMessageType("success");
        setFormData({
          nombreCompleto: "",
          correo: "",
          contrasena: "",
          edad: "",
          plataforma: "runningpips"
        });
      } else {
        setMessage(data.error || 'Error al registrar usuario');
        setMessageType("error");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error de conexión');
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("subAdminUser");
    localStorage.removeItem("subAdminName");
    router.push("/sub-admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Registro</h1>
              <p className="text-sm text-gray-600">Ricardo Orlando Prescott Arias</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push("/sub-admin/dashboard")}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Ver Mis Usuarios
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Registrar Nuevo Usuario</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="edad" className="block text-sm font-medium text-gray-700 mb-2">
                Edad *
              </label>
              <input
                type="number"
                id="edad"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="18"
                max="100"
                required
              />
            </div>

            <div>
              <label htmlFor="plataforma" className="block text-sm font-medium text-gray-700 mb-2">
                Plataforma *
              </label>
              <select
                id="plataforma"
                name="plataforma"
                value={formData.plataforma}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="runningpips">RunningPips</option>
                <option value="maclean">IA MacLean</option>
              </select>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                messageType === "success" 
                  ? "bg-green-50 border border-green-200 text-green-700" 
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Registrando..." : "Registrar Usuario"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

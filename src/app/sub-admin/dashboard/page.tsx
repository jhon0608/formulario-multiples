"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  _id: string;
  correo: string;
  nombreCompleto: string;
  edad: string;
  plataforma: string;
  activado: boolean;
  fechaInicio: string;
  fechaValidacion: string;
  estadoActivo: boolean;
  registradoPor: string;
  created_at: string;
}

export default function SubAdminDashboard() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroPlataforma, setFiltroPlataforma] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const router = useRouter();

  // Verificar autenticación
  useEffect(() => {
    const subAdminUser = localStorage.getItem("subAdminUser");
    if (!subAdminUser || subAdminUser !== "ricardo.prescott@gmail.com") {
      router.push("/sub-admin/login");
      return;
    }
    cargarUsuarios();
  }, [router]);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('/api/registros');
      if (response.ok) {
        const data = await response.json();
        // Filtrar solo los usuarios registrados por Ricardo
        const misUsuarios = data.filter((usuario: Usuario) => 
          usuario.registradoPor === "ricardo.prescott@gmail.com"
        );
        setUsuarios(misUsuarios);
        setUsuariosFiltrados(misUsuarios);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuarios
  useEffect(() => {
    let filtered = usuarios;

    if (busqueda) {
      filtered = filtered.filter(usuario =>
        usuario.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroPlataforma !== 'todas') {
      filtered = filtered.filter(usuario => usuario.plataforma === filtroPlataforma);
    }

    if (filtroEstado !== 'todos') {
      if (filtroEstado === 'activos') {
        filtered = filtered.filter(usuario => usuario.estadoActivo);
      } else if (filtroEstado === 'inactivos') {
        filtered = filtered.filter(usuario => !usuario.estadoActivo);
      }
    }

    setUsuariosFiltrados(filtered);
  }, [usuarios, busqueda, filtroPlataforma, filtroEstado]);

  const handleLogout = () => {
    localStorage.removeItem("subAdminUser");
    localStorage.removeItem("subAdminName");
    router.push("/sub-admin/login");
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'No definida';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const calcularDiasRestantes = (fechaValidacion: string) => {
    if (!fechaValidacion) return 0;
    const hoy = new Date();
    const vencimiento = new Date(fechaValidacion);
    const diferencia = vencimiento.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Usuarios Registrados</h1>
              <p className="text-sm text-gray-600">Ricardo Orlando Prescott Arias</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push("/sub-admin/registro")}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Registrar Usuario
              </button>
              <button
                onClick={cargarUsuarios}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Actualizar
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

      {/* Estadísticas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{usuarios.length}</div>
            <div className="text-sm text-gray-600">Total Usuarios</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {usuarios.filter(u => u.estadoActivo).length}
            </div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">
              {usuarios.filter(u => !u.estadoActivo).length}
            </div>
            <div className="text-sm text-gray-600">Inactivos</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">
              {usuarios.filter(u => u.plataforma === 'runningpips').length}
            </div>
            <div className="text-sm text-gray-600">RunningPips</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre o correo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
              <select
                value={filtroPlataforma}
                onChange={(e) => setFiltroPlataforma(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todas">Todas</option>
                <option value="runningpips">RunningPips</option>
                <option value="maclean">IA MacLean</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Usuarios Registrados ({usuariosFiltrados.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plataforma</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Días Restantes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {usuario.nombreCompleto}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {usuario.correo}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {usuario.edad}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.plataforma === 'runningpips'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {usuario.plataforma === 'runningpips' ? 'RunningPips' : 'IA MacLean'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.estadoActivo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.estadoActivo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatearFecha(usuario.fechaValidacion)}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        calcularDiasRestantes(usuario.fechaValidacion) > 7
                          ? 'bg-green-100 text-green-800'
                          : calcularDiasRestantes(usuario.fechaValidacion) > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {calcularDiasRestantes(usuario.fechaValidacion)} días
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {usuariosFiltrados.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {usuarios.length === 0 
                ? "No has registrado usuarios aún. ¡Comienza registrando tu primer usuario!"
                : "No se encontraron usuarios con los criterios de búsqueda"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

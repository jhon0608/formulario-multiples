"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Registro {
  id: string;
  nombre: string;
  correo: string;
  edad?: string;
  celular: string;
  plataforma: string;
  estado: "pendiente" | "activo" | "inactivo" | "pagos_pendientes";
  fechaRegistro: string;
  fechaInicio?: string;
  fechaDesactivacion?: string;
}

export default function AdminPanel() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [filtroPlataforma, setFiltroPlataforma] = useState<string>("todas");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDates, setEditingDates] = useState<{[key: string]: boolean}>({});
  const router = useRouter();

  // Verificar autenticación
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const adminUser = localStorage.getItem("adminUser");

    if (authStatus === "true" && adminUser === "macleanjhon8@gmail.com") {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      router.push("/login");
      return;
    }
  }, [router]);

  // Cargar registros reales de la API
  useEffect(() => {
    if (!isAuthenticated) return;
    cargarRegistros();
  }, [isAuthenticated]);

  const cargarRegistros = async () => {
    try {
      const response = await fetch('/api/registros');
      if (response.ok) {
        const data = await response.json();
        setRegistros(data);
      }
    } catch (error) {
      console.error('Error cargando registros:', error);
    }
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    try {
      const response = await fetch('/api/registros', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });

      if (response.ok) {
        await cargarRegistros(); // Recargar la lista
      } else {
        alert('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const eliminarRegistro = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        const response = await fetch(`/api/registros?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await cargarRegistros(); // Recargar la lista
        } else {
          alert('Error al eliminar el registro');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
      }
    }
  };

  const actualizarFecha = async (id: string, campo: 'fechaInicio' | 'fechaDesactivacion', fecha: string) => {
    try {
      // Primero obtenemos el registro actual
      const registroActual = registros.find(r => r.id === id);
      if (!registroActual) return;

      // Actualizamos el registro con la nueva fecha
      const registroActualizado = {
        ...registroActual,
        [campo]: fecha || null
      };

      const response = await fetch('/api/registros', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          ...registroActualizado
        }),
      });

      if (response.ok) {
        await cargarRegistros(); // Recargar la lista
      } else {
        alert('Error al actualizar la fecha');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const toggleEditDate = (id: string) => {
    setEditingDates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminUser");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const registrosFiltrados = registros.filter(registro => {
    const coincidePlataforma = filtroPlataforma === "todas" || registro.plataforma === filtroPlataforma;
    const coincideEstado = filtroEstado === "todos" || registro.estado === filtroEstado;
    const coincideBusqueda = registro.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            registro.correo.toLowerCase().includes(busqueda.toLowerCase());
    
    return coincidePlataforma && coincideEstado && coincideBusqueda;
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pagado": return "bg-blue-100 text-blue-800 border-blue-200";
      case "activo": return "bg-green-100 text-green-800 border-green-200";
      case "inactivo": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPlataformaColor = (plataforma: string) => {
    return plataforma === "RunningPips" 
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-orange-50 text-orange-700 border-orange-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="mt-1 text-sm text-gray-500">
                Bienvenido, <span className="font-medium text-blue-600">Administrador</span> - Gestiona todos los registros de las plataformas
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={cargarRegistros}
                className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                ← Inicio
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Nombre o correo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma</label>
              <select
                value={filtroPlataforma}
                onChange={(e) => setFiltroPlataforma(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todas">Todas</option>
                <option value="runningpips">RunningPips</option>
                <option value="maclean">Maclean</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="pagos_pendientes">Pagos Pendientes</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <strong>{registrosFiltrados.length}</strong> registros encontrados
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {registros.filter(r => r.estado === "pendiente").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pagos Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {registros.filter(r => r.estado === "pagos_pendientes").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {registros.filter(r => r.estado === "activo").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactivos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {registros.filter(r => r.estado === "inactivo").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de registros */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plataforma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrosFiltrados.map((registro) => (
                  <tr key={registro.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{registro.nombre}</div>
                        <div className="text-sm text-gray-500">{registro.correo}</div>
                        <div className="text-sm text-gray-500">{registro.celular} • {registro.edad} años</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPlataformaColor(registro.plataforma)}`}>
                        {registro.plataforma}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getEstadoColor(registro.estado)}`}>
                        {registro.estado.charAt(0).toUpperCase() + registro.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium">Registro:</span> {registro.fechaRegistro}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-medium">Inicio:</span>
                          {editingDates[registro.id] ? (
                            <input
                              type="date"
                              value={registro.fechaInicio || ''}
                              onChange={(e) => actualizarFecha(registro.id, 'fechaInicio', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-xs"
                            />
                          ) : (
                            <span>{registro.fechaInicio || 'No definida'}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-medium">Desactivación:</span>
                          {editingDates[registro.id] ? (
                            <input
                              type="date"
                              value={registro.fechaDesactivacion || ''}
                              onChange={(e) => actualizarFecha(registro.id, 'fechaDesactivacion', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-xs"
                            />
                          ) : (
                            <span>{registro.fechaDesactivacion || 'No definida'}</span>
                          )}
                        </div>

                        <button
                          onClick={() => toggleEditDate(registro.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs underline"
                        >
                          {editingDates[registro.id] ? 'Terminar edición' : 'Editar fechas'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => cambiarEstado(registro.id, "activo")}
                          className="text-green-600 hover:text-green-900 px-2 py-1 rounded text-xs bg-green-50 hover:bg-green-100"
                          disabled={registro.estado === "activo"}
                        >
                          Activar
                        </button>
                        <button
                          onClick={() => cambiarEstado(registro.id, "inactivo")}
                          className="text-red-600 hover:text-red-900 px-2 py-1 rounded text-xs bg-red-50 hover:bg-red-100"
                          disabled={registro.estado === "inactivo"}
                        >
                          Inactivar
                        </button>
                        <button
                          onClick={() => cambiarEstado(registro.id, "pagos_pendientes")}
                          className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded text-xs bg-yellow-50 hover:bg-yellow-100"
                          disabled={registro.estado === "pagos_pendientes"}
                        >
                          Pagos Pend.
                        </button>
                        <button
                          onClick={() => eliminarRegistro(registro.id)}
                          className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded text-xs bg-gray-50 hover:bg-gray-100"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {registrosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay registros</h3>
            <p className="mt-1 text-sm text-gray-500">No se encontraron registros con los filtros aplicados.</p>
          </div>
        )}
      </div>
    </div>
  );
}

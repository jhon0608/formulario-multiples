"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  _id: string;
  correo: string;
  nombreCompleto: string;
  edad: string;
  plataforma: string;
  activado: boolean;
  fechaInicio: string;
  fechaVencimiento: string;
  fechaValidacion: string;
  registradoPor?: string; // Opcional para compatibilidad
  created_at: string;
}

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editDates, setEditDates] = useState<{fechaInicio: string, fechaVencimiento: string}>({
    fechaInicio: '',
    fechaVencimiento: ''
  });
  const [busqueda, setBusqueda] = useState('');
  const [filtroPlataforma, setFiltroPlataforma] = useState('todas');
  const [filtroRegistrador, setFiltroRegistrador] = useState('todos');
  const router = useRouter();

  // Verificar autenticación simple
  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser || adminUser !== "macleanjhon8@gmail.com") {
      router.push("/login");
      return;
    }
    cargarUsuarios();
  }, [router]);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('/api/registros');
      if (response.ok) {
        const data = await response.json();
        console.log('Usuarios cargados:', data);
        setUsuarios(data);
        setUsuariosFiltrados(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para filtrar cuando cambian los criterios
  React.useEffect(() => {
    const filtrarUsuarios = () => {
      let usuariosFiltrados = usuarios;

      // Filtrar por búsqueda (nombre o email)
      if (busqueda.trim()) {
        usuariosFiltrados = usuariosFiltrados.filter(usuario =>
          usuario.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
          usuario.correo?.toLowerCase().includes(busqueda.toLowerCase())
        );
      }

      // Filtrar por plataforma
      if (filtroPlataforma !== 'todas') {
        usuariosFiltrados = usuariosFiltrados.filter(usuario =>
          usuario.plataforma === filtroPlataforma
        );
      }

      // Filtrar por registrador
      if (filtroRegistrador !== 'todos') {
        usuariosFiltrados = usuariosFiltrados.filter(usuario =>
          usuario.registradoPor === filtroRegistrador
        );
      }

      setUsuariosFiltrados(usuariosFiltrados);
    };

    filtrarUsuarios();
  }, [busqueda, filtroPlataforma, filtroRegistrador, usuarios]);

  const toggleActivacion = async (id: string, activado: boolean) => {
    try {
      console.log('Cambiando estado de usuario:', id, 'de', activado, 'a', !activado);

      const response = await fetch('/api/registros', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          activado: !activado
        })
      });

      if (response.ok) {
        console.log('Usuario actualizado exitosamente');
        cargarUsuarios(); // Recargar la lista
      } else {
        console.error('Error al actualizar usuario:', response.status);
        alert('Error al actualizar el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const eliminarUsuario = async (id: string, nombreCompleto: string) => {
    // Confirmar eliminación
    const confirmacion = window.confirm(
      `¿Estás seguro de que quieres eliminar permanentemente a "${nombreCompleto}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmacion) {
      return;
    }

    try {
      console.log('Eliminando usuario:', id);

      const response = await fetch(`/api/registros/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        console.log('Usuario eliminado exitosamente');
        alert('Usuario eliminado exitosamente');
        cargarUsuarios(); // Recargar la lista
      } else {
        const errorData = await response.json();
        console.error('Error al eliminar usuario:', response.status, errorData);
        alert('Error al eliminar el usuario: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al eliminar el usuario');
    }
  };

  const startEditingDates = (usuario: Usuario) => {
    setEditingUser(usuario._id);
    setEditDates({
      fechaInicio: usuario.fechaInicio || '',
      fechaVencimiento: usuario.fechaVencimiento || ''
    });
  };

  const cancelEditingDates = () => {
    setEditingUser(null);
    setEditDates({ fechaInicio: '', fechaVencimiento: '' });
  };

  const saveDates = async (id: string) => {
    try {
      const response = await fetch('/api/registros', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          fechaInicio: editDates.fechaInicio,
          fechaVencimiento: editDates.fechaVencimiento
        })
      });

      if (response.ok) {
        console.log('Fechas actualizadas exitosamente');
        cargarUsuarios();
        cancelEditingDates();
      } else {
        alert('Error al actualizar las fechas');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Cargando usuarios...</div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  const goToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header con navegación */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600 mt-1">Gestiona todos los usuarios registrados</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={goToHome}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Inicio
              </button>
              <button
                onClick={cargarUsuarios}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Usuarios Registrados</h2>
              <p className="text-sm text-gray-600 mt-1">
                Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={filtroPlataforma}
                onChange={(e) => setFiltroPlataforma(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todas">Todas las plataformas</option>
                <option value="runningpips">RunningPips</option>
                <option value="maclean">IA MacLean</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={filtroRegistrador}
                onChange={(e) => setFiltroRegistrador(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="todos">Todos los registradores</option>
                <option value="macleanjhon8@gmail.com">Admin Principal</option>
                <option value="ricardo.prescott@gmail.com">Ricardo Prescott</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Edad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plataforma</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registrado Por</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Inicio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Vencimiento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
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
                        usuario.activado
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.activado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.registradoPor === 'macleanjhon8@gmail.com'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {usuario.registradoPor === 'macleanjhon8@gmail.com' ? 'Admin Principal' : 'Ricardo Prescott'}
                      </span>
                    </td>
                    {/* Fecha Inicio */}
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {editingUser === usuario._id ? (
                        <input
                          type="date"
                          value={editDates.fechaInicio}
                          onChange={(e) => setEditDates({...editDates, fechaInicio: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      ) : (
                        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                              onClick={() => startEditingDates(usuario)}>
                          {usuario.fechaInicio ? new Date(usuario.fechaInicio).toLocaleDateString('es-ES') : 'No definida'}
                        </span>
                      )}
                    </td>

                    {/* Fecha Vencimiento */}
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {editingUser === usuario._id ? (
                        <input
                          type="date"
                          value={editDates.fechaVencimiento}
                          onChange={(e) => setEditDates({...editDates, fechaVencimiento: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      ) : (
                        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                              onClick={() => startEditingDates(usuario)}>
                          {usuario.fechaVencimiento ? new Date(usuario.fechaVencimiento).toLocaleDateString('es-ES') : 'No definida'}
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-4 text-sm">
                      {editingUser === usuario._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => saveDates(usuario._id)}
                            className="px-2 py-1 text-xs bg-green-100 text-green-800 hover:bg-green-200 rounded"
                          >
                            ✓ Guardar
                          </button>
                          <button
                            onClick={cancelEditingDates}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 rounded"
                          >
                            ✗ Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleActivacion(usuario._id, usuario.activado)}
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              usuario.activado
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {usuario.activado ? 'Desactivar' : 'Activar'}
                          </button>
                          <button
                            onClick={() => startEditingDates(usuario)}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 rounded"
                          >
                            📅 Editar Fechas
                          </button>
                          <button
                            onClick={() => eliminarUsuario(usuario._id, usuario.nombreCompleto)}
                            className="px-3 py-1 text-xs font-medium rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                            title="Eliminar usuario permanentemente"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {usuariosFiltrados.length === 0 && usuarios.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron usuarios con los criterios de búsqueda</p>
          </div>
        )}

        {usuarios.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay usuarios registrados</p>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Total de usuarios: {usuarios.length}
          </p>

          {/* Enlaces rápidos */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.push('/registro-runningpips')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              📊 Registro RunningPips
            </button>
            <button
              onClick={() => router.push('/registro-maclean')}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              🤖 Registro IA MacLean
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              🔐 Login Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



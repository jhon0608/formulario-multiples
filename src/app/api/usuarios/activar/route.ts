import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface Usuario {
  _id?: ObjectId;
  correo: string;
  nombreCompleto: string;
  contrasena: string;
  edad: string;
  fechaInicio: Date;
  fechaValidacion: Date;
  activado: boolean;
  plataforma: string;
  registradoPor: string;
  created_at?: Date;
  updated_at?: Date;
}

// Obtener la colección de usuarios
async function getUsuariosCollection() {
  const db = await getDb();
  return db.collection('usuarios');
}

// Función para verificar si el usuario está activo
function isUsuarioActivo(usuario: Usuario): boolean {
  const ahora = new Date();
  const fechaInicio = new Date(usuario.fechaInicio);
  const fechaValidacion = new Date(usuario.fechaValidacion);

  // Debe estar activado manualmente Y dentro del período válido
  return usuario.activado &&
         ahora >= fechaInicio &&
         ahora <= fechaValidacion;
}

// PUT - Activar/Desactivar usuario
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, activado } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    if (typeof activado !== 'boolean') {
      return NextResponse.json({ error: 'El campo activado debe ser true o false' }, { status: 400 });
    }

    const collection = await getUsuariosCollection();
    const objectId = ObjectId.createFromHexString(id);

    // Buscar el usuario existente
    const usuarioExistente = await collection.findOne({ _id: objectId });

    if (!usuarioExistente) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Actualizar estado de activación
    const result = await collection.updateOne(
      { _id: objectId },
      {
        $set: {
          activado: activado,
          updated_at: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener el usuario actualizado
    const usuarioActualizado = await collection.findOne({ _id: objectId });

    if (!usuarioActualizado) {
      return NextResponse.json({ error: 'Error al obtener usuario actualizado' }, { status: 500 });
    }

    const usuarioTyped = usuarioActualizado as unknown as Usuario;

    return NextResponse.json({
      success: true,
      message: `Usuario ${activado ? 'activado' : 'desactivado'} exitosamente`,
      usuario: {
        ...usuarioActualizado,
        id: usuarioActualizado._id.toString(),
        _id: undefined,
        estadoActivo: isUsuarioActivo(usuarioTyped),
        // Información adicional para el admin
        fechaInicio: usuarioActualizado.fechaInicio,
        fechaValidacion: usuarioActualizado.fechaValidacion,
        diasRestantes: Math.ceil((new Date(usuarioActualizado.fechaValidacion).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      }
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// GET - Obtener estado de un usuario específico
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const collection = await getUsuariosCollection();
    const objectId = ObjectId.createFromHexString(id);

    const usuario = await collection.findOne({ _id: objectId });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const usuarioTyped = usuario as unknown as Usuario;
    const ahora = new Date();
    const fechaInicio = new Date(usuario.fechaInicio);
    const fechaValidacion = new Date(usuario.fechaValidacion);
    const diasRestantes = Math.ceil((fechaValidacion.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      id: usuario._id.toString(),
      nombreCompleto: usuario.nombreCompleto,
      correo: usuario.correo,
      edad: usuario.edad,
      plataforma: usuario.plataforma,
      activado: usuario.activado,
      estadoActivo: isUsuarioActivo(usuarioTyped),
      fechaInicio: usuario.fechaInicio,
      fechaValidacion: usuario.fechaValidacion,
      diasRestantes: diasRestantes,
      dentroDelPeriodo: ahora >= fechaInicio && ahora <= fechaValidacion,
      created_at: usuario.created_at
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

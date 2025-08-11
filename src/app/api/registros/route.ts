import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

interface Usuario {
  _id?: string;
  id?: string;
  correo: string;
  nombreCompleto: string;
  contrasena: string;
  edad: string;
  fechaInicio: Date;
  fechaValidacion: Date; // 30 días después de fechaInicio
  activado: boolean;
  plataforma: string;
  registradoPor: string; // Email del administrador que registró al usuario
  created_at?: Date;
  updated_at?: Date;
}

// Obtener la colección de usuarios
async function getUsuariosCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return db.collection('usuarios');
}

// Función para calcular fecha de validación (30 días después)
function calcularFechaValidacion(fechaInicio: Date): Date {
  const fechaValidacion = new Date(fechaInicio);
  fechaValidacion.setDate(fechaValidacion.getDate() + 30);
  return fechaValidacion;
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

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    const collection = await getUsuariosCollection();
    const usuarios = await collection.find({}).toArray();

    // Convertir _id a string y agregar estado de activación
    const usuariosFormateados = usuarios.map(usuario => {
      const usuarioTyped = usuario as unknown as Usuario;
      return {
        ...usuario,
        _id: usuario._id.toString(),
        id: usuario._id.toString(),
        estadoActivo: isUsuarioActivo(usuarioTyped), // Calcular si está activo
        // Para compatibilidad con el panel admin existente
        nombre: usuario.nombreCompleto,
        correo: usuario.correo,
        plataforma: usuario.plataforma,
        fechaRegistro: usuario.created_at ? new Date(usuario.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        estado: isUsuarioActivo(usuarioTyped) ? 'activo' : 'inactivo'
      };
    });

    return NextResponse.json(usuariosFormateados);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return NextResponse.json({ error: 'Error obteniendo usuarios' }, { status: 500 });
  }
}

// POST - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 Datos recibidos:', body);
    const { nombreCompleto, correo, contrasena, edad, plataforma, registradoPor } = body;

    // Validar campos requeridos
    if (!nombreCompleto || !correo || !contrasena || !edad || !plataforma) {
      console.log('❌ Campos faltantes:', { nombreCompleto, correo, contrasena, edad, plataforma });
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const collection = await getUsuariosCollection();

    // Verificar si el correo ya existe EN LA MISMA PLATAFORMA
    console.log('🔍 Buscando usuario existente:', { correo, plataforma });
    const existeCorreoPlataforma = await collection.findOne({
      correo,
      plataforma
    });
    console.log('📋 Usuario existente encontrado:', existeCorreoPlataforma);
    if (existeCorreoPlataforma) {
      console.log('❌ Usuario ya existe en esta plataforma');
      return NextResponse.json({ error: 'El correo ya está registrado en esta plataforma' }, { status: 400 });
    }

    // Crear fechas
    const fechaInicio = new Date();
    const fechaValidacion = calcularFechaValidacion(fechaInicio);

    // Crear nuevo usuario
    const nuevoUsuario = {
      correo,
      nombreCompleto,
      contrasena, // En producción, esto debería estar hasheado
      edad,
      fechaInicio,
      fechaValidacion,
      activado: body.activado !== undefined ? body.activado : false, // Usar el valor enviado o false por defecto
      plataforma,
      registradoPor: registradoPor || 'macleanjhon8@gmail.com', // Admin principal por defecto
      created_at: new Date(),
      updated_at: new Date()
    };

    console.log('💾 Creando usuario:', nuevoUsuario);
    const resultado = await collection.insertOne(nuevoUsuario);
    console.log('✅ Usuario creado con ID:', resultado.insertedId);

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      usuario: {
        ...nuevoUsuario,
        id: resultado.insertedId.toString(),
        _id: undefined,
        fechaInicio: fechaInicio.toISOString(),
        fechaValidacion: fechaValidacion.toISOString()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando usuario:', error);
    return NextResponse.json({ error: 'Error creando usuario' }, { status: 500 });
  }
}

// PUT - Actualizar usuario existente (activar/desactivar)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, activado, ...otrosCampos } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const collection = await getUsuariosCollection();
    const objectId = new ObjectId(id);

    // Buscar el usuario existente
    const usuarioExistente = await collection.findOne({ _id: objectId });

    if (!usuarioExistente) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Preparar la actualización
    const updateData: Record<string, unknown> = {
      ...otrosCampos,
      updated_at: new Date()
    };

    // Actualizar estado de activación
    if (activado !== undefined) {
      updateData.activado = activado;
    }

    // Actualizar en MongoDB
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener el usuario actualizado
    const usuarioActualizado = await collection.findOne({ _id: objectId });

    if (!usuarioActualizado) {
      return NextResponse.json({ error: 'Error al obtener usuario actualizado' }, { status: 500 });
    }

    const usuarioActualizadoTyped = usuarioActualizado as unknown as Usuario;

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: {
        ...usuarioActualizado,
        id: usuarioActualizado._id.toString(),
        _id: undefined,
        estadoActivo: isUsuarioActivo(usuarioActualizadoTyped)
      }
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar usuario
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const collection = await getUsuariosCollection();
    const objectId = new ObjectId(id);

    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

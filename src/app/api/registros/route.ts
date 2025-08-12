import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import { ObjectId, Collection } from 'mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

async function getUsuariosCollection(): Promise<Collection<Usuario>> {
  const db = await getDb();
  return db.collection<Usuario>('usuarios');
}

function calcularFechaValidacion(fechaInicio: Date): Date {
  const fechaValidacion = new Date(fechaInicio);
  fechaValidacion.setDate(fechaValidacion.getDate() + 30);
  return fechaValidacion;
}

function isUsuarioActivo(usuario: Usuario): boolean {
  const ahora = new Date();
  return usuario.activado &&
    ahora >= new Date(usuario.fechaInicio) &&
    ahora <= new Date(usuario.fechaValidacion);
}

function formatear(usuario: Usuario) {
  return {
    id: usuario._id?.toString(),
    correo: usuario.correo,
    nombre: usuario.nombreCompleto,
    nombreCompleto: usuario.nombreCompleto,
    edad: usuario.edad,
    plataforma: usuario.plataforma,
    fechaRegistro: (usuario.created_at || new Date()).toISOString().split('T')[0],
    fechaInicio: usuario.fechaInicio,
    fechaValidacion: usuario.fechaValidacion,
    activado: usuario.activado,
    estadoActivo: isUsuarioActivo(usuario),
    estado: isUsuarioActivo(usuario) ? 'activo' : 'inactivo',
    registradoPor: usuario.registradoPor
  };
}

// GET
export async function GET() {
  try {
    const collection = await getUsuariosCollection();
    const usuarios = await collection.find({}).toArray();
    return NextResponse.json(usuarios.map(formatear));
  } catch (e) {
    console.error('GET usuarios error', e);
    return NextResponse.json({ error: 'Error obteniendo usuarios' }, { status: 500 });
  }
}

// POST
export async function POST(request: NextRequest) {
  try {
    console.log('=== REGISTRO POST REQUEST ===');
    const body = await request.json();
    console.log('Request body:', body);

    const { nombreCompleto, correo, contrasena, edad, plataforma, registradoPor, activado } = body;

    if (!nombreCompleto || !correo || !contrasena || !edad || !plataforma) {
      console.log('❌ Campos faltantes');
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    console.log('✅ Intentando obtener colección de usuarios...');
    const collection = await getUsuariosCollection();
    console.log('✅ Colección obtenida exitosamente');

    const existente = await collection.findOne({ correo, plataforma });
    if (existente) {
      return NextResponse.json({ error: 'El correo ya está registrado en esta plataforma' }, { status: 400 });
    }

    const fechaInicio = new Date();
    const fechaValidacion = calcularFechaValidacion(fechaInicio);

    const nuevo: Usuario = {
      correo,
      nombreCompleto,
      contrasena,
      edad,
      fechaInicio,
      fechaValidacion,
      activado: activado ?? false,
      plataforma,
      registradoPor: registradoPor || 'macleanjhon8@gmail.com',
      created_at: new Date(),
      updated_at: new Date()
    };

    const res = await collection.insertOne(nuevo);
    nuevo._id = res.insertedId;

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente',
      usuario: formatear(nuevo)
    }, { status: 201 });
  } catch (e) {
    console.error('❌ POST usuario error:', {
      message: e instanceof Error ? e.message : 'Error desconocido',
      stack: e instanceof Error ? e.stack : undefined,
      error: e
    });

    const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
    return NextResponse.json({
      error: 'Error creando usuario',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// PUT
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, activado, ...otros } = body;
    if (!id) return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });

    const collection = await getUsuariosCollection();
    const objectId = new ObjectId(id);

    const usuario = await collection.findOne({ _id: objectId });
    if (!usuario) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

    const update: Partial<Usuario> = {
      ...otros,
      updated_at: new Date()
    };
    if (activado !== undefined) update.activado = activado;

    await collection.updateOne({ _id: objectId }, { $set: update });

    const actualizado = await collection.findOne({ _id: objectId });
    if (!actualizado) return NextResponse.json({ error: 'Error al obtener usuario actualizado' }, { status: 500 });

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: formatear(actualizado)
    });
  } catch (e) {
    console.error('PUT usuario error', e);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });

    const collection = await getUsuariosCollection();
    const objectId = new ObjectId(id);

    const result = await collection.deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (e) {
    console.error('DELETE usuario error', e);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

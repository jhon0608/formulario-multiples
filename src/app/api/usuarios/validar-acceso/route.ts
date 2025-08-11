import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Función para verificar si un usuario está activo
function isUsuarioActivo(usuario: any): boolean {
  if (!usuario || !usuario.activado) {
    return false;
  }

  const ahora = new Date();
  const fechaInicio = new Date(usuario.fechaInicio);
  const fechaValidacion = new Date(usuario.fechaValidacion);

  return ahora >= fechaInicio && ahora <= fechaValidacion;
}

export async function POST(request: NextRequest) {
  try {
    const { correo, plataforma } = await request.json();

    if (!correo || !plataforma) {
      return NextResponse.json(
        { success: false, message: 'Correo y plataforma son requeridos' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('usuarios');

    // Buscar el usuario
    const usuario = await collection.findOne({
      correo: correo.toLowerCase(),
      plataforma: plataforma
    });

    if (!usuario) {
      const plataformaNombre = plataforma === 'runningpips' ? 'RunningPips Academy' : 'IA Maclean';
      return NextResponse.json(
        { success: false, message: `No encontramos tu registro. ¿Ya te registraste en ${plataformaNombre}?` },
        { status: 404 }
      );
    }

    // Verificar si el usuario está activo
    if (!isUsuarioActivo(usuario)) {
      return NextResponse.json(
        { success: false, message: 'Tu período de acceso ha expirado. Contacta al administrador para renovar tu suscripción.' },
        { status: 403 }
      );
    }

    // Usuario válido y activo
    return NextResponse.json({
      success: true,
      message: 'Acceso autorizado',
      usuario: {
        id: usuario._id.toString(),
        correo: usuario.correo,
        nombre: usuario.nombre,
        nombreCompleto: usuario.nombreCompleto,
        edad: usuario.edad,
        celular: usuario.celular,
        fechaRegistro: usuario.fechaRegistro,
        plataforma: usuario.plataforma
      }
    });

  } catch (error) {
    console.error('Error validando acceso:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

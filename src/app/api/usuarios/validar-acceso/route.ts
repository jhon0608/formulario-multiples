import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../../lib/mongodb';

interface Usuario {
  _id?: string;
  correo: string;
  nombreCompleto: string;
  nombre?: string;
  edad: string;
  celular?: string;
  fechaRegistro?: string;
  fechaInicio: Date | string;
  fechaValidacion: Date | string;
  activado: boolean;
  plataforma: string;
}

interface Body {
  correo?: string;
  plataforma?: string;
}

function isUsuarioActivo(usuario: Usuario): boolean {
  if (!usuario || !usuario.activado) return false;
  const ahora = new Date();
  const fechaInicio = new Date(usuario.fechaInicio);
  const fechaValidacion = new Date(usuario.fechaValidacion);
  return ahora >= fechaInicio && ahora <= fechaValidacion;
}

export async function POST(request: NextRequest) {
  try {
    let body: Body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'JSON inválido' },
        { status: 400 }
      );
    }

    const { correo, plataforma } = body;

    if (!correo || !plataforma) {
      return NextResponse.json(
        { success: false, message: 'Correo y plataforma son requeridos' },
        { status: 400 }
      );
    }

    let db;
    try {
      db = await getDb();
    } catch (e: any) {
      console.error('DB_INIT_ERROR', e.message);
      return NextResponse.json(
        { success: false, message: 'Error de configuración de base de datos' },
        { status: 500 }
      );
    }
    const collection = db.collection('usuarios');

    const correoLower = correo.toLowerCase();

    const usuario = await collection.findOne<Usuario>({
      correo: correoLower,
      plataforma
    });

    if (!usuario) {
      const plataformaNombre = plataforma === 'runningpips'
        ? 'RunningPips Academy'
        : 'IA Maclean';
      return NextResponse.json(
        { success: false, message: `No encontramos tu registro. ¿Ya te registraste en ${plataformaNombre}?` },
        { status: 404 }
      );
    }

    if (!isUsuarioActivo(usuario)) {
      return NextResponse.json(
        { success: false, message: 'Tu período de acceso ha expirado. Contacta al administrador para renovar.' },
        { status: 403 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const isAdmin = adminEmail ? correoLower === adminEmail : false;

    console.log('ENV_CHECK', {
      adminEmail: process.env.ADMIN_EMAIL,
      db: process.env.MONGODB_DB,
      hasUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV
    });

    return NextResponse.json({
      success: true,
      message: 'Acceso autorizado',
      usuario: {
        id: usuario._id?.toString(),
        correo: usuario.correo,
        nombre: usuario.nombre,
        nombreCompleto: usuario.nombreCompleto,
        edad: usuario.edad,
        celular: usuario.celular,
        fechaRegistro: usuario.fechaRegistro,
        plataforma: usuario.plataforma,
        isAdmin
      }
    });
  } catch (err) {
    console.error('Error validando acceso:', err);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

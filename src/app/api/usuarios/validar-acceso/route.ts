import { NextRequest, NextResponse } from 'next/server';
import { APP_CONFIG } from '../../../../config/app';



interface Body {
  correo?: string;
  contrasena?: string;
  plataforma?: string;
}



export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('=== VALIDAR ACCESO (SIN BD) ===');
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

    const { correo, contrasena } = body;

    if (!correo || !contrasena) {
      return NextResponse.json(
        { success: false, message: 'Correo y contraseña son requeridos' },
        { status: 400 }
      );
    }

    const correoLower = correo.toLowerCase().trim();
    console.log('VALIDATING_USER', { correo: correoLower });

    // Verificar credenciales contra la configuración
    const { USERS } = APP_CONFIG;
    let usuarioValido = null;
    let isAdmin = false;

    // Verificar Admin Principal (Jhon)
    if (correoLower === USERS.ADMIN.EMAIL.toLowerCase() && contrasena === USERS.ADMIN.PASSWORD) {
      usuarioValido = USERS.ADMIN;
      isAdmin = true;
    }
    // Verificar Sub-Admin (Ricardo)
    else if (correoLower === USERS.SUB_ADMIN.EMAIL.toLowerCase() && contrasena === USERS.SUB_ADMIN.PASSWORD) {
      usuarioValido = USERS.SUB_ADMIN;
      isAdmin = true;
    }

    if (!usuarioValido) {
      console.log('INVALID_CREDENTIALS', { correo: correoLower });
      return NextResponse.json({
        success: false,
        message: 'Credenciales incorrectas'
      }, { status: 401 });
    }

    console.log('USER_VALIDATED', {
      correo: correoLower,
      nombre: usuarioValido.NAME,
      isAdmin
    });

    return NextResponse.json({
      success: true,
      message: 'Acceso autorizado',
      usuario: {
        id: `user_${Date.now()}`,
        correo: usuarioValido.EMAIL,
        nombre: usuarioValido.NAME.split(' ')[0],
        nombreCompleto: usuarioValido.NAME,
        edad: '30',
        celular: '',
        fechaRegistro: new Date().toISOString(),
        plataforma: 'sistema',
        isAdmin
      }
    });
  } catch (err) {
    console.error('ROUTE_FATAL', err);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}

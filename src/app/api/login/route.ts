import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { correo, contrasena } = body;

    if (!correo || !contrasena) {
      return NextResponse.json({
        success: false,
        message: 'Correo y contraseña son requeridos'
      }, { status: 400 });
    }

    const correoLower = correo.toLowerCase().trim();

    // Credenciales hardcodeadas - sin base de datos
    let usuarioValido = null;
    let isAdmin = false;

    // Admin Principal - Jhon
    if (correoLower === 'macleanjhon8@gmail.com' && contrasena === 'Ooomy2808.') {
      usuarioValido = {
        EMAIL: 'macleanjhon8@gmail.com',
        NAME: 'Jhon Maclean',
        ROLE: 'admin'
      };
      isAdmin = true;
    }
    // Sub-Admin - Ricardo
    else if (correoLower === 'ricardo.prescott@gmail.com' && contrasena === 'Ricardo2024!') {
      usuarioValido = {
        EMAIL: 'ricardo.prescott@gmail.com',
        NAME: 'Ricardo Prescott',
        ROLE: 'sub-admin'
      };
      isAdmin = true;
    }

    if (!usuarioValido) {
      return NextResponse.json({
        success: false,
        message: 'Credenciales incorrectas'
      }, { status: 401 });
    }

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
    return NextResponse.json({ 
      success: false, 
      message: 'Error interno' 
    }, { status: 500 });
  }
}

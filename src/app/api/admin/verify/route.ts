import { NextRequest, NextResponse } from 'next/server';

// Lista de administradores autorizados
const ADMIN_EMAILS = [
  'macleanjhon8@gmail.com', // Admin principal
];

// GET - Verificar si un email es administrador
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase().trim());

    return NextResponse.json({
      success: true,
      isAdmin,
      email,
      message: isAdmin ? 'Usuario es administrador' : 'Usuario no es administrador'
    });

  } catch (error) {
    console.error('Error verificando admin:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Verificar credenciales de administrador
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    // Verificar credenciales específicas del admin principal
    const isValidAdmin = email.toLowerCase().trim() === 'macleanjhon8@gmail.com' && 
                        password.trim() === 'Ooomy2808.';

    if (isValidAdmin) {
      return NextResponse.json({
        success: true,
        isAdmin: true,
        email: email.toLowerCase().trim(),
        message: 'Credenciales de administrador válidas'
      });
    } else {
      return NextResponse.json({
        success: false,
        isAdmin: false,
        message: 'Credenciales incorrectas'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Error verificando credenciales admin:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

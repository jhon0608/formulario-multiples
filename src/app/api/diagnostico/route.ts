import { NextResponse } from 'next/server';
import { APP_CONFIG } from '../../../config/app';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Diagnóstico completo del sistema
export async function GET() {
  try {
    console.log('=== DIAGNÓSTICO DE CONFIGURACIÓN ===');
    
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      systemType: 'SIN_BASE_DE_DATOS',
      adminEmail: process.env.ADMIN_EMAIL,
      timestamp: new Date().toISOString(),
      platform: process.platform,
      nodeVersion: process.version
    };

    console.log('ENV_VARS:', envCheck);

    // Sistema sin base de datos - usuarios configurados
    const dbStatus = 'SIN_BD_CONFIGURADO';
    const dbError = null;
    const collections = ['usuarios_configurados'];
    const usuariosCount = Object.keys(APP_CONFIG.USERS).length;

    console.log('USUARIOS_CONFIGURADOS:', usuariosCount);
    console.log('ADMIN_EMAILS:', APP_CONFIG.ADMIN_EMAILS);
    
    return NextResponse.json({
      success: true,
      diagnostico: {
        ...envCheck,
        dbStatus,
        dbError,
        collections,
        usuariosCount
      }
    });
    
  } catch (error) {
    console.error('DIAGNOSTIC_ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error en diagnóstico',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// POST - Probar el mismo endpoint que falla
export async function POST(request: Request) {
  try {
    console.log('=== TEST POST DIAGNÓSTICO ===');
    
    // Verificar headers
    const headers = Object.fromEntries(request.headers.entries());
    console.log('REQUEST_HEADERS:', headers);
    
    // Intentar leer el body
    let body;
    let bodyError = null;
    
    try {
      body = await request.json();
      console.log('REQUEST_BODY:', body);
    } catch (error) {
      bodyError = error instanceof Error ? error.message : 'Error parseando JSON';
      console.error('BODY_PARSE_ERROR:', bodyError);
    }
    
    // Verificar configuración del sistema sin BD
    const envStatus = {
      systemType: 'SIN_BASE_DE_DATOS',
      adminEmail: process.env.ADMIN_EMAIL,
      usuariosConfigurados: Object.keys(APP_CONFIG.USERS).length
    };
    
    return NextResponse.json({
      success: true,
      test: {
        headers,
        body,
        bodyError,
        envStatus,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('POST_DIAGNOSTIC_ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error en test POST',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

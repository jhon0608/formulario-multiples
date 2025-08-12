import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Diagnóstico completo del sistema
export async function GET() {
  try {
    console.log('=== DIAGNÓSTICO DE CONFIGURACIÓN ===');
    
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriStart: process.env.MONGODB_URI?.substring(0, 20) + '...',
      hasMongoDb: !!process.env.MONGODB_DB,
      mongoDbName: process.env.MONGODB_DB,
      adminEmail: process.env.ADMIN_EMAIL,
      timestamp: new Date().toISOString(),
      platform: process.platform,
      nodeVersion: process.version
    };
    
    console.log('ENV_VARS:', envCheck);
    
    // Intentar conectar a la base de datos
    let dbStatus = 'ERROR';
    let dbError = null;
    let collections: string[] = [];
    let usuariosCount = 0;
    
    try {
      const db = await getDb();
      const collectionsList = await db.listCollections().toArray();
      collections = collectionsList.map(c => c.name);
      dbStatus = 'CONECTADO';
      
      // Contar usuarios
      const usuariosCollection = db.collection('usuarios');
      usuariosCount = await usuariosCollection.countDocuments();
      
      console.log('DB_COLLECTIONS:', collections);
      console.log('USUARIOS_COUNT:', usuariosCount);
      
    } catch (error) {
      dbError = error instanceof Error ? error.message : 'Error desconocido';
      console.error('DB_CONNECTION_ERROR:', dbError);
    }
    
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
    
    // Verificar variables de entorno críticas
    const envStatus = {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasMongoDb: !!process.env.MONGODB_DB,
      adminEmail: process.env.ADMIN_EMAIL
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

import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Diagnóstico de configuración
export async function GET() {
  try {
    console.log('=== DIAGNÓSTICO DE CONFIGURACIÓN ===');

    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasMongoDb: !!process.env.MONGODB_DB,
      mongoDbName: process.env.MONGODB_DB,
      adminEmail: process.env.ADMIN_EMAIL,
      timestamp: new Date().toISOString()
    };

    console.log('ENV_VARS:', envCheck);

    // Intentar conectar a la base de datos
    let dbStatus = 'ERROR';
    let dbError = null;

    try {
      const db = await getDb();
      const collections = await db.listCollections().toArray();
      dbStatus = 'CONECTADO';
      console.log('DB_COLLECTIONS:', collections.map(c => c.name));
    } catch (error) {
      dbError = error instanceof Error ? error.message : 'Error desconocido';
      console.error('DB_CONNECTION_ERROR:', dbError);
    }

    return NextResponse.json({
      success: true,
      diagnostico: {
        ...envCheck,
        dbStatus,
        dbError
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

// POST - Crear usuario administrador inicial
export async function POST() {
  try {
    const db = await getDb();
    const collection = db.collection('usuarios');
    
    const adminEmail = 'macleanjhon8@gmail.com';
    
    // Verificar si el admin ya existe
    const existingAdmin = await collection.findOne({ correo: adminEmail });
    
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'El administrador ya existe',
        usuario: {
          correo: existingAdmin.correo,
          nombreCompleto: existingAdmin.nombreCompleto,
          activado: existingAdmin.activado
        }
      });
    }
    
    // Crear el usuario administrador
    const fechaInicio = new Date();
    const fechaValidacion = new Date();
    fechaValidacion.setFullYear(fechaValidacion.getFullYear() + 10); // 10 años de validez
    
    const adminUser = {
      correo: adminEmail,
      nombreCompleto: 'Jhon Maclean',
      nombre: 'Jhon',
      contrasena: 'admin123', // En producción debería estar hasheada
      edad: '30',
      celular: '',
      fechaRegistro: new Date().toISOString(),
      fechaInicio,
      fechaValidacion,
      activado: true,
      plataforma: 'runningpips', // También puede acceder a maclean
      registradoPor: 'sistema',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await collection.insertOne(adminUser);
    
    // También crear para la plataforma maclean
    const adminUserMaclean = {
      ...adminUser,
      plataforma: 'maclean'
    };
    
    await collection.insertOne(adminUserMaclean);
    
    return NextResponse.json({
      success: true,
      message: 'Administrador creado exitosamente',
      usuario: {
        id: result.insertedId.toString(),
        correo: adminUser.correo,
        nombreCompleto: adminUser.nombreCompleto,
        activado: adminUser.activado
      }
    });
    
  } catch (error) {
    console.error('Error creando administrador:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

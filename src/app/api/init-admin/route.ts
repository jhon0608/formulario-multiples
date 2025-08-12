import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

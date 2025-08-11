import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

// Obtener la colección de usuarios
async function getUsuariosCollection() {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  return db.collection('usuarios');
}

// POST - Migrar usuarios existentes para agregar campo registradoPor
export async function POST() {
  try {
    const collection = await getUsuariosCollection();
    
    // Actualizar todos los usuarios que no tienen el campo registradoPor
    const result = await collection.updateMany(
      { registradoPor: { $exists: false } },
      { 
        $set: { 
          registradoPor: 'macleanjhon8@gmail.com',
          updated_at: new Date()
        } 
      }
    );

    return NextResponse.json({
      success: true,
      message: `Se actualizaron ${result.modifiedCount} usuarios con el campo registradoPor`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error migrando usuarios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

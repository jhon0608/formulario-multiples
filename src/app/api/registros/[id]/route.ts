import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '../../../../../lib/mongodb';

async function getUsuariosCollection() {
  const db = await getDb();
  return db.collection("usuarios");
}

// PATCH - Actualizar usuario específico
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('Actualizando usuario:', id, 'con datos:', body);

    // Validar que el ID sea válido
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de usuario inválido' }, { status: 400 });
    }

    const collection = await getUsuariosCollection();

    // Verificar que el usuario existe
    const usuarioExistente = await collection.findOne({ _id: new ObjectId(id) });
    if (!usuarioExistente) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Actualizar el usuario
    const resultado = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...body,
          updated_at: new Date()
        }
      }
    );

    if (resultado.matchedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener el usuario actualizado
    const usuarioActualizado = await collection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      usuario: {
        ...usuarioActualizado,
        id: usuarioActualizado?._id.toString()
      }
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('Eliminando usuario:', id);

    // Validar que el ID sea válido
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID de usuario inválido' }, { status: 400 });
    }

    const collection = await getUsuariosCollection();

    // Eliminar el usuario
    const resultado = await collection.deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

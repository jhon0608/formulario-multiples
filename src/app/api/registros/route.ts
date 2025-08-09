import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'registros.json');

// Asegurar que el directorio data existe
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Leer registros del archivo
function readRegistros() {
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo registros:', error);
    return [];
  }
}

// Escribir registros al archivo
function writeRegistros(registros: any[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(registros, null, 2));
  } catch (error) {
    console.error('Error escribiendo registros:', error);
  }
}

// GET - Obtener todos los registros
export async function GET() {
  try {
    const registros = readRegistros();
    return NextResponse.json(registros);
  } catch (error) {
    return NextResponse.json({ error: 'Error obteniendo registros' }, { status: 500 });
  }
}

// POST - Crear nuevo registro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, correo, edad, celular, plataforma } = body;

    // Validar datos requeridos
    if (!nombre || !correo || !celular || !plataforma) {
      return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
    }

    const registros = readRegistros();
    
    // Crear nuevo registro
    const nuevoRegistro = {
      id: Date.now().toString(),
      nombre,
      correo,
      edad: edad || '',
      celular,
      plataforma,
      estado: 'pendiente',
      fechaRegistro: new Date().toISOString().split('T')[0],
      fechaInicio: null,
      fechaDesactivacion: null
    };

    registros.push(nuevoRegistro);
    writeRegistros(registros);

    return NextResponse.json({ 
      success: true, 
      message: 'Registro creado exitosamente',
      registro: nuevoRegistro 
    });
  } catch (error) {
    console.error('Error creando registro:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar registro existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, estado, fechaInicio, fechaDesactivacion, ...otrosCampos } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const registros = readRegistros();
    const index = registros.findIndex((r: any) => r.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
    }

    // Si se está actualizando solo el estado
    if (estado && !fechaInicio && !fechaDesactivacion) {
      registros[index].estado = estado;

      if (estado === 'activo' && !registros[index].fechaInicio) {
        registros[index].fechaInicio = new Date().toISOString().split('T')[0];
      }

      if (estado === 'inactivo') {
        registros[index].fechaDesactivacion = new Date().toISOString().split('T')[0];
      }
    } else {
      // Actualización completa del registro (incluyendo fechas manuales)
      registros[index] = {
        ...registros[index],
        ...otrosCampos,
        fechaInicio: fechaInicio !== undefined ? fechaInicio : registros[index].fechaInicio,
        fechaDesactivacion: fechaDesactivacion !== undefined ? fechaDesactivacion : registros[index].fechaDesactivacion,
      };

      if (estado) {
        registros[index].estado = estado;
      }
    }

    writeRegistros(registros);

    return NextResponse.json({
      success: true,
      message: 'Registro actualizado exitosamente',
      registro: registros[index]
    });
  } catch (error) {
    console.error('Error actualizando registro:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE - Eliminar registro
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const registros = readRegistros();
    const filteredRegistros = registros.filter((r: any) => r.id !== id);

    if (filteredRegistros.length === registros.length) {
      return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
    }

    writeRegistros(filteredRegistros);

    return NextResponse.json({ 
      success: true, 
      message: 'Registro eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error eliminando registro:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

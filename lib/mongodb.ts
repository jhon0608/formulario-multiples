import { MongoClient, Db } from 'mongodb';

interface GlobalMongo {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
}

const g = global as typeof globalThis & GlobalMongo;

// Configuración con fallback para producción
const uri = process.env.MONGODB_URI ||
  (process.env.NODE_ENV === 'production'
    ? 'mongodb+srv://macleanjhon8:Ooomy2808.@cluster0.3wxjduk.mongodb.net/formulario-elite?retryWrites=true&w=majority&appName=Cluster0'
    : undefined);

const dbName = process.env.MONGODB_DB ||
  (process.env.NODE_ENV === 'production'
    ? 'formulario-elite'
    : undefined);

async function connect(): Promise<MongoClient> {
  if (g._mongoClientPromise) return g._mongoClientPromise;

  // Debug detallado de variables de entorno
  console.log('=== MONGODB CONNECTION DEBUG ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);
  console.log('MONGODB_DB exists:', !!process.env.MONGODB_DB);
  console.log('MONGODB_DB value:', process.env.MONGODB_DB);
  console.log('All env keys:', Object.keys(process.env).filter(k => k.includes('MONGO')));

  if (!uri || !dbName) {
    const missing = {
      hasUri: !!uri,
      hasDb: !!dbName,
      uriValue: uri ? `${uri.substring(0, 20)}...` : 'undefined',
      dbValue: dbName || 'undefined'
    };
    console.error('❌ Mongo env missing:', missing);
    throw new Error(`Configuración Mongo incompleta: URI=${!!uri}, DB=${!!dbName}`);
  }
  console.log('✅ Intentando conectar a MongoDB...');
  const client = new MongoClient(uri);
  g._mongoClientPromise = client.connect()
    .then(c => {
      console.log('✅ MongoDB conectado exitosamente');
      g._mongoClient = c;
      return c;
    })
    .catch(err => {
      console.error('❌ Fallo conexión Mongo:', {
        error: err.message,
        code: err.code,
        uri: uri ? `${uri.substring(0, 30)}...` : 'undefined'
      });
      g._mongoClientPromise = undefined;
      throw new Error(`MongoDB connection failed: ${err.message}`);
    });
  return g._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await connect();
  if (!dbName) throw new Error('MONGODB_DB no definida');
  return client.db(dbName);
}
export default getDb;

import { MongoClient, Db } from 'mongodb';

interface GlobalMongo {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
}

const g = global as typeof globalThis & GlobalMongo;

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

async function connect(): Promise<MongoClient> {
  if (g._mongoClientPromise) return g._mongoClientPromise;
  if (!uri || !dbName) {
    const missing = {
      hasUri: !!uri,
      hasDb: !!dbName
    };
    console.error('Mongo env missing', missing);
    throw new Error('Configuración Mongo incompleta (revisa variables de entorno)');
  }
  const client = new MongoClient(uri);
  g._mongoClientPromise = client.connect()
    .then(c => {
      g._mongoClient = c;
      return c;
    })
    .catch(err => {
      console.error('Fallo conexión Mongo:', err);
      g._mongoClientPromise = undefined;
      throw err;
    });
  return g._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await connect();
  if (!dbName) throw new Error('MONGODB_DB no definida');
  return client.db(dbName);
}

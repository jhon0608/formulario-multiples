import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) throw new Error('MONGODB_URI no definida en variables de entorno');
if (!dbName) throw new Error('MONGODB_DB no definida en variables de entorno');

interface GlobalMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

const globalForMongo = global as typeof globalThis & GlobalMongo;

let clientPromise: Promise<MongoClient>;

if (!globalForMongo._mongoClientPromise) {
  const client = new MongoClient(uri);
  globalForMongo._mongoClientPromise = client.connect().catch(err => {
    console.error('Fallo conexión Mongo:', err);
    throw err;
  });
}

clientPromise = globalForMongo._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;

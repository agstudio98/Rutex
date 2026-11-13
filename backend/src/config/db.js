const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rutex_db';

  try {
    const conn = await mongoose.connect(primaryUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ [Database] MongoDB Conectado: ${conn.connection.host}`);
    return conn;
  } catch (primaryError) {
    console.warn(`⚠️ [Database Warning] No se pudo conectar a MongoDB principal (${primaryError.message}).`);

    // En entorno de desarrollo, iniciar fallback de MongoDB en memoria para que el servidor no crashee
    try {
      console.log('🔄 [Database] Iniciando instancia de MongoDB en memoria para desarrollo...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create({
        instance: { dbName: 'rutex_db' },
      });
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri, {
        autoIndex: true,
      });
      console.log(`✅ [Database] MongoDB en memoria activo y listo: ${memoryUri}`);
      return conn;
    } catch (memError) {
      console.error(`❌ [Database Error] Fallback en memoria no disponible: ${memError.message}`);
      console.warn('📡 [Database] El servidor HTTP y WebSockets continuará funcionando. Reintentando conexión periódicamente...');

      // Reintentar en segundo plano periódicamente sin llamar a process.exit(1) para evitar crasheo de nodemon
      setTimeout(connectDB, 8000);
    }
  }
};

module.exports = connectDB;

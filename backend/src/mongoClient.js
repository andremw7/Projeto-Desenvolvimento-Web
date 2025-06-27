const { MongoClient } = require('mongodb');

// PT/EN: URL do cluster MongoDB / MongoDB cluster URL
const uri = 'mongodb+srv://renatospessotto:Q7MXczItG8ILl4HJ@clusterdesenvolvimentow.jc6sory.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDesenvolvimentoWeb';

// PT/EN: Cria o cliente MongoDB / Creates the MongoDB client
const client = new MongoClient(uri);

async function connectMongo() {
  try {
    // PT/EN: Conecta ao banco se ainda não estiver conectado / Connects if not already connected
    if (!client.topology?.isConnected()) {
      await client.connect();
    }

    // PT/EN: Retorna o banco de dados / Returns the database
    return client.db('meu_banco_web');
  } catch (err) {
    console.error('❌ Erro na conexão com o MongoDB:', err);
    throw err;
  }
}


module.exports = connectMongo;

const { MongoClient } = require('mongodb');

// URL do cluster MongoDB
const uri = 'mongodb+srv://renatospessotto:Q7MXczItG8ILl4HJ@clusterdesenvolvimentow.jc6sory.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDesenvolvimentoWeb';

const client = new MongoClient(uri);

async function connectMongo() {
  try {
    if (!client.topology?.isConnected()) {
      await client.connect();
    }
    return client.db('meu_banco_web'); // Nome do banco de dados
  } catch (err) {
    console.error('❌ Erro na conexão com o MongoDB:', err);
    throw err;
  }
}

module.exports = connectMongo;
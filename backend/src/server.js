const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Importar as rotas separadas
const produtosRoutes = require('./routes/produtos');
const carrinhoRoutes = require('./routes/carrinho');
const pedidosRoutes = require('./routes/pedidos');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

app.use(cors());
app.use(express.json());

// Usar as rotas separadas
app.use(produtosRoutes);
app.use(carrinhoRoutes);
app.use(pedidosRoutes);
app.use(usuariosRoutes);

// Servir arquivos estáticos
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// String de conexão com o MongoDB
const uri = 'mongodb+srv://renatospessotto:Q7MXczItG8ILl4HJ@clusterdesenvolvimentow.jc6sory.mongodb.net/meu_banco_web?retryWrites=true&w=majority&appName=ClusterDesenvolvimentoWeb';

// Conectar ao MongoDB Atlas
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Conectado ao MongoDB Atlas com sucesso');

    // Só inicia o servidor após a conexão com o banco
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB Atlas:', err);
  });

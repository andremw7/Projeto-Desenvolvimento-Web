const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Importar as rotas separadas
// Import separate route files
const produtosRoutes = require('./routes/produtos');
const carrinhoRoutes = require('./routes/carrinho');
const pedidosRoutes = require('./routes/pedidos');
const usuariosRoutes = require('./routes/usuarios');

const app = express();

// Habilitar CORS e JSON
// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Usar as rotas separadas
// Use separate route handlers
app.use(produtosRoutes);
app.use(carrinhoRoutes);
app.use(pedidosRoutes);
app.use(usuariosRoutes);

// Servir arquivos estáticos (imagens, etc.)
// Serve static files (images, etc.)
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// String de conexão com o MongoDB
// MongoDB connection string
const uri = 'mongodb+srv://renatospessotto:Q7MXczItG8ILl4HJ@clusterdesenvolvimentow.jc6sory.mongodb.net/meu_banco_web?retryWrites=true&w=majority&appName=ClusterDesenvolvimentoWeb';

// Conectar ao MongoDB Atlas e iniciar o servidor
// Connect to MongoDB Atlas and start server
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Conectado ao MongoDB Atlas com sucesso');
    
   
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB Atlas:', err);
  });

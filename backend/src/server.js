const express = require('express');
const cors = require('cors');
const path = require('path');

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

// Servir arquivos estáticos (se necessário)
app.use('/assets', express.static(path.join(__dirname, '../assets')));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
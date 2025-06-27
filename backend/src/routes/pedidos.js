const express = require('express');
const connectMongo = require('../mongoClient');

const router = express.Router();

// PT: Rota para finalizar uma compra, validar e atualizar estoque
// EN: Route to finalize a purchase, validates and updates stock
router.post('/finalizarCompra', async (req, res) => {
  const { userId } = req.body;

  try {
    const db = await connectMongo();
    const carrinhoCollection = db.collection('carrinho');
    const produtosCollection = db.collection('produtos');
    const pedidosCollection = db.collection('pedidos');

    // PT: Busca itens do carrinho do usuário
    // EN: Retrieves user's cart items
    const userCart = await carrinhoCollection.find({ userId: parseInt(userId, 10) }).toArray();
    if (!userCart.length) {
      return res.status(400).json({ error: 'Carrinho vazio.' });
    }

    const produtos = await produtosCollection.find({}).toArray();
    for (const item of userCart) {
      const produto = produtos.find(p => p.id === item.id && !p.excluido);
      if (!produto) {
        return res.status(404).json({ error: `Produto com id ${item.id} não encontrado.` });
      }
      if (produto.estoque < item.quantity) {
        return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome || produto.id}.` });
      }

      await produtosCollection.updateOne(
        { id: item.id },
        { $inc: { estoque: -item.quantity } }
      );
    }

    // PT: Gera novo pedido com base nos itens do carrinho
    // EN: Generates new order based on cart items
    const pedidoId = await pedidosCollection.countDocuments() + 1;
    const totalPrice = userCart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
    const novoPedido = {
      pedidoId,
      usuarioId: parseInt(userId, 10),
      dataCompra: new Date().toISOString(),
      totalPrice,
      itens: userCart.map(item => ({
        produtoId: item.id,
        quantidade: item.quantity,
        preco: item.preco
      }))
    };
    await pedidosCollection.insertOne(novoPedido);
    await carrinhoCollection.deleteMany({ userId: parseInt(userId, 10) });

    res.status(200).json({ message: 'Compra finalizada com sucesso.', pedido: novoPedido });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao finalizar a compra.' });
  }
});

// PT: Rota para buscar o status de uma compra específica do usuário logado
// EN: Route to retrieve the status of a specific purchase for the logged-in user
router.get('/status-compra/:pedidoId', async (req, res) => {
  const { pedidoId } = req.params;
  const userId = req.headers['x-user-id'] ? parseInt(req.headers['x-user-id'], 10) : undefined;

  if (!userId) {
    return res.status(400).json({ error: 'userId não fornecido.' });
  }

  try {
    const db = await connectMongo();
    const pedido = await db.collection('pedidos').findOne({ pedidoId: parseInt(pedidoId, 10), usuarioId: userId });
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado ou não pertence ao usuário.' });
    }

    res.status(200).json({
      pedidoId: pedido.pedidoId,
      usuarioId: pedido.usuarioId,
      dataCompra: pedido.dataCompra,
      status: 'aprovado',
      itens: pedido.itens,
      totalPrice: pedido.totalPrice
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o pedido.' });
  }
});

// PT: Rota para listar todas as compras de um usuário
// EN: Route to list all purchases made by a user
router.get('/compras/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const db = await connectMongo();

    const compras = await db.collection('pedidos').find({ usuarioId: parseInt(userId, 10) }).toArray();

    if (!compras.length) {
      return res.status(404).json({ error: 'Nenhuma compra encontrada para este usuário.' });
    }

    res.status(200).json(compras);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as compras.' });
  }
});

// PT: Rota para listar todos os pedidos (admin)
// EN: Route to list all orders (admin)
router.get('/admin/pedidos', async (req, res) => {
  try {
    const db = await connectMongo();
    const pedidos = await db.collection('pedidos').find().sort({ dataCompra: -1 }).toArray();

    res.status(200).json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os pedidos.' });
  }
});

// PT: Rota para buscar detalhes de um pedido específico pelo ID (admin)
// EN: Route to fetch details of a specific order by ID (admin)
router.get('/admin/pedido/:pedidoId', async (req, res) => {
  const { pedidoId } = req.params;

  try {
    const db = await connectMongo();
    const pedido = await db.collection('pedidos').findOne({ pedidoId: parseInt(pedidoId, 10) });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    res.status(200).json({
      pedidoId: pedido.pedidoId,
      usuarioId: pedido.usuarioId,
      dataCompra: pedido.dataCompra,
      status: 'aprovado',
      itens: pedido.itens,
      totalPrice: pedido.totalPrice
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o pedido.' });
  }
});

module.exports = router;

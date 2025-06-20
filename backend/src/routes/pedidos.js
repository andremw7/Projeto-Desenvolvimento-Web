const express = require('express');
const connectMongo = require('../mongoClient');

const router = express.Router();

// Rota para finalizar uma compra
router.post('/finalizarCompra', async (req, res) => {
  const { userId } = req.body;
  try {
    const db = await connectMongo();
    const carrinhoCollection = db.collection('carrinho');
    const produtosCollection = db.collection('produtos');
    const pedidosCollection = db.collection('pedidos');

    // Busca itens do carrinho do usuário
    const userCart = await carrinhoCollection.find({ userId }).toArray();
    if (!userCart.length) {
      return res.status(400).json({ error: 'Carrinho vazio.' });
    }

    // Valida estoque e atualiza
    for (const item of userCart) {
      const produto = await produtosCollection.findOne({ id: item.id, excluido: { $ne: true } });
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

    // Gera novo pedido
    const totalPrice = userCart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
    const novoPedido = {
      pedidoId: await pedidosCollection.countDocuments() + 1,
      usuarioId: userId,
      dataCompra: new Date().toISOString(),
      totalPrice,
      itens: userCart.map(item => ({
        produtoId: item.id,
        quantidade: item.quantity,
        preco: item.preco
      }))
    };
    await pedidosCollection.insertOne(novoPedido);

    // Limpa carrinho do usuário
    await carrinhoCollection.deleteMany({ userId });

    res.status(200).json({ message: 'Compra finalizada com sucesso.', pedido: novoPedido });
  } catch (error) {
    console.error('Erro ao finalizar a compra:', error);
    res.status(500).json({ error: 'Erro ao finalizar a compra.' });
  }
});

// Rota para buscar o status de uma compra específica do usuário logado
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

    res.status(200).json(pedido);
  } catch (error) {
    console.error('Erro ao buscar o pedido:', error);
    res.status(500).json({ error: 'Erro ao buscar o pedido.' });
  }
});

// Rota para listar todas as compras de um usuário
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
    console.error('Erro ao buscar as compras:', error);
    res.status(500).json({ error: 'Erro ao buscar as compras.' });
  }
});

// Rota para listar todos os pedidos (admin)
router.get('/admin/pedidos', async (req, res) => {
  try {
    const db = await connectMongo();
    const pedidos = await db.collection('pedidos').find().sort({ dataCompra: -1 }).toArray();
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar os pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar os pedidos.' });
  }
});

// Rota para buscar detalhes de um pedido específico (admin)
router.get('/admin/pedido/:pedidoId', async (req, res) => {
  const { pedidoId } = req.params;
  try {
    const db = await connectMongo();
    const pedido = await db.collection('pedidos').findOne({ pedidoId: parseInt(pedidoId, 10) });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    res.status(200).json(pedido);
  } catch (error) {
    console.error('Erro ao buscar o pedido:', error);
    res.status(500).json({ error: 'Erro ao buscar o pedido.' });
  }
});

module.exports = router;

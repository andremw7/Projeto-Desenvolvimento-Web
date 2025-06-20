const express = require('express');
const connectMongo = require('../mongoClient');

const router = express.Router();

// Rota para listar os itens do carrinho de um usuário
router.get('/carrinho/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const db = await connectMongo();
    const carrinho = await db.collection('carrinho').find({ userId: parseInt(userId, 10) }).toArray();
    res.status(200).json(carrinho);
  } catch (error) {
    console.error('Erro ao carregar o carrinho:', error);
    res.status(500).json({ error: 'Erro ao carregar o carrinho.' });
  }
});

// Rota para adicionar um produto ao carrinho
router.post('/addCarrinho/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const db = await connectMongo();
    const produtosCollection = db.collection('produtos');
    const carrinhoCollection = db.collection('carrinho');

    const produto = await produtosCollection.findOne({ id: parseInt(id, 10), excluido: { $ne: true } });
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
    }

    const existingItem = await carrinhoCollection.findOne({ id: parseInt(id, 10), userId });
    if (existingItem) {
      if (existingItem.quantity < produto.estoque) {
        await carrinhoCollection.updateOne(
          { id: parseInt(id, 10), userId },
          { $inc: { quantity: 1 } }
        );
      } else {
        return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
      }
    } else {
      if (produto.estoque > 0) {
        await carrinhoCollection.insertOne({
          id: parseInt(id, 10),
          userId,
          quantity: 1,
          preco: produto.preco,
          nome: produto.nome
        });
      } else {
        return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
      }
    }

    res.status(200).json({ message: 'Produto adicionado ao carrinho com sucesso.' });
  } catch (error) {
    console.error('Erro ao adicionar o produto ao carrinho:', error);
    res.status(500).json({ error: 'Erro ao adicionar o produto ao carrinho.' });
  }
});

// Rota para atualizar a quantidade de um produto no carrinho
router.put('/updateCart', async (req, res) => {
  const { productId, change, userId } = req.body;
  try {
    const db = await connectMongo();
    const produtosCollection = db.collection('produtos');
    const carrinhoCollection = db.collection('carrinho');

    const produto = await produtosCollection.findOne({ id: productId, excluido: { $ne: true } });
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
    }

    const carrinhoItem = await carrinhoCollection.findOne({ id: productId, userId });
    if (!carrinhoItem) {
      return res.status(404).json({ error: 'Produto não encontrado no carrinho.' });
    }

    const novaQuantidade = carrinhoItem.quantity + change;
    if (novaQuantidade > produto.estoque) {
      return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
    }
    if (novaQuantidade < 1) {
      return res.status(400).json({ error: 'A quantidade mínima é 1.' });
    }

    await carrinhoCollection.updateOne(
      { id: productId, userId },
      { $set: { quantity: novaQuantidade } }
    );

    res.status(200).json({ message: 'Quantidade atualizada com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar o carrinho:', error);
    res.status(500).json({ error: 'Erro ao atualizar o carrinho.' });
  }
});

// Rota para remover um produto do carrinho do usuário
router.post('/removeItem', async (req, res) => {
  const { productId, userId } = req.body;
  try {
    const db = await connectMongo();
    const carrinhoCollection = db.collection('carrinho');

    await carrinhoCollection.deleteOne({ id: productId, userId });

    res.status(200).json({ message: 'Produto removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover o produto do carrinho:', error);
    res.status(500).json({ error: 'Erro ao remover o produto do carrinho.' });
  }
});

module.exports = router;

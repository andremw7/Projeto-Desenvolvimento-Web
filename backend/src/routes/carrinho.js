const express = require('express');
const connectMongo = require('../mongoClient');

const router = express.Router();

// PT: Rota para listar os itens do carrinho de um usuário
// EN: Route to list the items in a user's cart
router.get('/carrinho/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const db = await connectMongo();
    const carrinhoCollection = db.collection('carrinho');

    // PT: Busca todos os itens do carrinho associados ao userId
    // EN: Finds all cart items associated with the userId
    const userCart = await carrinhoCollection.find({ userId: parseInt(userId, 10) }).toArray();

    res.status(200).json(userCart);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar o carrinho.' });
  }
});

// PT: Rota para adicionar um produto ao carrinho
// EN: Route to add a product to the cart
router.post('/addCarrinho/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const db = await connectMongo();
    const produtosCollection = db.collection('produtos');
    const carrinhoCollection = db.collection('carrinho');

    const produtoId = parseInt(id, 10);
    if (isNaN(produtoId) || !userId) {
      return res.status(400).json({ error: 'ID do produto ou do usuário inválido.' });
    }

    // PT: Verifica se o produto existe e não está marcado como excluído
    // EN: Checks if the product exists and is not marked as deleted
    const produto = await produtosCollection.findOne({ id: produtoId, excluido: { $ne: true } });
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
    }

    // PT: Verifica se o item já está no carrinho do usuário e atualiza a quantidade
    // EN: Checks if the item already exists in the user's cart and update the quantity
    const existingItem = await carrinhoCollection.findOne({ id: produtoId, userId: parseInt(userId, 10) });

    if (existingItem) {
      if (existingItem.quantity < produto.estoque) {
        await carrinhoCollection.updateOne(
          { id: produtoId, userId: parseInt(userId, 10) },
          { $inc: { quantity: 1 } }
        );
      } else {
        return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
      }
    } else {
      if (produto.estoque > 0) {
        await carrinhoCollection.insertOne({
          ...produto,
          userId: parseInt(userId, 10),
          quantity: 1,
        });
      } else {
        return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
      }
    }

    res.status(200).json({ message: 'Produto adicionado ao carrinho com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro inesperado ao adicionar o produto ao carrinho.' });
  }
});

// PT: Rota para atualizar a quantidade de um produto no carrinho
// EN: Route to update the quantity of a product in the cart
router.put('/updateCart', async (req, res) => {
  const { productId, change, userId } = req.body;

  try {
    const db = await connectMongo();
    const carrinhoCollection = db.collection('carrinho');
    const produtosCollection = db.collection('produtos');

    // PT: Busca o item do carrinho
    // EN: Finds the cart item
    const produtoCarrinho = await carrinhoCollection.findOne({ id: productId, userId: parseInt(userId, 10) });
    if (!produtoCarrinho) {
      return res.status(404).json({ error: 'Produto não encontrado no carrinho.' });
    }

    // PT: Busca o produto no estoque
    // EN: Finds the product in the database
    const produto = await produtosCollection.findOne({ id: productId, excluido: { $ne: true } });
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
    }

    const novaQuantidade = produtoCarrinho.quantity + change;

    if (novaQuantidade > produto.estoque) {
      return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
    }
    if (novaQuantidade < 1) {
      return res.status(400).json({ error: 'A quantidade mínima é 1.' });
    }
    await carrinhoCollection.updateOne(
      { id: productId, userId: parseInt(userId, 10) },
      { $set: { quantity: novaQuantidade } }
    );

    res.status(200).json({ message: 'Quantidade atualizada com sucesso.', produtoCarrinho });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o carrinho.' });
  }
});

// PT: Rota para remover um produto do carrinho do usuário
// EN: Route to remove a product from the user's cart
router.post('/removeItem', async (req, res) => {
  const { productId, userId } = req.body;

  try {
    const db = await connectMongo();
    const carrinhoCollection = db.collection('carrinho');

    await carrinhoCollection.deleteOne({ id: productId, userId: parseInt(userId, 10) });

    res.status(200).json({ message: 'Produto removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover o produto do carrinho.' });
  }
});

module.exports = router;

const express = require('express');
const connectMongo = require('../mongoClient');

const router = express.Router();

// Rota para listar todos os produtos disponíveis (não excluídos)
router.get('/produtos', async (req, res) => {
  try {
    const db = await connectMongo();
    const produtos = await db.collection('produtos').find({ excluido: { $ne: true } }).toArray();
    res.status(200).json(produtos);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

// Rota para buscar informações de um produto específico pelo ID
router.get('/produto/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectMongo();
    const produto = await db.collection('produtos').findOne({ id: parseInt(id, 10), excluido: { $ne: true } });
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
    }
    res.status(200).json(produto);
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    res.status(500).json({ error: 'Erro ao buscar produto.' });
  }
});

// Rota para adicionar um novo produto ao catálogo
router.post('/admin/add-produto', async (req, res) => {
  const { nome, preco, faixaEtaria, descricao, tipo, marca, imagem, estoque } = req.body;
  try {
    const db = await connectMongo();
    const collection = db.collection('produtos');
    const ultimoProduto = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const novoId = ultimoProduto.length > 0 ? ultimoProduto[0].id + 1 : 1;

    const novoProduto = {
      id: novoId,
      nome,
      preco: parseFloat(preco),
      faixaEtaria,
      descricao,
      tipo,
      marca,
      excluido: false,
      imagem,
      estoque: parseInt(estoque, 10),
    };

    await collection.insertOne(novoProduto);
    res.status(201).json({ message: 'Produto adicionado com sucesso.', produto: novoProduto });
  } catch (err) {
    console.error('Erro ao adicionar produto:', err);
    res.status(500).json({ error: 'Erro ao adicionar produto.' });
  }
});

// Rota para editar um produto existente
router.put('/admin/edit-produto/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, preco, faixaEtaria, descricao, tipo, marca, imagem, estoque } = req.body;
  try {
    const db = await connectMongo();
    const collection = db.collection('produtos');
    const produto = await collection.findOne({ id: parseInt(id, 10), excluido: { $ne: true } });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
    }

    const atualizacao = {
      ...(nome && { nome }),
      ...(preco && { preco: parseFloat(preco) }),
      ...(faixaEtaria && { faixaEtaria }),
      ...(descricao && { descricao }),
      ...(tipo && { tipo }),
      ...(marca && { marca }),
      ...(imagem && { imagem }),
      ...(estoque && { estoque: parseInt(estoque, 10) }),
    };

    await collection.updateOne({ id: parseInt(id, 10) }, { $set: atualizacao });
    res.status(200).json({ message: 'Produto atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
});

// Rota para excluir (marcar como excluído) um produto
router.delete('/admin/delete-produto/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectMongo();
    const collection = db.collection('produtos');
    const produto = await collection.findOne({ id: parseInt(id, 10) });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    await collection.updateOne({ id: parseInt(id, 10) }, { $set: { excluido: true } });
    res.status(200).json({ message: 'Produto excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    res.status(500).json({ error: 'Erro ao excluir produto.' });
  }
});

module.exports = router;

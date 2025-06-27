const express = require('express');
const connectMongo = require('../mongoClient');

const router = express.Router();

const multer = require('multer');
const path = require('path');

// PT: Configuração de armazenamento do multer para salvar arquivos de imagem no diretório /uploads
// EN: Multer storage configuration to save image files to the /uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });


// PT: Rota para listar todos os produtos disponíveis (não excluídos)
// EN: Route to list all available (non-deleted) products
router.get('/produtos', async (req, res) => {
  try {
    const db = await connectMongo();
    const produtosCollection = db.collection('produtos');
    const produtos = await produtosCollection.find({ excluido: { $ne: true } }).toArray();
    res.status(200).json(produtos);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

// PT: Rota para buscar informações de um produto específico pelo ID
// EN: Route to get information for a specific product by ID
router.get('/produto/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectMongo();
    const produtosCollection = db.collection('produtos');
    const produto = await produtosCollection.findOne({ id: parseInt(id, 10), excluido: { $ne: true } });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
    }

    res.status(200).json(produto);
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    res.status(500).json({ error: 'Erro ao buscar produto.' });
  }
});

// PT: Rota para adicionar um novo produto ao catálogo
// EN: Route to add a new product to the catalog
router.post('/admin/add-produto', upload.single('imagem'), async (req, res) => {
  const { nome, preco, faixaEtaria, descricao, tipo, marca, estoque } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const db = await connectMongo();
    const produtosCollection = db.collection('produtos');

    // PT: Busca o último produto para gerar o próximo ID
    // EN: Gets the last product to generate the next ID
    const ultimoProduto = await produtosCollection.find().sort({ id: -1 }).limit(1).toArray();
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

    // PT: Insere o novo produto na coleção
    // EN: Inserts the new product into the collection
    await produtosCollection.insertOne(novoProduto);

    res.status(201).json({ message: 'Produto adicionado com sucesso.', produto: novoProduto });
  } catch (err) {
    console.error('Erro ao adicionar produto:', err);
    res.status(500).json({ error: 'Erro ao adicionar produto.' });
  }
});

// PT: Rota para editar um produto existente
// EN: Route to edit an existing product
router.put('/admin/edit-produto/:id', upload.single('imagem'), async (req, res) => {
  const { id } = req.params;
  const { nome, preco, faixaEtaria, descricao, tipo, marca, estoque } = req.body;
  const imagem = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const db = await connectMongo();
    const produtosCollection = db.collection('produtos');

    // PT: Verifica se o produto existe e não está excluído
    // EN: Verifies if the product exists and is not marked as deleted
    const produto = await produtosCollection.findOne({ id: parseInt(id, 10), excluido: { $ne: true } });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
    }

    // PT: Constrói o objeto de atualização apenas com os campos fornecidos
    // EN: Builds the update object using only provided fields
    const atualizacao = {
      ...(nome && { nome }),
      ...(preco && { preco: parseFloat(preco) }),
      ...(faixaEtaria && { faixaEtaria }),
      ...(descricao && { descricao }),
      ...(tipo && { tipo }),
      ...(marca && { marca }),
      ...(estoque && { estoque: parseInt(estoque, 10) }),
    };

    if (imagem) {
      atualizacao.imagem = imagem;
    }

    await produtosCollection.updateOne({ id: parseInt(id, 10) }, { $set: atualizacao });

    res.status(200).json({ message: 'Produto atualizado com sucesso.', produto });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
});

// PT: Rota para excluir (marcar como excluído) um produto
// EN: Route to delete (soft delete) a product
router.delete('/admin/delete-produto/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const db = await connectMongo();
    const produtosCollection = db.collection('produtos');

    // PT: Verifica se o produto existe
    // EN: Checks if the product exists
    const produto = await produtosCollection.findOne({ id: parseInt(id, 10) });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // PT: Marca o produto como excluído (soft delete)
    // EN: Marks the product as deleted (soft delete)
    await produtosCollection.updateOne({ id: parseInt(id, 10) }, { $set: { excluido: true } });

    res.status(200).json({ message: 'Produto excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    res.status(500).json({ error: 'Erro ao excluir produto.' });
  }
});

module.exports = router;

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const bancoJsonPath = path.join(__dirname, '../../banco_json'); // Caminho para os arquivos JSON

// Rota para listar todos os produtos disponíveis (não excluídos)
router.get('/produtos', (req, res) => {
    const filePath = path.join(bancoJsonPath, 'produtos.json');
    try {
        // Lê todos os produtos do arquivo JSON
        const data = fs.readFileSync(filePath, 'utf8');
        // Filtra produtos não excluídos
        const produtos = JSON.parse(data).filter(produto => !produto.excluido);
        res.status(200).json(produtos);
    } catch (err) {
        console.error('Erro ao ler o arquivo de produtos:', err);
        res.status(500).json({ error: 'Erro ao ler o arquivo de produtos.' });
    }
});

// Rota para buscar informações de um produto específico pelo ID
router.get('/produto/:id', (req, res) => {
    const { id } = req.params;
    const produtosPath = path.join(bancoJsonPath, 'produtos.json');

    try {
        // Lê todos os produtos
        const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));
        // Busca produto pelo ID e verifica se não está excluído
        const produto = produtos.find(produto => produto.id === parseInt(id, 10) && !produto.excluido);

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
        }

        res.status(200).json(produto);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o produto.' });
    }
});

// Rota para adicionar um novo produto ao catálogo
router.post('/admin/add-produto', (req, res) => {
    const produtosPath = path.join(bancoJsonPath, 'produtos.json');
    const { nome, preco, faixaEtaria, descricao, tipo, marca, imagem, estoque } = req.body;

    try {
        // Lê todos os produtos existentes
        const produtos = fs.existsSync(produtosPath)
            ? JSON.parse(fs.readFileSync(produtosPath, 'utf-8'))
            : [];

        // Gera novo ID incremental
        const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
        // Cria objeto do novo produto
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

        produtos.push(novoProduto);
        fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));

        res.status(201).json({ message: 'Produto adicionado com sucesso.', produto: novoProduto });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar o produto.' });
    }
});

// Rota para editar um produto existente
router.put('/admin/edit-produto/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, faixaEtaria, descricao, tipo, marca, imagem, estoque } = req.body;
    const produtosPath = path.join(bancoJsonPath, 'produtos.json');

    try {
        // Lê todos os produtos
        const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));
        // Busca produto pelo ID e verifica se não está excluído
        const produto = produtos.find(produto => produto.id === parseInt(id, 10) && !produto.excluido);

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
        }

        // Atualiza apenas os campos enviados
        produto.nome = nome || produto.nome;
        produto.preco = parseFloat(preco) || produto.preco;
        produto.faixaEtaria = faixaEtaria || produto.faixaEtaria;
        produto.descricao = descricao || produto.descricao;
        produto.tipo = tipo || produto.tipo;
        produto.marca = marca || produto.marca;
        produto.imagem = imagem || produto.imagem;
        produto.estoque = parseInt(estoque, 10) || produto.estoque;

        fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));
        res.status(200).json({ message: 'Produto atualizado com sucesso.', produto });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o produto.' });
    }
});

// Rota para excluir (marcar como excluído) um produto
router.delete('/admin/delete-produto/:id', (req, res) => {
    const { id } = req.params;
    const produtosPath = path.join(bancoJsonPath, 'produtos.json');

    try {
        // Lê todos os produtos
        const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));
        // Busca índice do produto pelo ID
        const produtoIndex = produtos.findIndex(produto => produto.id === parseInt(id, 10));

        if (produtoIndex === -1) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        // Marca como excluído (soft delete)
        produtos[produtoIndex].excluido = true;
        fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));

        res.status(200).json({ message: 'Produto excluído com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir o produto.' });
    }
});

module.exports = router;

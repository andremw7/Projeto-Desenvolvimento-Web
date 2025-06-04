const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const bancoJsonPath = path.join(__dirname, '../../banco_json'); // Caminho para os arquivos JSON

// Rota para listar os itens do carrinho de um usuário
// Busca todos os itens do carrinho.json e filtra pelo userId
router.get('/carrinho/:userId', (req, res) => {
    const { userId } = req.params;
    const carrinhoPath = path.join(bancoJsonPath, 'carrinho.json');
    try {
        if (!fs.existsSync(carrinhoPath)) {
            fs.writeFileSync(carrinhoPath, JSON.stringify([])); // Inicializa o arquivo se não existir
        }
        const carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        // Filtra apenas os itens do usuário
        const userCart = carrinho.filter(item => item.userId === parseInt(userId, 10));
        res.status(200).json(userCart);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar o carrinho.' });
    }
});

// Rota para adicionar um produto ao carrinho
// Se o produto já existe, incrementa a quantidade (respeitando o estoque). Caso contrário, adiciona novo item.
router.post('/addCarrinho/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body; // ID do usuário enviado no corpo da requisição

    const produtosPath = path.join(bancoJsonPath, 'produtos.json');
    const carrinhoPath = path.join(bancoJsonPath, 'carrinho.json');

    try {
        const produtoId = parseInt(id, 10);
        if (isNaN(produtoId) || !userId) {
            return res.status(400).json({ error: 'ID do produto ou do usuário inválido.' });
        }

        if (!fs.existsSync(produtosPath)) {
            return res.status(500).json({ error: 'Arquivo produtos.json não encontrado.' });
        }

        // Busca o produto pelo ID
        const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));
        const produto = produtos.find(produto => produto.id === produtoId && !produto.excluido);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
        }

        // Carrega o carrinho do usuário
        let carrinho = fs.existsSync(carrinhoPath)
            ? JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'))
            : [];

        // Verifica se o produto já está no carrinho
        const existingItem = carrinho.find(item => item.id === produtoId && item.userId === userId);
        if (existingItem) {
            // Atualiza quantidade, respeitando o estoque
            if (existingItem.quantity < produto.estoque) {
                existingItem.quantity += 1;
            } else {
                return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
            }
        } else {
            // Adiciona novo produto ao carrinho
            if (produto.estoque > 0) {
                carrinho.push({ ...produto, userId: parseInt(userId, 10), quantity: 1 });
            } else {
                return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
            }
        }

        fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2));
        res.status(200).json({ message: 'Produto adicionado ao carrinho com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro inesperado ao adicionar o produto ao carrinho.' });
    }
});

// Rota para atualizar a quantidade de um produto no carrinho
// Recebe o ID do produto, a mudança (+1 ou -1) e o userId. Atualiza a quantidade, respeitando o estoque e o mínimo de 1.
router.put('/updateCart', (req, res) => {
    const { productId, change, userId } = req.body;
    const carrinhoPath = path.join(bancoJsonPath, 'carrinho.json');
    const produtosPath = path.join(bancoJsonPath, 'produtos.json');

    try {
        // Busca o item no carrinho do usuário
        const carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        const produtoCarrinho = carrinho.find(item => item.id === productId && item.userId === userId);

        if (!produtoCarrinho) {
            return res.status(404).json({ error: 'Produto não encontrado no carrinho.' });
        }

        // Busca o produto para validar estoque
        const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));
        const produto = produtos.find(p => p.id === productId && !p.excluido);

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
        }

        // Calcula nova quantidade e valida limites
        const novaQuantidade = produtoCarrinho.quantity + change;
        if (novaQuantidade > produto.estoque) {
            return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
        }
        if (novaQuantidade < 1) {
            return res.status(400).json({ error: 'A quantidade mínima é 1.' });
        }

        produtoCarrinho.quantity = novaQuantidade;

        fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2));
        res.status(200).json({ message: 'Quantidade atualizada com sucesso.', produtoCarrinho });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o carrinho.' });
    }
});

// Rota para remover um produto do carrinho do usuário
// Remove o item do carrinho com base no productId e userId
router.post('/removeItem', (req, res) => {
    const { productId, userId } = req.body;
    const carrinhoPath = path.join(bancoJsonPath, 'carrinho.json');
    try {
        let carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        // Remove o item do carrinho do usuário
        carrinho = carrinho.filter(item => item.id !== productId || item.userId !== userId);
        fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2));
        res.status(200).json({ message: 'Produto removido com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover o produto do carrinho.' });
    }
});

module.exports = router;

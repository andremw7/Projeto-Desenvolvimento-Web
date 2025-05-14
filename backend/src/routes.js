const express = require('express');
const cors = require('cors'); // Adicionado para resolver problemas de CORS
const fs = require('fs');
const path = require('path');

const routes = express.Router();

// Adicione o middleware CORS
routes.use(cors());

// Middleware para armazenar o ID do usuário logado no req.userId
routes.use((req, res, next) => {
    const loggedUserId = req.headers['x-user-id']; // Supondo que o ID do usuário logado seja enviado no cabeçalho
    if (loggedUserId) {
        req.userId = parseInt(loggedUserId, 10);
    }
    next();
});

routes.post('/login', (req, res) => {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'usuarios.json'), 'utf-8'));
    const user = users.find(user => user.username === username && user.password === password && !user.excluido);
    if (user) {
        return res.status(200).json({ message: 'Login successful', userId: user.id });
    }
    else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});

routes.get('/produtos', (req, res) => {
    const filePath = path.join(__dirname, 'produtos.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo de produtos.' });
        }
        const produtos = JSON.parse(data).filter(produto => !produto.excluido);
        res.json(produtos);
    });
});

routes.post('/addCarrinho/:id', (req, res) => {
    const { id } = req.params;

    const produtosPath = path.join(__dirname, 'produtos.json');
    const carrinhoPath = path.join(__dirname, 'carrinho.json');

    try {
        const produtoId = parseInt(id, 10);
        if (isNaN(produtoId)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!fs.existsSync(produtosPath)) {
            return res.status(500).json({ error: 'Arquivo produtos.json não encontrado.' });
        }

        const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));
        const produto = produtos.find(produto => produto.id === produtoId && !produto.excluido);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
        }

        let carrinho = [];
        if (fs.existsSync(carrinhoPath)) {
            try {
                const carrinhoData = fs.readFileSync(carrinhoPath, 'utf-8');
                carrinho = JSON.parse(carrinhoData);
            } catch (error) {
                return res.status(500).json({ error: 'Erro ao ler o arquivo carrinho.json.' });
            }
        } else {
            fs.writeFileSync(carrinhoPath, JSON.stringify([]));
        }

        // Adicionar o campo quantity com valor inicial 1
        carrinho.push({ ...produto, quantity: 1 });
        try {
            fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2));
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao escrever no arquivo carrinho.json.' });
        }

        res.status(200).json();
    } catch (error) {
        res.status(500).json({ error: 'Erro inesperado ao adicionar o produto ao carrinho.' });
    }
});

routes.get('/carrinho', (req, res) => {
    const carrinhoPath = path.join(__dirname, 'carrinho.json');
    try {
        if (!fs.existsSync(carrinhoPath)) {
            fs.writeFileSync(carrinhoPath, JSON.stringify([]));
        }
        const carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        res.status(200).json(carrinho);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar o carrinho.' });
    }
});

routes.post('/updateCart', (req, res) => {
    const { productId, change } = req.body;
    const carrinhoPath = path.join(__dirname, 'carrinho.json');
    try {
        const carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        const produto = carrinho.find(item => item.id === productId);
        if (produto) {
            produto.quantity = Math.max(1, (produto.quantity || 1) + change);
            fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2));
            res.status(200).json({ message: 'Quantidade atualizada com sucesso.' });
        } else {
            res.status(404).json({ error: 'Produto não encontrado no carrinho.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o carrinho.' });
    }
});

routes.post('/removeItem', (req, res) => {
    const { productId } = req.body;
    const carrinhoPath = path.join(__dirname, 'carrinho.json');
    try {
        let carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        carrinho = carrinho.filter(item => item.id !== productId);
        fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2));
        res.status(200).json({ message: 'Produto removido com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover o produto do carrinho.' });
    }
});

routes.get('/usuario/:id', (req, res) => {
    const userId = req.userId || req.params.id; // Priorizar o ID armazenado no middleware

    try {
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'usuarios.json'), 'utf-8'));
        const user = users.find(user => user.id === parseInt(userId, 10) && !user.excluido);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado ou excluído.' });
        }

        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            admin: user.admin,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
        };

        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar informações do usuário.' });
    }
});

routes.get('/produto/:id', (req, res) => {
    const { id } = req.params;
    const produtosPath = path.join(__dirname, 'produtos.json');

    try {
        const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));
        const produto = produtos.find(produto => produto.id === parseInt(id, 10) && !produto.excluido);

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
        }

        res.status(200).json(produto);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o produto.' });
    }
});

module.exports = routes;
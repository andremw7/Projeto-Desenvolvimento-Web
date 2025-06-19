const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const bancoJsonPath = path.join(__dirname, '../../banco_json'); // Caminho para os arquivos JSON

// Rota para finalizar uma compra
// Move os itens do carrinho para pedidos, atualiza estoque e limpa o carrinho do usuário
router.post('/finalizarCompra', (req, res) => {
    const carrinhoPath = path.join(bancoJsonPath, 'carrinho.json');
    const produtosPath = path.join(bancoJsonPath, 'produtos.json');
    const pedidosPath = path.join(bancoJsonPath, 'pedidos.json');
    const { userId } = req.body;

    try {
        // Verifica se o carrinho existe e carrega os itens do usuário
        if (!fs.existsSync(carrinhoPath)) {
            return res.status(400).json({ error: 'Carrinho vazio.' });
        }
        const carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        const userCart = carrinho.filter(item => item.userId === userId);
        if (!userCart.length) {
            return res.status(400).json({ error: 'Carrinho vazio.' });
        }

        // Lê todos os produtos e valida estoque
        const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));
        for (const item of userCart) {
            const produto = produtos.find(p => p.id === item.id && !p.excluido);
            if (!produto) {
                return res.status(404).json({ error: `Produto com id ${item.id} não encontrado.` });
            }
            if (produto.estoque < item.quantity) {
                return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome || produto.id}.` });
            }
            produto.estoque -= item.quantity; // Atualiza estoque
        }
        fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));

        // Lê pedidos existentes e gera novo pedido
        let pedidos = fs.existsSync(pedidosPath)
            ? JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'))
            : [];
        const pedidoId = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.pedidoId)) + 1 : 1;
        const totalPrice = userCart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);

        // Monta objeto do novo pedido
        const novoPedido = {
            pedidoId,
            usuarioId: userId,
            dataCompra: new Date().toISOString(),
            totalPrice,
            itens: userCart.map(item => ({
                produtoId: item.id,
                quantidade: item.quantity,
                preco: item.preco
            }))
        };
        pedidos.push(novoPedido);

        // Salva pedidos e limpa carrinho do usuário
        fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));
        const updatedCarrinho = carrinho.filter(item => item.userId !== userId);
        fs.writeFileSync(carrinhoPath, JSON.stringify(updatedCarrinho, null, 2));

        res.status(200).json({ message: 'Compra finalizada com sucesso.', pedido: novoPedido });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao finalizar a compra.' });
    }
});

// Rota para buscar o status de uma compra específica do usuário logado
router.get('/status-compra/:pedidoId', (req, res) => {
    const { pedidoId } = req.params;
    // Lê o userId do header x-user-id (enviado pelo frontend)
    const userId = req.headers['x-user-id'] ? parseInt(req.headers['x-user-id'], 10) : undefined;
    const pedidosPath = path.join(bancoJsonPath, 'pedidos.json');

    if (!userId) {
        return res.status(400).json({ error: 'userId não fornecido.' });
    }

    try {
        // Lê todos os pedidos e busca o pedido do usuário logado
        const pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'));
        const pedido = pedidos.find(p => p.pedidoId === parseInt(pedidoId, 10) && p.usuarioId === userId);

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado ou não pertence ao usuário.' });
        }

        // Monta resposta detalhada do pedido
        const response = {
            pedidoId: pedido.pedidoId,
            usuarioId: pedido.usuarioId,
            dataCompra: pedido.dataCompra,
            status: 'aprovado',
            itens: pedido.itens.map(item => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                preco: item.preco
            })),
            totalPrice: pedido.totalPrice
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o pedido.' });
    }
});

// Rota para listar todas as compras de um usuário
router.get('/compras/:userId', (req, res) => {
    const { userId } = req.params;
    const pedidosPath = path.join(bancoJsonPath, 'pedidos.json');

    try {
        // Lê todos os pedidos e filtra pelos do usuário
        const pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'));
        const compras = pedidos.filter(p => p.usuarioId === parseInt(userId, 10));

        if (compras.length === 0) {
            return res.status(404).json({ error: 'Nenhuma compra encontrada para este usuário.' });
        }

        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar as compras.' });
    }
});

// Rota para listar todos os pedidos (admin)
router.get('/admin/pedidos', (req, res) => {
    const pedidosPath = path.join(bancoJsonPath, 'pedidos.json');

    try {
        // Lê todos os pedidos e ordena do mais recente para o mais antigo
        const pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'));
        const sortedPedidos = pedidos.sort((a, b) => new Date(b.dataCompra) - new Date(a.dataCompra));

        res.status(200).json(sortedPedidos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os pedidos.' });
    }
});

// Rota para buscar detalhes de um pedido específico (admin)
router.get('/admin/pedido/:pedidoId', (req, res) => {
    const { pedidoId } = req.params;
    const pedidosPath = path.join(bancoJsonPath, 'pedidos.json');

    try {
        // Lê todos os pedidos e busca pelo ID
        const pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'));
        const pedido = pedidos.find(p => p.pedidoId === parseInt(pedidoId, 10));

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        // Monta resposta detalhada do pedido
        const response = {
            pedidoId: pedido.pedidoId,
            usuarioId: pedido.usuarioId,
            dataCompra: pedido.dataCompra,
            status: 'aprovado',
            itens: pedido.itens.map(item => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                preco: item.preco
            })),
            totalPrice: pedido.totalPrice
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o pedido.' });
    }
});

module.exports = router;

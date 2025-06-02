const express = require('express');
const cors = require('cors'); // Adicionado para resolver problemas de CORS
const fs = require('fs');
const path = require('path');

const routes = express.Router();

// Certifique-se de que o middleware CORS está sendo aplicado corretamente
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

    try {
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'usuarios.json'), 'utf-8'));
        const user = users.find(user => 
            user.username === username && 
            user.password === password && 
            !user.excluido // Certificar-se de que o usuário não está excluído
        );

        if (user) {
            return res.status(200).json({ 
                message: 'Login successful', 
                userId: user.id, 
                admin: user.admin // Retornar o campo admin corretamente
            });
        } else {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }
    } catch (error) {
        console.error('Erro ao processar login:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

routes.post('/register', (req, res) => {
    const { username, email, password, confirmPassword, admin } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'As senhas não coincidem.' });
    }

    const usuariosPath = path.join(__dirname, 'usuarios.json');

    try {
        const usuarios = fs.existsSync(usuariosPath)
            ? JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'))
            : [];

        const userExists = usuarios.some(user => user.username === username || user.email === email);
        if (userExists) {
            return res.status(400).json({ error: 'Usuário ou e-mail já cadastrado.' });
        }

        const newUser = {
            id: usuarios.length > 0 ? Math.max(...usuarios.map(user => user.id)) + 1 : 1,
            username,
            email,
            password,
            admin: !!admin, // Define se o usuário será administrador
            createdAt: new Date().toISOString(),
            lastLogin: null,
            excluido: false
        };

        usuarios.push(newUser);
        fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));

        res.status(201).json({ message: 'Usuário registrado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar o usuário.' });
    }
});




routes.get('/produtos', (req, res) => {
    const filePath = path.join(__dirname, 'produtos.json');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const produtos = JSON.parse(data).filter(produto => !produto.excluido); // Certifique-se de que está filtrando corretamente
        res.status(200).json(produtos);
    } catch (err) {
        console.error('Erro ao ler o arquivo de produtos:', err);
        res.status(500).json({ error: 'Erro ao ler o arquivo de produtos.' });
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





routes.post('/finalizarCompra', (req, res) => {
    const carrinhoPath = path.join(__dirname, 'carrinho.json');
    const produtosPath = path.join(__dirname, 'produtos.json');
    const pedidosPath = path.join(__dirname, 'pedidos.json');
    const { userId } = req.body; // ID do usuário enviado no corpo da requisição

    try {
        // Carregar carrinho
        if (!fs.existsSync(carrinhoPath)) {
            return res.status(400).json({ error: 'Carrinho vazio.' });
        }
        const carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        const userCart = carrinho.filter(item => item.userId === userId); // Filtrar itens do carrinho pelo userId
        if (!userCart.length) {
            return res.status(400).json({ error: 'Carrinho vazio.' });
        }

        // Carregar produtos
        const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));

        // Atualizar estoque dos produtos
        for (const item of userCart) {
            const produto = produtos.find(p => p.id === item.id && !p.excluido);
            if (!produto) {
                return res.status(404).json({ error: `Produto com id ${item.id} não encontrado.` });
            }
            if (produto.estoque < item.quantity) {
                return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome || produto.id}.` });
            }
            produto.estoque -= item.quantity; // Subtrair quantidade do estoque
        }

        // Salvar produtos atualizados
        fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));

        // Carregar pedidos existentes
        let pedidos = [];
        if (fs.existsSync(pedidosPath)) {
            pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'));
        }

        // Gerar um pedidoId único
        const pedidoId = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.pedidoId)) + 1 : 1;

        // Calcular preço total
        const totalPrice = userCart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);

        // Adicionar novo pedido
        const novoPedido = {
            pedidoId, // Adicionar o pedidoId
            usuarioId: userId,
            dataCompra: new Date().toISOString(), // Adicionar a data da compra
            totalPrice, // Adicionar o preço total
            itens: userCart.map(item => ({
                produtoId: item.id,
                quantidade: item.quantity,
                preco: item.preco // Adicionar o preço unitário
            }))
        };
        pedidos.push(novoPedido);

        // Salvar pedidos
        fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));

        // Limpar carrinho do usuário
        const updatedCarrinho = carrinho.filter(item => item.userId !== userId);
        fs.writeFileSync(carrinhoPath, JSON.stringify(updatedCarrinho, null, 2));

        res.status(200).json({ message: 'Compra finalizada com sucesso.', pedido: novoPedido });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao finalizar a compra.' });
    }
});
//Remove produto by carrinho
//IsAdmin
//Formalziar json produtos, carrinho, pedidos

routes.post('/addCarrinho/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body; // ID do usuário enviado no corpo da requisição

    const produtosPath = path.join(__dirname, 'produtos.json');
    const carrinhoPath = path.join(__dirname, 'carrinho.json');

    try {
        const produtoId = parseInt(id, 10);
        if (isNaN(produtoId) || !userId) {
            return res.status(400).json({ error: 'ID do produto ou do usuário inválido.' });
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

        const existingItem = carrinho.find(item => item.id === produtoId && item.userId === userId);
        if (existingItem) {
            // Atualizar quantidade do produto existente, respeitando o limite do estoque
            if (existingItem.quantity < produto.estoque) {
                existingItem.quantity += 1;
            } else {
                return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
            }
        } else {
            // Adicionar novo produto ao carrinho
            if (produto.estoque > 0) {
                carrinho.push({ ...produto, userId: parseInt(userId, 10), quantity: 1 });
            } else {
                return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
            }
        }

        try {
            fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2));
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao escrever no arquivo carrinho.json.' });
        }

        res.status(200).json({ message: 'Produto adicionado ao carrinho com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro inesperado ao adicionar o produto ao carrinho.' });
    }
});

routes.get('/carrinho/:userId', (req, res) => {
    const { userId } = req.params;
    const carrinhoPath = path.join(__dirname, 'carrinho.json');
    try {
        if (!fs.existsSync(carrinhoPath)) {
            fs.writeFileSync(carrinhoPath, JSON.stringify([]));
        }
        const carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        const userCart = carrinho.filter(item => item.userId === parseInt(userId, 10));
        res.status(200).json(userCart);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar o carrinho.' });
    }
});

routes.put('/updateCart', (req, res) => {
    const { productId, change, userId } = req.body; // Adicionado userId para identificar o carrinho do usuário
    const carrinhoPath = path.join(__dirname, 'carrinho.json');
    const produtosPath = path.join(__dirname, 'produtos.json');

    try {
        // Carregar carrinho
        const carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        const produtoCarrinho = carrinho.find(item => item.id === productId && item.userId === userId);

        if (!produtoCarrinho) {
            return res.status(404).json({ error: 'Produto não encontrado no carrinho.' });
        }

        // Carregar produtos
        const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));
        const produto = produtos.find(p => p.id === productId && !p.excluido);

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
        }

        // Atualizar quantidade, respeitando o limite do estoque
        const novaQuantidade = produtoCarrinho.quantity + change;
        if (novaQuantidade > produto.estoque) {
            return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}.` });
        }
        if (novaQuantidade < 1) {
            return res.status(400).json({ error: 'A quantidade mínima é 1.' });
        }

        produtoCarrinho.quantity = novaQuantidade;

        // Salvar carrinho atualizado
        fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2));
        res.status(200).json({ message: 'Quantidade atualizada com sucesso.', produtoCarrinho });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o carrinho.' });
    }
});

routes.post('/removeItem', (req, res) => {
    const { productId, userId } = req.body; // Receber o userId no corpo da requisição
    const carrinhoPath = path.join(__dirname, 'carrinho.json');
    try {
        let carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        carrinho = carrinho.filter(item => item.id !== productId || item.userId !== userId); // Filtrar por productId e userId
        fs.writeFileSync(carrinhoPath, JSON.stringify(carrinho, null, 2));
        res.status(200).json({ message: 'Produto removido com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover o produto do carrinho.' });
    }
});

routes.get('/status-compra/:pedidoId', (req, res) => {
    const { pedidoId } = req.params;
    const userId = req.userId; // ID do usuário logado
    const pedidosPath = path.join(__dirname, 'pedidos.json');

    try {
        if (!fs.existsSync(pedidosPath)) {
            return res.status(404).json({ error: 'Arquivo de pedidos não encontrado.' });
        }

        const pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'));
        const pedido = pedidos.find(p => p.pedidoId === parseInt(pedidoId, 10) && p.usuarioId === userId);

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado ou não pertence ao usuário.' });
        }

        const response = {
            pedidoId: pedido.pedidoId,
            usuarioId: pedido.usuarioId,
            dataCompra: pedido.dataCompra, // Usar a propriedade correta
            status: 'aprovado', // Status fixo para exemplo
            itens: pedido.itens.map(item => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade,
                preco: item.preco // Usar o preço correto do item
            })),
            totalPrice: pedido.totalPrice // Usar o preço total correto
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o pedido.' });
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

routes.get('/compras/:userId', (req, res) => {
    const { userId } = req.params;
    const pedidosPath = path.join(__dirname, 'pedidos.json');

    try {
        if (!fs.existsSync(pedidosPath)) {
            return res.status(404).json({ error: 'Arquivo de pedidos não encontrado.' });
        }

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




routes.get('/admin/pedidos', (req, res) => {
    const pedidosPath = path.join(__dirname, 'pedidos.json');

    try {
        if (!fs.existsSync(pedidosPath)) {
            return res.status(404).json({ error: 'Arquivo de pedidos não encontrado.' });
        }

        const pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'));
        const sortedPedidos = pedidos.sort((a, b) => new Date(b.dataCompra) - new Date(a.dataCompra)); // Ordenar do último ao primeiro

        res.status(200).json(sortedPedidos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar os pedidos.' });
    }
});

routes.get('/admin/pedido/:pedidoId', (req, res) => {
    const { pedidoId } = req.params;
    const pedidosPath = path.join(__dirname, 'pedidos.json');

    try {
        if (!fs.existsSync(pedidosPath)) {
            return res.status(404).json({ error: 'Arquivo de pedidos não encontrado.' });
        }

        const pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'));
        const pedido = pedidos.find(p => p.pedidoId === parseInt(pedidoId, 10));

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

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

routes.post('/admin/add-produto', (req, res) => {
    const produtosPath = path.join(__dirname, 'produtos.json');
    const { nome, preco, faixaEtaria, descricao, tipo, marca, imagem, estoque } = req.body; // Extrair os campos necessários

    try {
        const produtos = fs.existsSync(produtosPath)
            ? JSON.parse(fs.readFileSync(produtosPath, 'utf-8'))
            : [];

        const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
        const novoProduto = {
            id: novoId,
            nome,
            preco: parseFloat(preco), // Garantir que o preço seja numérico
            faixaEtaria,
            descricao,
            tipo,
            marca,
            excluido: false,
            imagem,
            estoque: parseInt(estoque, 10), // Garantir que o estoque seja numérico
        };

        produtos.push(novoProduto);
        fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));

        res.status(201).json({ message: 'Produto adicionado com sucesso.', produto: novoProduto });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao adicionar o produto.' });
    }
});

routes.put('/usuario/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const usuariosPath = path.join(__dirname, 'usuarios.json');

    try {
        const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
        const user = usuarios.find(user => user.id === parseInt(id, 10) && !user.excluido);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado ou excluído.' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        user.username = username || user.username;
        user.email = email || user.email;

        fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
        res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o perfil.' });
    }
});

routes.put('/admin/edit-produto/:id', (req, res) => {
  const { id } = req.params;
  const { nome, preco, faixaEtaria, descricao, tipo, marca, imagem, estoque } = req.body;
  const produtosPath = path.join(__dirname, 'produtos.json');

  try {
    const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));
    const produto = produtos.find(produto => produto.id === parseInt(id, 10) && !produto.excluido);

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado ou excluído.' });
    }

    // Atualizar os campos do produto
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

routes.delete('/admin/delete-produto/:id', (req, res) => {
  const { id } = req.params;
  const produtosPath = path.join(__dirname, 'produtos.json');

  try {
    const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));
    const produtoIndex = produtos.findIndex(produto => produto.id === parseInt(id, 10));

    if (produtoIndex === -1) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    produtos[produtoIndex].excluido = true; // Marcar o produto como excluído
    fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));

    res.status(200).json({ message: 'Produto excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o produto.' });
  }
});


module.exports = routes;
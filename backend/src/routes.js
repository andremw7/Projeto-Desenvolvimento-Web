const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const routes = express.Router();

// Habilita CORS para permitir requisições de diferentes origens
// Enables CORS to allow requests from different origins
routes.use(cors());

// Middleware para extrair o ID do usuário do header da requisição
// Middleware to extract the user ID from the request header
routes.use((req, res, next) => {
    const loggedUserId = req.headers['x-user-id'];
    if (loggedUserId) {
        req.userId = parseInt(loggedUserId, 10);
    }
    next();
});

// Define o caminho base onde os arquivos JSON estão salvos
// Defines the base path where the JSON files are stored
const bancoJsonPath = path.join(__dirname, '../banco_json');

// Rota de login: verifica credenciais e retorna dados do usuário
// Login route: checks credentials and returns user data
routes.post('/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const users = JSON.parse(fs.readFileSync(path.join(bancoJsonPath, 'usuarios.json'), 'utf-8'));
        const user = users.find(user => 
            user.username === username && 
            user.password === password && 
            !user.excluido
        );

        if (user) {
            return res.status(200).json({ 
                message: 'Login successful', 
                userId: user.id, 
                admin: user.admin 
            });
        } else {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }
    } catch (error) {
        console.error('Erro ao processar login:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});


// Rota de registro: cria novo usuário se dados forem válidos
// Register route: creates a new user if data is valid
routes.post('/register', (req, res) => {
    const { username, email, password, confirmPassword, admin } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'As senhas não coincidem.' });
    }

    const usuariosPath = path.join(bancoJsonPath, 'usuarios.json');

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
            admin: !!admin,
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


// Rota para listar produtos ativos (não excluídos)
// Route to list active (not deleted) products
routes.get('/produtos', (req, res) => {
    const filePath = path.join(bancoJsonPath, 'produtos.json');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const produtos = JSON.parse(data).filter(produto => !produto.excluido);
        res.status(200).json(produtos);
    } catch (err) {
        console.error('Erro ao ler o arquivo de produtos:', err);
        res.status(500).json({ error: 'Erro ao ler o arquivo de produtos.' });
    }
});

// Finaliza a compra do usuário: atualiza estoque, grava pedido e limpa o carrinho
// Finalizes user purchase: updates stock, records order, and clears cart
routes.post('/finalizarCompra', (req, res) => {
    const carrinhoPath = path.join(bancoJsonPath, 'carrinho.json');
    const produtosPath = path.join(bancoJsonPath, 'produtos.json');
    const pedidosPath = path.join(bancoJsonPath, 'pedidos.json');
    const { userId } = req.body;

    try {
        if (!fs.existsSync(carrinhoPath)) {
            return res.status(400).json({ error: 'Carrinho vazio.' });
        }
        const carrinho = JSON.parse(fs.readFileSync(carrinhoPath, 'utf-8'));
        const userCart = carrinho.filter(item => item.userId === userId);
        if (!userCart.length) {
            return res.status(400).json({ error: 'Carrinho vazio.' });
        }

        const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf-8'));

        for (const item of userCart) {
            const produto = produtos.find(p => p.id === item.id && !p.excluido);
            if (!produto) {
                return res.status(404).json({ error: `Produto com id ${item.id} não encontrado.` });
            }
            if (produto.estoque < item.quantity) {
                return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome || produto.id}.` });
            }
            produto.estoque -= item.quantity;
        }

        fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));

        let pedidos = [];
        if (fs.existsSync(pedidosPath)) {
            pedidos = JSON.parse(fs.readFileSync(pedidosPath, 'utf-8'));
        }

        // Gera um novo pedido com base no carrinho do usuário, calcula o total, salva no arquivo de pedidos,
        // limpa o carrinho correspondente e envia a resposta com os dados da compra.
        // Generates a new order based on the user's cart, calculates the total, saves it to the orders file,
        // clears the corresponding cart, and sends a response with the purchase details.
        const pedidoId = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.pedidoId)) + 1 : 1;
        const totalPrice = userCart.reduce((sum, item) => sum + (item.preco * item.quantity), 0);

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

        fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));

        const updatedCarrinho = carrinho.filter(item => item.userId !== userId);
        fs.writeFileSync(carrinhoPath, JSON.stringify(updatedCarrinho, null, 2));

        res.status(200).json({ message: 'Compra finalizada com sucesso.', pedido: novoPedido });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao finalizar a compra.' });
    }
});


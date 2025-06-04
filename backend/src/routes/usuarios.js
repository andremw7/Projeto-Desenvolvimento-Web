const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const bancoJsonPath = path.join(__dirname, '../../banco_json'); // Caminho para os arquivos JSON

// Rota para login de usuários
// Busca o usuário pelo username e password, verifica se não está excluído e retorna dados básicos
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    try {
        // Lê todos os usuários do arquivo JSON
        const users = JSON.parse(fs.readFileSync(path.join(bancoJsonPath, 'usuarios.json'), 'utf-8'));
        // Procura usuário válido
        const user = users.find(user => 
            user.username === username && 
            user.password === password && 
            !user.excluido
        );

        if (user) {
            // Login bem-sucedido
            return res.status(200).json({ 
                message: 'Login successful', 
                userId: user.id, 
                admin: user.admin 
            });
        } else {
            // Usuário ou senha inválidos
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }
    } catch (error) {
        // Erro de leitura ou processamento
        console.error('Erro ao processar login:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// Rota para registro de novos usuários
// Valida se as senhas coincidem, se já existe usuário/email e adiciona novo usuário ao JSON
router.post('/register', (req, res) => {
    const { username, email, password, confirmPassword, admin } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'As senhas não coincidem.' });
    }

    const usuariosPath = path.join(bancoJsonPath, 'usuarios.json');

    try {
        // Lê todos os usuários existentes
        const usuarios = fs.existsSync(usuariosPath)
            ? JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'))
            : [];

        // Verifica se já existe usuário ou email igual
        const userExists = usuarios.some(user => user.username === username || user.email === email);
        if (userExists) {
            return res.status(400).json({ error: 'Usuário ou e-mail já cadastrado.' });
        }

        // Cria novo usuário
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

// Rota para buscar informações de um usuário específico
// Retorna apenas dados públicos do usuário, nunca a senha
router.get('/usuario/:id', (req, res) => {
    const userId = req.userId || req.params.id;

    try {
        // Lê todos os usuários
        const users = JSON.parse(fs.readFileSync(path.join(bancoJsonPath, 'usuarios.json'), 'utf-8'));
        // Busca usuário pelo ID e verifica se não está excluído
        const user = users.find(user => user.id === parseInt(userId, 10) && !user.excluido);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado ou excluído.' });
        }

        // Retorna apenas dados públicos
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

// Rota para atualizar informações de um usuário
// Exige senha atual para confirmação, atualiza username/email
router.put('/usuario/:id', (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const usuariosPath = path.join(bancoJsonPath, 'usuarios.json');

    try {
        // Lê todos os usuários
        const usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
        // Busca usuário pelo ID e verifica se não está excluído
        const user = usuarios.find(user => user.id === parseInt(id, 10) && !user.excluido);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado ou excluído.' });
        }

        // Confirmação de senha obrigatória
        if (user.password !== password) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        // Atualiza dados
        user.username = username || user.username;
        user.email = email || user.email;

        fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
        res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o perfil.' });
    }
});

module.exports = router;

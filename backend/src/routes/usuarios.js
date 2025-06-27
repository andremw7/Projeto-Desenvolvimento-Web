const express = require('express');
const connectMongo = require('../mongoClient');

const router = express.Router();

// PT: Rota para login de usuários
// EN: Route for user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = await connectMongo();
    const usuariosCollection = db.collection('usuarios');
    const user = await usuariosCollection.findOne({
      username,
      password,
      excluido: { $ne: true },
    });

    if (user) {
      return res.status(200).json({
        message: 'Login successful',
        userId: user.id,
        admin: user.admin,
      });
    } else {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
  } catch (error) {
    console.error('Erro ao processar login:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// PT: Rota para registro de novos usuários
// EN: Route to register new users
router.post('/register', async (req, res) => {
  const { username, email, password, confirmPassword, admin } = req.body;

  // PT: Verifica se as senhas coincidem
  // EN: Checks if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'As senhas não coincidem.' });
  }

  try {
    const db = await connectMongo();
    const usuariosCollection = db.collection('usuarios');

    // PT: Verifica se usuário ou email já estão cadastrados
    // EN: Checks if username or email are already registered
    const userExists = await usuariosCollection.findOne({
      $or: [{ username }, { email }],
    });
    if (userExists) {
      return res.status(400).json({ error: 'Usuário ou e-mail já cadastrado.' });
    }

    // PT: Gera novo ID sequencial
    // EN: Generates a new sequential ID
    const ultimoUsuario = await usuariosCollection
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const novoId = ultimoUsuario.length > 0 ? ultimoUsuario[0].id + 1 : 1;

    const newUser = {
      id: novoId,
      username,
      email,
      password,
      admin: !!admin,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      excluido: false,
    };

    // PT: Insere novo usuário no banco
    // EN: Inserts new user into the database
    await usuariosCollection.insertOne(newUser);
    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao registrar o usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar o usuário.' });
  }
});

// PT: Rota para buscar informações de um usuário específico
// EN: Route to get information for a specific user
router.get('/usuario/:id', async (req, res) => {
  const userId = req.userId || req.params.id;

  try {
    const db = await connectMongo();
    const usuariosCollection = db.collection('usuarios');
    const user = await usuariosCollection.findOne({
      id: parseInt(userId, 10),
      excluido: { $ne: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado ou excluído.' });
    }

    // PT: Retorna dados públicos do usuário
    // EN: Returns public user data
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      admin: user.admin,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar informações do usuário.' });
  }
});

// PT: Rota para atualizar informações de um usuário
// EN: Route to update a user's information
router.put('/usuario/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  try {
    const db = await connectMongo();
    const usuariosCollection = db.collection('usuarios');

    // PT: Busca o usuário com o ID fornecido
    // EN: Fetches user by provided ID
    const user = await usuariosCollection.findOne({
      id: parseInt(id, 10),
      excluido: { $ne: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado ou excluído.' });
    }

    // PT: Verifica se a senha informada é a correta
    // EN: Checks if the provided password is correct
    if (user.password !== password) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }
    const atualizacao = {
      ...(username && { username }),
      ...(email && { email }),
    };

    await usuariosCollection.updateOne(
      { id: parseInt(id, 10) },
      { $set: atualizacao }
    );

    res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar o perfil:', error);
    res.status(500).json({ error: 'Erro ao atualizar o perfil.' });
  }
});

module.exports = router;

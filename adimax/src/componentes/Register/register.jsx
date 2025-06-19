import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importar o AuthContext
import './register.css';

function Register() {
  const { isAdmin } = useAuth(); // Verificar se o usuário atual é administrador
  // Estados para os campos do formulário
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdminUser, setIsAdminUser] = useState(false); // Estado para definir se o novo usuário será administrador
  const [error, setError] = useState('');

  // Função para lidar com o envio do formulário de registro
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validação de senha
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      // Envia os dados para a API de registro
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword, admin: isAdminUser }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registro bem-sucedido!');
        // Limpa o formulário após sucesso
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsAdminUser(false);
        setError('');
      } else {
        setError(data.error || 'Erro ao registrar.');
      }
    } catch (error) {
      setError('Erro de conexão com o servidor.');
    }
  };

  return (
    <>
      {/* Navegação do admin (apenas se for admin) */}
      {isAdmin && (
        <div className="admin-navigation">
          <button onClick={() => window.location.href = '/admin/produtos'}>Meus Produtos</button>
          <button onClick={() => window.location.href = '/admin/vendas'}>Vendas/Pedidos</button>
          <button onClick={() => window.location.href = '/admin/add-produto'}>Adicionar Produto</button>
          <button onClick={() => window.location.href = '/admin/perfil'}>Perfil Admin</button>
          <button onClick={() => window.location.href = '/register'}>Registrar Admin</button>
        </div>
      )}
      <main>
        <div className="content">
          <h2>Registrar</h2>
          {/* Exibe mensagem de erro se houver */}
          {error && <p className="error-message">{error}</p>}
          {/* Formulário de registro */}
          <form onSubmit={handleRegister} className="register-form">
            <label htmlFor="username">Usuário:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label htmlFor="confirmPassword">Confirme sua senha:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* Checkbox para registrar como admin, visível apenas para admins */}
            {isAdmin && (
              <div className="admin-checkbox">
                <label htmlFor="isAdminUser">Registrar como administrador:</label>
                <input
                  type="checkbox"
                  id="isAdminUser"
                  name="isAdminUser"
                  checked={isAdminUser}
                  onChange={(e) => setIsAdminUser(e.target.checked)}
                />
              </div>
            )}

            <button type="submit">Registrar</button>
          </form>
        </div>
      </main>
    </>
  );
}

export default Register;
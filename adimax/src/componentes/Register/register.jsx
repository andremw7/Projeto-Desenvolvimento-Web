import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importar o AuthContext // Import AuthContext
import './register.css';

function Register() {
  const { isAdmin } = useAuth(); // Verificar se o usuário atual é administrador // Check if current user is admin

  // Estados para os campos do formulário
  // States for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdminUser, setIsAdminUser] = useState(false); // Estado para definir se o novo usuário será administrador // State for admin registration
  const [error, setError] = useState(''); // Estado para mensagens de erro // State for error messages

  // Função para lidar com o envio do formulário de registro
  // Function to handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validação de senha
    // Password confirmation validation
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.'); // Passwords do not match
      return;
    }

    try {
      // Envia os dados para a API de registro
      // Send data to registration API
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword, admin: isAdminUser }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registro bem-sucedido!'); // Registration successful!
        
        // Limpa o formulário após sucesso
        // Clear form after success
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsAdminUser(false);
        setError('');
      } else {
        setError(data.error || 'Erro ao registrar.'); // Show API error
      }
    } catch (error) {
      setError('Erro de conexão com o servidor.'); // Server connection error
    }
  };

  return (
    <>
      {/* Navegação do admin (apenas se for admin) */}
      {/* Admin navigation (only visible to admins) */}
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
          {/* Show error message if exists */}
          {error && <p className="error-message">{error}</p>}

          {/* Formulário de registro */}
          {/* Registration form */}
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
            {/* Admin registration checkbox, visible only to admins */}
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

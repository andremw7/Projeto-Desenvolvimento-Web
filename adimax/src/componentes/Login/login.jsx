import { useState, useEffect } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  // Estados para campos do formulário e mensagens
  // States for form fields and messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  // Se já estiver logado, exibe mensagem e redireciona
  // If already logged in, show message and redirect
  useEffect(() => {
    if (!loading && isAuthenticated) {
      setError('Você já está logado');
      setTimeout(() => {
        alert(error);
        navigate('/');
      }, 500);
    }
  }, [isAuthenticated, loading, navigate, error]);

  // Função para lidar com o envio do formulário de login
  // Function to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Envia os dados para a API de login
      // Send data to login API
      const response = await axios.post('http://localhost:3000/login', 
        { username, password }, // Corpo da requisição
                                 // Request body
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      if (response.status === 200) {
        const { userId, admin } = response.data;
        login(userId, admin); // Atualiza o estado de autenticação com userId e admin
                              // Update auth state with userId and admin
        navigate('/');
      }
    } catch (error) {
      if (!error.response) {
        setError('Erro de conexão com o servidor');
      } else if (error.response.status === 401) {
        setError('Usuário ou senha inválidos');
      } else {
        setError('Erro desconhecido');
      }
    }
  };
  
  return (
    <main>
      <section>
        <div className="content-login">
          <h2>Login</h2>
          {/* Exibe mensagem de erro se houver */}
          {/* Show error message if present */}
          {error && <p className="error-message">{error}</p>}
          {loading ? (
            <p>Carregando...</p>
          ) : (
            // Formulário de login
            // Login form
            <form className="login-form" onSubmit={handleLogin}>
              <label htmlFor="username">Usuário:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
              />

              <label htmlFor="password">Senha:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />

              <button type="submit" className="login-button">Login</button>
              <button
                type="button"
                className="register-button"
                onClick={() => navigate('/register')}
              >
                Cadastrar-se
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default Login;

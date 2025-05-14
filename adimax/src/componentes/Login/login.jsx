import { useState, useEffect } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { useAuth } from '../../context/AuthContext'; // Importar o contexto

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth(); // Adicionar `loading` para verificar o carregamento do estado

  useEffect(() => {
    if (!loading && isAuthenticated) { // Garantir que o estado de autenticação foi carregado
      setError('Você já está logado'); // Definir mensagem de erro
      setTimeout(() => {
        alert(error); // Mostrar mensagem como pop-up
        navigate('/'); // Redirecionar após exibir o pop-up
      }, 500);
    }
  }, [isAuthenticated, loading, navigate, error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/login', 
        JSON.stringify({ username, password }),
        {
          headers: {'Content-Type': 'application/json'}
        }
      );
      if (response.status === 200) {
        const { userId, admin } = response.data; // Obter o userId e admin do servidor
        login(userId, admin); // Atualizar o estado de autenticação com userId e admin
        const previousPage = document.referrer.startsWith(window.location.origin)
          ? document.referrer.replace(window.location.origin, '')
          : '/';
        navigate(previousPage);
      }
    } catch (error) {
      if (!error.response) {
        setError('Erro de conexão com o servidor');
      } else if (error.response.status === 401) {
        setError('Usuário ou senha inválidos');
      }
    }
  };
  
  return (
    <main>
      <section>
        <div className="content-login">
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>} {/* Exibir mensagem de erro claramente */}
          {loading ? ( // Mostrar um indicador de carregamento enquanto o estado é carregado
            <p>Carregando...</p>
          ) : (
            <form className="login-form">
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

              <button
                type="submit"
                id="submit"
                name="submit"
                value="Enviar"
                className="login-button"
                onClick={(e) => handleLogin(e)}
              >Login</button>
              <button
                type="button"
                className="register-button"
                onClick={() => (window.location.href = 'register')}
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

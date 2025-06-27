import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './edit_perfil.css';

function EditPerfil() {
  const { userId } = useAuth();
  // Estados para os campos do formulário
  // States for the form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar se o usuário é admin
                                                 // State to check if the user is admin
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Carrega os dados do usuário ao montar o componente
  // Load user data when the component mounts
  useEffect(() => {
    fetch(`http://localhost:3000/usuario/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário.');
        }
        return response.json();
      })
      .then(data => {
        setUsername(data.username);
        setEmail(data.email);
        setIsAdmin(data.admin); // Verificar se o usuário é admin
                                // Check if the user is admin
      })
      .catch(error => {
        console.error('Erro ao carregar dados do usuário:', error.message);
        setError('Erro ao carregar dados do usuário.');
      });
  }, [userId]);

  // Função para lidar com o envio do formulário de edição de perfil
  // Function to handle profile edit form submission
  const handleEditPerfil = async (e) => {
    e.preventDefault();

    if (!password) {
      setError('A senha é obrigatória para confirmar as alterações.');
      return;
    }

    try {
      // Envia os dados atualizados para a API
      // Send updated data to the API
      const response = await fetch(`http://localhost:3000/usuario/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Perfil atualizado com sucesso!');
        setError('');
        setTimeout(() => {
          // Redirecionar com base no tipo de conta
          // Redirect based on account type
          if (isAdmin) {
            navigate('/admin/perfil'); // Redirecionar para a página de admin
                                       // Redirect to admin profile page
          } else {
            navigate('/perfil/dados'); // Redirecionar para a página de dados do perfil
                                       // Redirect to user profile data page
          }
        }, 1500); // Adicionar um pequeno atraso para exibir a mensagem de sucesso
                 // Add a small delay to show the success message
      } else {
        setError(data.error || 'Erro ao atualizar o perfil.');
      }
    } catch (error) {
      setError('Erro de conexão com o servidor.');
    }
  };

  return (
    <main>
      <div className="edit-perfil-content">
        <h2>Editar Perfil</h2>
        {/* Mensagens de erro e sucesso */}
        {/* Error and success messages */}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        {/* Formulário de edição de perfil */}
        {/* Profile edit form */}
        <form onSubmit={handleEditPerfil} className="edit-perfil-form">
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
            placeholder="Digite sua senha para confirmar"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
    </main>
  );
}

export default EditPerfil;

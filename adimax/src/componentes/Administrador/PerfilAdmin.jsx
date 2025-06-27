import React, { useState, useEffect } from 'react';
import { Edit, User, Mail, Calendar, Clock, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Adicionado useNavigate — Added useNavigate
import { useAuth } from '../../context/AuthContext';
import './PerfilAdmin.css';

const ProfilePage = () => {
  // Obtém informações de autenticação do contexto — Get authentication info from context
  const { isAuthenticated, userId } = useAuth();
  // Estado para armazenar os dados do perfil do usuário — State to store user profile data
  const [userProfile, setUserProfile] = useState(null);
  // Estado de carregamento e erro — Loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Inicializar useNavigate — Initialize useNavigate

  // Carrega os dados do perfil do usuário ao montar o componente — Load user profile data on component mount
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetch(`http://localhost:3000/usuario/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro ao buscar dados do usuário: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          setUserProfile(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar dados do usuário:', error.message);
          setError(error.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  // Formata a data para exibição — Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Redireciona para a página de edição de perfil — Redirect to profile edit page
  const handleEditProfile = () => {
    navigate('/perfil/edit');
  };

  // Renderizações condicionais para estados de autenticação, carregamento e erro — Conditional rendering for auth/loading/error
  if (!isAuthenticated) {
    return <p className="perfil-aviso">Você precisa estar logado para acessar o perfil.</p>;
  }

  if (loading) {
    return <p className="perfil-aviso">Carregando informações...</p>;
  }

  if (error) {
    return <p className="perfil-aviso">Erro ao carregar informações: {error}</p>;
  }

  if (!userProfile) {
    return <p className="perfil-aviso">Nenhum dado encontrado para o usuário.</p>;
  }

  return (
    <div className="perfil-base-page">
      {/* Navegação do admin — Admin navigation */}
      <div className="admin-navigation">
        <button onClick={() => window.location.href = '/admin/produtos'}>Meus Produtos</button>
        <button onClick={() => window.location.href = '/admin/vendas'}>Vendas/Pedidos</button>
        <button onClick={() => window.location.href = '/admin/add-produto'}>Adicionar Produto</button>
        <button onClick={() => window.location.href = '/admin/perfil'}>Perfil Admin</button>
        <button onClick={() => window.location.href = '/register'}>Registrar Admin</button>
      </div>

      <div className="perfil-base-container">
        <div className="perfil-base-card">
          <div className="perfil-base-card-header">
            <div className="perfil-base-header-content">
              <div className="perfil-base-avatar">
                <User className="perfil-base-avatar-icon" />
              </div>
              <div>
                <h2 className="perfil-base-title">{userProfile.username}</h2>
                <div className="perfil-base-badges">
                  <span className={`perfil-base-badge ${userProfile.admin ? 'perfil-base-admin' : 'perfil-base-user'}`}>
                    <Shield className="perfil-base-badge-icon" />
                    {userProfile.admin ? 'Administrador' : 'Usuário'}
                  </span>
                  <span className={`perfil-base-badge ${userProfile.excluido ? 'perfil-base-inativo' : 'perfil-base-ativo'}`}>
                    {userProfile.excluido ? 'Inativo' : 'Ativo'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="perfil-base-card-content">
            <div className="perfil-base-grid">
              <div className="perfil-base-section">
                <h3 className="perfil-base-section-title">Informações Pessoais:</h3>
                <div className="perfil-base-item">
                  <User className="perfil-base-item-icon" />
                  <div>
                    <p className="perfil-base-item-label">Nome de usuário:</p>
                    <p className="perfil-base-item-value">{userProfile.username}</p>
                  </div>
                </div>
                <div className="perfil-base-item">
                  <Mail className="perfil-base-item-icon" />
                  <div>
                    <p className="perfil-base-item-label">E-mail:</p>
                    <p className="perfil-base-item-value">{userProfile.email}</p>
                  </div>
                </div>
                <div className="perfil-base-item">
                  <span className="perfil-base-item-icon">ID:</span>
                  <div>
                    <p className="perfil-base-item-label">ID do usuário</p>
                    <p className="perfil-base-item-value">#{userProfile.id}</p>
                  </div>
                </div>
              </div>

              <div className="perfil-base-section">
                <h3 className="perfil-base-section-title">Informações da Conta</h3>
                <div className="perfil-base-item">
                  <Calendar className="perfil-base-item-icon" />
                  <div>
                    <p className="perfil-base-item-label">Criado em</p>
                    <p className="perfil-base-item-value">{formatDate(userProfile.createdAt)}</p>
                  </div>
                </div>
                <div className="perfil-base-item">
                  <Clock className="perfil-base-item-icon" />
                  <div>
                    <p className="perfil-base-item-label">Último acesso</p>
                    <p className="perfil-base-item-value">{userProfile.lastLogin ? formatDate(userProfile.lastLogin) : 'Nunca'}</p>
                  </div>
                </div>
                <div className="perfil-base-item">
                  <Shield className="perfil-base-item-icon" />
                  <div>
                    <p className="perfil-base-item-label">Tipo de conta</p>
                    <p className="perfil-base-item-value">{userProfile.admin ? 'Administrador' : 'Usuário Padrão'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="perfil-base-actions">
              {/* Botão para editar o perfil — Button to edit profile */}
              <button 
                onClick={handleEditProfile}
                className="perfil-base-edit-button"
              >
                <Edit className="perfil-base-edit-icon" />
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

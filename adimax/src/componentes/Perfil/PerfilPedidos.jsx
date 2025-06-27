import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; // Adicionado useNavigate // Added useNavigate
import './perfil.css';

const PerfilPedidos = () => {
  // Obtém informações de autenticação do contexto
  // Get authentication info from context
  const { isAuthenticated, userId } = useAuth();
  // Estado para armazenar as compras do usuário
  // State to store user's purchases
  const [compras, setCompras] = useState([]);
  // Estado de carregamento
  // Loading state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Inicializar useNavigate // Initialize useNavigate

  // Carrega as compras do usuário ao montar o componente
  // Load user purchases when the component mounts
  useEffect(() => {
    if (isAuthenticated && userId) {
      fetch(`http://localhost:3000/compras/${userId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erro ao carregar as compras: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          setCompras(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao carregar as compras:', error.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  // Renderizações condicionais para estados de autenticação e carregamento
  // Conditional rendering for authentication and loading states
  if (!isAuthenticated) {
    return <p className="perfil-aviso">Você precisa estar logado para acessar os pedidos.</p>;
  }

  if (loading) {
    return <p className="perfil-aviso">Carregando informações...</p>;
  }

  return (
    <div className="perfil-page">
      {/* Abas de navegação do perfil */}
      {/* Profile navigation tabs */}
      <div className="tab-buttons">
        <Link to="/perfil/dados" className="tab-button">Perfil</Link>
        <Link to="/perfil/pedidos" className="tab-button active">Pedidos</Link>
      </div>
      <div className="perfil-container">
        <h2 className="perfil-titulo">Minhas Compras</h2>
        {/* Tabela de compras */}
        {/* Purchases table */}
        {compras.length > 0 ? (
          <div className="compras-table-container">
            <table className="compras-table">
              <thead>
                <tr>
                  <th>ID do Pedido</th>
                  <th>Data da Compra</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {compras.map(compra => (
                  <tr key={compra.pedidoId}>
                    <td>{compra.pedidoId}</td>
                    <td>{new Date(compra.dataCompra).toLocaleDateString('pt-BR')}</td>
                    <td>R$ {compra.totalPrice.toFixed(2)}</td>
                    <td>{compra.status || 'Aprovado'}</td>
                    <td>
                      {/* Botão para ver detalhes do pedido */}
                      {/* Button to view order details */}
                      <button 
                        className="detalhes-button" 
                        onClick={() => navigate(`/status-compra/${compra.pedidoId}`)}
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="perfil-aviso">Nenhuma compra encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default PerfilPedidos;

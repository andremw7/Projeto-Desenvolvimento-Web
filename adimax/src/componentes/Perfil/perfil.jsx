import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Perfil = () => {
  const { isAuthenticated, userId } = useAuth(); // Obter o ID do usuário do AuthContext
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Verificando autenticação e ID do usuário...', { isAuthenticated, userId });
    if (isAuthenticated && userId) {
      console.log(`Iniciando requisição para buscar dados do usuário com ID: ${userId}`);
      // Fazer requisição à API para buscar os dados do usuário
      fetch(`http://localhost:3000/usuario/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log(`Resposta da API recebida. Status: ${response.status}`);
          if (!response.ok) {
            throw new Error(`Erro ao buscar dados do usuário: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Dados do usuário recebidos:', data);
          setUserData(data); // Armazenar os dados do usuário no estado
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar dados do usuário:', error.message);
          setLoading(false);
        });
    } else {
      console.warn('Usuário não autenticado ou ID do usuário não disponível.');
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  if (!isAuthenticated) {
    console.warn('Tentativa de acessar o perfil sem estar autenticado.');
    return <p>Você precisa estar logado para acessar o perfil.</p>;
  }

  if (loading) {
    console.log('Carregando informações do usuário...');
    return <p>Carregando informações do usuário...</p>;
  }

  return (
    <div>
      <h1>Perfil do Usuário</h1>
      {userData ? (
        <div>
          <p><strong>ID:</strong> {userData.id}</p>
          <p><strong>Nome:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Admin:</strong> {userData.admin ? 'Sim' : 'Não'}</p>
          <p><strong>Data de Criação:</strong> {new Date(userData.createdAt).toLocaleString()}</p>
          <p><strong>Último Login:</strong> {new Date(userData.lastLogin).toLocaleString()}</p>
        </div>
      ) : (
        <p>Erro ao carregar informações do usuário.</p>
      )}
    </div>
  );
};

export default Perfil;

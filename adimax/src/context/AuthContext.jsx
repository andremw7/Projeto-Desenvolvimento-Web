import { createContext, useState, useContext, useEffect } from 'react';

// Criação do contexto de autenticação
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estados para gerenciar autenticação, permissões e ID do usuário
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Indica se o usuário está autenticado
  const [isAdmin, setIsAdmin] = useState(false); // Indica se o usuário é administrador
  const [loading, setLoading] = useState(true); // Estado de carregamento inicial
  const [userId, setUserId] = useState(null); // Armazena o ID do usuário

  // Efeito para carregar o estado inicial do contexto a partir do localStorage
  useEffect(() => {
    console.log('Carregando estado inicial do AuthContext...');
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true'; // Recupera autenticação
    const storedAdmin = localStorage.getItem('isAdmin') === 'true'; // Recupera permissão de administrador
    const storedUserId = localStorage.getItem('userId'); // Recupera ID do usuário
    console.log('Estado inicial carregado:', { storedAuth, storedAdmin, storedUserId });

    setIsAuthenticated(storedAuth);
    setIsAdmin(storedAdmin);
    setUserId(storedUserId ? parseInt(storedUserId, 10) : null); // Converte o ID para número
    setLoading(false); // Finaliza carregamento
  }, []);

  // Função para realizar login
  const login = (id, admin = false) => {
    console.log('Realizando login...', { id, admin });
    setIsAuthenticated(true);
    setIsAdmin(admin);
    setUserId(id); // Armazena o ID do usuário
    localStorage.setItem('isAuthenticated', 'true'); // Persiste autenticação
    localStorage.setItem('isAdmin', admin.toString()); // Persiste permissão de administrador
    localStorage.setItem('userId', id); // Persiste ID do usuário
    console.log('Estado após login:', {
      isAuthenticated: true,
      isAdmin: admin,
      userId: id,
    });
  };

  // Função para realizar logout
  const logout = () => {
    console.log('Realizando logout...');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserId(null); // Limpa o ID do usuário
    localStorage.removeItem('isAuthenticated'); // Remove persistência de autenticação
    localStorage.removeItem('isAdmin'); // Remove persistência de permissão
    localStorage.removeItem('userId'); // Remove persistência do ID
  };

  // Provedor do contexto, disponibilizando os estados e funções
  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, userId, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);
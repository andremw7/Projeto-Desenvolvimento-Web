import { createContext, useState, useContext, useEffect } from 'react';

// Criação do contexto de autenticação / Creation of the authentication context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estados para gerenciar autenticação, permissões e ID do usuário
  // States to manage authentication, permissions and user ID
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Indica se o usuário está autenticado / Indicates if the user is authenticated
  const [isAdmin, setIsAdmin] = useState(false); // Indica se o usuário é administrador / Indicates if the user is an admin
  const [loading, setLoading] = useState(true); // Estado de carregamento inicial / Initial loading state
  const [userId, setUserId] = useState(null); // Armazena o ID do usuário / Stores the user ID

  // Efeito para carregar o estado inicial do contexto a partir do localStorage
  // Effect to load the initial context state from localStorage
  useEffect(() => {
    console.log('Carregando estado inicial do AuthContext...'); // Loading initial AuthContext state...
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true'; // Recupera autenticação / Retrieves authentication
    const storedAdmin = localStorage.getItem('isAdmin') === 'true'; // Recupera permissão de administrador / Retrieves admin permission
    const storedUserId = localStorage.getItem('userId'); // Recupera ID do usuário / Retrieves user ID
    console.log('Estado inicial carregado:', { storedAuth, storedAdmin, storedUserId }); // Initial state loaded

    setIsAuthenticated(storedAuth);
    setIsAdmin(storedAdmin);
    setUserId(storedUserId ? parseInt(storedUserId, 10) : null); // Converte o ID para número / Converts ID to number
    setLoading(false); // Finaliza carregamento / Ends loading
  }, []);

  // Função para realizar login / Function to perform login
  const login = (id, admin = false) => {
    console.log('Realizando login...', { id, admin }); // Performing login
    setIsAuthenticated(true);
    setIsAdmin(admin);
    setUserId(id); // Armazena o ID do usuário / Stores the user ID
    localStorage.setItem('isAuthenticated', 'true'); // Persiste autenticação / Persists authentication
    localStorage.setItem('isAdmin', admin.toString()); // Persiste permissão de administrador / Persists admin permission
    localStorage.setItem('userId', id); // Persiste ID do usuário / Persists user ID
    console.log('Estado após login:', {
      isAuthenticated: true,
      isAdmin: admin,
      userId: id,
    });
  };

  // Função para realizar logout / Function to perform logout
  const logout = () => {
    console.log('Realizando logout...'); // Performing logout
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserId(null); // Limpa o ID do usuário / Clears the user ID
    localStorage.removeItem('isAuthenticated'); // Remove persistência de autenticação / Removes authentication persistence
    localStorage.removeItem('isAdmin'); // Remove persistência de permissão / Removes permission persistence
    localStorage.removeItem('userId'); // Remove persistência do ID / Removes ID persistence
  };

  // Provedor do contexto, disponibilizando os estados e funções
  // Context provider, exposing states and functions
  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, userId, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto de autenticação / Hook to access the authentication context
export const useAuth = () => useContext(AuthContext);
